<!-- 上传文件 -->
<script lang="ts" setup>
  import useUpload from '@/hooks/file/useUpload';
  const props = defineProps({
    // 最多可以选择的
    count: {
      type: Number,
      default: 9,
    },
    //桶名
    fileType: {
      type: String,
      default: 'erp',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    // 文件限制大小
    fileSize: {
      type: Number,
      default: 15,
    },
  });

  const { imageUpload } = useUpload(props?.fileType ?? 'train');

  const fileList: any = defineModel();

  function afterRead({ file }: any) {
    if (props.count >= 1) {
      imageUpload(file.url).then((res) => {
        fileList.value.push(res);
      });
      return;
    }
    file.forEach((item: any) => {
      imageUpload(item.url).then((res) => {
        fileList.value.push(res);
      });
    });
  }
  function deletePic({ index }: any) {
    fileList.value.splice(index, 1);
  }
</script>

<template>
  <div class="upload-image">
    <uv-alert
      v-if="!props.readonly"
      type="info"
      :description="`请选择图片，大小不超过 ${props.fileSize}M，最多上传 ${props.count}张`"
      customStyle="margin: 10rpx 0"
    ></uv-alert>
    <uv-upload
      v-if="props.readonly"
      customStyle="margin-top:20rpx"
      :fileList="fileList"
      accept="image"
      :disabled="props.readonly"
      :deletable="!props.readonly"
    >
      <div v-if="false"></div>
    </uv-upload>
    <uv-upload
      v-else
      :fileList="fileList"
      accept="image"
      :maxCount="props.count"
      @afterRead="afterRead"
      @delete="deletePic"
      useBeforeRead
    />
  </div>
</template>
