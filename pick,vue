<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  defineOptions({
    name: 'AppFormPicker',
  });
  import { useUserStore } from '@/store';
  const userStore: any = useUserStore();
  const model = defineModel();
  const modelLabel = defineModel('modelLabel');
  const props = defineProps({
    label: {
      type: String,
      default: '',
    },
    api: {
      type: Function,
      default: () => {},
    },
    prop: {
      type: String,
      default: '',
    },
    keyName: {
      type: String,
      default: 'projectName',
    },
    options: {
      type: Array,
      default: () => [],
    },
    borderBottom: {
      type: Boolean,
      default: true,
    },
    required: {
      type: Boolean,
      default: true,
    },
    rightIcon: {
      type: String,
      default: 'arrow-right',
    },
    defaultFirst: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['change', 'click']);
  const pickerRef = ref();

  let columnsData = ref<any>([[]]);

  onMounted(async () => {
    const res = await props.api({ pageSize: 9999 });
    if (res) {
      const arr =
        props.prop === 'projectId'
          ? res.data.find((item: any) => item.id === userStore.info?.companyId).projectList
          : [];
      props.prop === 'projectId'
        ? (columnsData.value[0] = arr)
        : (columnsData.value[0] = res.data.list);
      if (props.defaultFirst) {
        modelLabel.value = columnsData.value[0][0][props.keyName];
        model.value = columnsData.value[0][0].id;
        emit('change', columnsData.value[0][0]);
      }
    }
  });

  watch(
    () => props.options,
    (val) => {
      columnsData.value[0] = val;
    },
    { immediate: true },
  );

  function select(e: any) {
    console.log(e.value[0][props.keyName]);

    modelLabel.value = e.value[0][props.keyName];
    model.value = e.value[0].id;
    emit('change', e.value[0]);
  }
  function cellClick() {
    emit('click');
    columnsData.value[0]?.length && pickerRef.value.open();
  }
</script>
<template>
  <uv-form-item
    :label="`${props.label}:`"
    :prop="props.prop"
    :borderBottom="props.borderBottom"
    :required="props.required"
    @click="cellClick"
  >
    <uv-input
      v-model="modelLabel"
      :placeholder="`请选择${props.label}`"
      input-align="right"
      border="none"
      readonly
    >
    </uv-input>
    <template #right>
      <slot name="rightIcon">
        <uv-icon :name="rightIcon"></uv-icon>
      </slot>
    </template>
  </uv-form-item>
  <uv-picker
    ref="pickerRef"
    :columns="columnsData"
    :keyName="keyName"
    @confirm="select"
  ></uv-picker>
</template>
