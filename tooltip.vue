<template>
  <view class="uni-tooltip" @click.stop="togglePopup">
    <slot></slot>
    <view class="uni-tooltip-popup" :style="initPlacement" :class="{ show: visible }">
      <slot name="content"> </slot>
    </view>
  </view>
</template>

<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    placement: {
      type: String,
      default: 'bottom',
    },
  });

  const visible = ref(false);

  const initPlacement = computed(() => {
    let style = {};
    switch (props.placement) {
      case 'left':
        style = {
          top: '50%',
          transform: 'translateY(-50%)',
          right: '100%',
          'margin-right': '10rpx',
        };
        break;
      case 'right':
        style = {
          top: '50%',
          transform: 'translateY(-50%)',
          left: '100%',
          'margin-left': '10rpx',
        };
        break;
      case 'top':
        style = {
          bottom: '100%',
          transform: 'translateX(-50%)',
          left: '50%',
          'margin-bottom': '10rpx',
        };
        break;
      case 'bottom':
        style = {
          top: '100%',
          transform: 'translateX(-50%)',
          left: '50%',
          'margin-top': '10rpx',
        };
        break;
    }
    return Object.entries(style)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  });

  const togglePopup = () => {
    visible.value = !visible.value;
  };
</script>

<style scoped>
  .uni-tooltip {
    position: relative;
    cursor: pointer;
    display: inline-block;
  }

  .uni-tooltip-popup {
    z-index: 9999;
    display: none;
    position: absolute;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
    background: #fff;
  }

  .uni-tooltip-popup.show {
    display: block;
  }
</style>
