<script lang="ts" setup>
import type { UploadFile, UploadProps } from 'ant-design-vue';

import { computed, nextTick, ref, unref, watch } from 'vue';

import { downloadUrl, upload } from '@xh/request';
import { downloadByUrl } from '@xh/utils';
import { Alert, Button, Image, message, Upload } from 'ant-design-vue';

import { useUploadType } from './helper';

const {
  accept,
  helpText,
  maxCount = 1,
  maxSize = 5,
  type,
  listType = 'text',
} = defineProps<{
  accept?: string[];
  disabled?: boolean;
  helpText?: string;
  listType?: UploadProps['listType'];
  maxCount?: number;
  maxSize?: number;
  type: string;
}>();

const defaultAcceptMap: Record<string, string[]> = {
  'picture-card': ['jpg', 'jpeg', 'png'],
  text: ['doc', 'docx', 'xlsx', 'pdf', 'jpg', 'png'],
};

const computedAccept = computed(() => {
  if (accept && accept.length > 0) return accept;
  if (listType && defaultAcceptMap[listType]) return defaultAcceptMap[listType];
  // 默认兜底为 text 类型
  return defaultAcceptMap.text;
});

// 获取上传文件类型的 accept 字符串
const { getStringAccept } = useUploadType({
  acceptRef: computedAccept,
  helpTextRef: helpText,
  maxCountRef: maxCount,
  maxSizeRef: maxSize,
});

// 扩展 UploadFile 类型以包含 filePath
interface CustomUploadFile extends UploadFile {
  filePath?: string;
}

const files = defineModel<any[]>('value', { default: [] });
const fileList = ref<CustomUploadFile[]>([]);
// 用于标记内部更新，避免在内部更新时触发 watch
const isInternalUpdate = ref(false);

watch(
  () => files.value,
  (newFiles) => {
    // 如果是内部更新，则不处理
    if (isInternalUpdate.value) return;

    if (!newFiles || !Array.isArray(newFiles)) {
      fileList.value = [];
      return;
    }

    // 将外部传入的文件数据转换为符合 UploadFile 类型的格式
    fileList.value = newFiles.map((file, index) => {
      // 如果已经是 UploadFile 类型，直接返回
      if (file.uid) return file as CustomUploadFile;

      // 否则构造一个符合 UploadFile 格式的对象
      return {
        ...file, // 保留原始数据的其他字段
        filePath: file.filePath,
        name: file.name || file.filePath?.split('/')?.pop(),
        response: file, // 保存原始响应
        status: 'done',
        thumbUrl: file.thumbUrl || file.url,
        uid: `${index}-${Date.now()}`, // 生成唯一ID
      } as CustomUploadFile;
    });
  },
  { deep: true, immediate: true },
);

function handleRemove(file: CustomUploadFile) {
  if (!file) return;
  const index = fileList.value.findIndex((item) => item.uid === file.uid);
  if (index !== -1) {
    fileList.value.splice(index, 1);

    // 设置内部更新标志，防止触发 watch
    isInternalUpdate.value = true;
    // 从 files 中移除对应的文件
    if (Array.isArray(files.value) && files.value.length > index) {
      files.value.splice(index, 1);
    }
    // 使用 nextTick 确保在当前更新周期结束后重置标志
    nextTick(() => {
      isInternalUpdate.value = false;
    });
  }
}

function beforeUpload(file: File) {
  if (accept?.length) {
    const isAcceptType = accept.some((type) => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.includes(type);
    });
    if (!isAcceptType) {
      message.error(`只能上传 ${getStringAccept} 格式的文件`);
      return Upload.LIST_IGNORE;
    }
  }

  // 文件大小校验
  const isLt = file.size / 1024 / 1024 < maxSize;
  if (!isLt) {
    message.error(`文件大小不能超过 ${maxSize}MB`);
    return Upload.LIST_IGNORE;
  }

  // 确保 fileList.value 是数组
  if (fileList.value && fileList.value.length >= maxCount) {
    message.error(`最多只能上传 ${maxCount} 个文件`);
    return Upload.LIST_IGNORE;
  }

  return true;
}

// 自定义上传方法
async function customRequest(options: any) {
  const { file, onError, onSuccess } = options;
  try {
    const res = await upload({ file, type: unref(type) });

    onSuccess?.(res);

    // 设置内部更新标志，防止触发 watch
    isInternalUpdate.value = true;
    // 更新文件列表
    const currentFiles = Array.isArray(files.value) ? [...files.value] : [];
    files.value = [...currentFiles, res];
    // 使用 nextTick 确保在当前更新周期结束后重置标志
    nextTick(() => {
      isInternalUpdate.value = false;
    });

    message.success(`${file.name} 上传成功`);
  } catch (error: any) {
    onError?.(error);
    handleRemove(file as CustomUploadFile);
  }
}

function handleDownload(file: CustomUploadFile) {
  if (!file) return;
  const filePath = file?.response?.filePath || file?.filePath;
  if (!filePath || !type) return;

  downloadUrl({ filePath, type }).then((url) => {
    if (typeof url === 'string') {
      downloadByUrl({ url });
    }
  });
}

const previewOpen = ref(false);
const previewImage = ref<string>('');
function handlePreview(file: CustomUploadFile) {
  if (!file) return;
  const url = file?.thumbUrl || file?.url || '';
  previewImage.value = typeof url === 'string' ? url : '';
  previewOpen.value = true;
}
</script>

<template>
  <div class="w-full">
    <Alert
      v-if="accept?.length || maxSize || maxCount"
      :message="`${getStringAccept} 类型， 最多${maxCount}个， 不超过${maxSize}MB `"
      type="info"
      show-icon
      class="mb-2"
    />
    <Upload
      v-model:file-list="fileList"
      :accept="getStringAccept"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      :disabled="disabled"
      :list-type="listType"
      :max-count="maxCount"
      @remove="handleRemove"
      @download="handleDownload"
      class="basic-upload w-full"
      @preview="handlePreview"
      :show-upload-list="{ showDownloadIcon: true }"
    >
      <template v-if="fileList && fileList.length < maxCount && !disabled">
        <slot>
          <div v-if="listType === 'picture-card'" style="font-size: 36px">+</div>
          <Button v-else>
            {{ helpText || '点击上传' }}
          </Button>
        </slot>
      </template>
    </Upload>
    <Image
      :preview="{
        visible: previewOpen,
        onVisibleChange: () => (previewOpen = false),
      }"
      :src="previewImage"
      :style="{ display: 'none' }"
    />
  </div>
</template>
<style lang="scss" scoped>
.basic-upload {
  :deep(.ant-upload-list-item-actions) {
    display: flex;
    align-items: center;
  }
}
</style>
