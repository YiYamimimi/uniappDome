<script setup lang="ts">
  defineOptions({
    name: 'AppFormSelect',
  });

  import { ref, watch } from 'vue';

  const model = defineModel<string[]>({
    default: () => [],
  });

  const props = defineProps({
    label: {
      type: String,
      default: '',
    },
    prop: {
      type: String,
      default: '',
    },
    borderBottom: {
      type: Boolean,
      default: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
  });

  const emit = defineEmits(['change']);

  const menuOpen = ref(false);
  const selectedSet = ref(new Set(model.value));

  // 初始化选中状态
  watch(
    () => model.value,
    (newVal) => {
      selectedSet.value = new Set(newVal);
    },
    { deep: true },
  );

  const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;
  };

  const closeMenu = () => {
    menuOpen.value = false;
  };

  const toggleSelect = (value: string) => {
    if (selectedSet.value.has(value)) {
      selectedSet.value.delete(value);
    } else {
      selectedSet.value.add(value);
    }
    const newValue = Array.from(selectedSet.value);
    model.value = newValue;
    emit('change', newValue);
  };

  const selectAll = () => {
    const allValues = props.options.map((opt) => opt.value);
    selectedSet.value = new Set(allValues);
    model.value = allValues;
    emit('change', allValues);
  };

  const clearAll = () => {
    selectedSet.value.clear();
    model.value = [];
    emit('change', []);
  };
</script>
<template>
  <uv-form-item
    :label="`${props.label}:`"
    :prop="props.prop"
    :borderBottom="props.borderBottom"
    :required="props.required"
  >
    <div class="select-container" @click.stop="toggleMenu">
      <div class="select-value" v-if="model.length > 0">
        <div v-for="(value, index) in model" :key="value" class="select-tag">
          {{ props.options.find((opt) => opt.value === value)?.label || value }}
        </div>
      </div>
      <div v-else class="select-placeholder">{{ `请输入${props.label}(可多选)` }}</div>
      <div style="margin-left: 5rpx"> <uv-icon name="arrow-down" color="#999"></uv-icon></div>
    </div>

    <div v-if="menuOpen" class="overlay" @click="closeMenu"></div>
    <div v-if="menuOpen" class="dropdown" @click.stop>
      <div class="dropdown-actions">
        <div class="action-text" @click="selectAll">全选</div>
        <div class="action-text" @click="clearAll">清空</div>
      </div>
      <div class="options">
        <div
          v-for="option in props.options"
          :key="option.value"
          :class="['option-item', { selected: selectedSet.has(option.value) }]"
          @click="toggleSelect(option.value)"
        >
          <div class="option-text">{{ option.label }}</div>
          <uv-icon v-if="selectedSet.has(option.value)" name="checkmark" color="#409eff"></uv-icon>
        </div>
      </div>
    </div>
  </uv-form-item>
</template>
<style lang="scss" scoped>
  .select-container {
    display: flex;
    justify-content: flex-end;
    padding: 10rpx 0;
    position: relative;
  }

  .select-value {
    justify-content: flex-end;
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
    flex: 1;
    min-height: 40rpx;
    align-items: center;
  }

  .select-tag {
    background-color: #f0f9ff;
    color: #409eff;
    padding: 6rpx 12rpx;
    border-radius: 16rpx;
    font-size: 24rpx;
    border: 1rpx solid #409eff;
  }

  .select-placeholder {
    color: #c0c4cc;
    font-size: 28rpx;
  }

  .overlay {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 998;
  }

  .dropdown {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    border-radius: 8rpx;
    border: 1rpx solid #eee;
    box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.1);
    z-index: 999;
    max-height: 400rpx;
  }

  .dropdown-actions {
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;
    padding: 12rpx 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
  }

  .action-text {
    color: #409eff;
    font-size: 24rpx;
    cursor: pointer;
  }

  .options {
    padding: 10rpx 0;
  }

  .option-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    font-size: 28rpx;
    cursor: pointer;

    &:hover {
      background-color: #f5f7fa;
    }

    &.selected {
      color: #409eff;
      background-color: #f0f9ff;
    }
  }
</style>
