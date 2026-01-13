<template>
  <div class="">
    <div class="img-list">
      <uv-image
        v-for="(item, index) in displayList"
        :src="item"
        :key="index"
        width="150rpx"
        height="150rpx"
        @click="isPreview && preview()"
      />
      <div
        v-if="props.isShowOne && urlList.length > 1"
        class="img-overlay"
        @click="isPreview && preview()"
      >
        <div class="overlay-text">共{{ urlList.length }}张</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    pictureArr: {
      type: Array,
      default: () => [],
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    isRect: { type: Boolean, default: false },
    isShowOne: { type: Boolean, default: false },
  });
  const urlList = ref<Array<string>>([]);
  const displayList = computed(() =>
    props.isShowOne ? (urlList.value.length ? [urlList.value[0]] : []) : urlList.value,
  );
  const preview = () => {
    uni.previewImage({ urls: urlList.value });
  };
  const emit = defineEmits(['preview']);
  import { QualityType } from '@/enums/quality';
  // 初始canvas画框
  const initCanvas = (index: any) => {
    console.log('canvas');

    const canvas = wx.createOffscreenCanvas({ type: '2d' });
    const context = canvas.getContext('2d');
    const image = canvas.createImage();
    image.src = props.pictureArr[index].fileUrl;
    image.onload = () => {
      uni.getImageInfo({
        src: props.pictureArr[index].fileUrl,
        success: ({ width, height }) => {
          canvas.width = width;
          canvas.height = height;
          context.drawImage(image, 0, 0, width, height);

          for (const obj of props.pictureArr[index].alertLabelList) {
            context.strokeStyle = 'red';
            context.lineWidth = 4;
            context.strokeRect(obj.left, obj.top, obj.right - obj.left, obj.bottom - obj.top);
            const text = QualityType[obj.eventType as keyof typeof QualityType] || '未知类型';
            const textWidth = context.measureText(text).width;
            context.fillStyle = 'rgb(238,130,47)';
            context.fillRect(obj.left - 2, obj.top - 20, textWidth + 20, 24);
            context.fillStyle = '#fff';
            context.font = '16px sans-serif';

            context.fillText(text, obj.left, obj.top);
          }

          const dataUrl = canvas.toDataURL();
          urlList.value[index] = dataUrl;
          emit('preview', dataUrl);
        },
      });
    };
  };

  onMounted(() => {
    urlList.value = props.pictureArr.map((item: any) => item.fileUrl);
    if (!props.isRect) return;
    for (let index = 0; index < props.pictureArr.length; index++) {
      initCanvas(index);
    }
  });
</script>

<style lang="scss" scoped>
  .img-list {
    width: 100%;
    display: grid;
    grid-gap: 10rpx;
    box-sizing: border-box;
    grid-template-columns: repeat(3, 160rpx);
  }
  .img-overlay {
    position: absolute;
    width: 150rpx;
    height: 150rpx;
    background: rgba(0, 0, 0, 0.151);
  }
  .overlay-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 24rpx;
    font-weight: 600;
    z-index: 2;
  }
</style>
