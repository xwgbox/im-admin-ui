<!-- ProcessOpinionForm.vue -->
<template>
  <a-modal
    title="处理意见'"
    :width="500"
    :open="visibleFlag"
    @cancel="onClose"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-form ref="formRef" :model="form" :rules="rules">
      <a-form-item label="处理意见" name="opinion">
        <a-textarea v-model:value="form.opinion" placeholder="请输入处理意见" :rows="4" />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="onClose">取消</a-button>
        <a-button type="primary" @click="onSubmit">确认</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup>
import { reactive, ref, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { memberReportsApi } from '/@/api/business/member-reports/member-reports-api';
import { smartSentry } from '/@/lib/smart-sentry';

const emits = defineEmits(['reloadList']);

// 控制模态框显示
const visibleFlag = ref(false);

// 表单默认值
const formDefault = {
  id: undefined,
  adminComment: '', // 处理意见字段
};

// 当前表单数据
let form = reactive({ ...formDefault });

// 表单引用
const formRef = ref();

// 表单规则
const rules = {
  opinion: [{ required: true, message: '处理意见不能为空' }],
};

// 打开弹窗方法
function show(rowData) {
  Object.assign(form, formDefault);
  if (rowData && !_.isEmpty(rowData)) {
    Object.assign(form, rowData);
  }
  visibleFlag.value = true;
  nextTick(() => {
    formRef.value.clearValidate();
  });
}

// 关闭弹窗
function onClose() {
  Object.assign(form, formDefault);
  visibleFlag.value = false;
}

// 提交表单
async function onSubmit() {
  try {
    await formRef.value.validateFields();
    await save();
  } catch (err) {
    message.error('参数验证错误，请填写完整信息');
  }
}

// 调用 API 保存数据
async function save() {
  SmartLoading.show();
  try {
    if (form.id) {
      await memberReportsApi.update(form); // 更新操作
    }
    message.success('操作成功');
    emits('reloadList'); // 触发父组件刷新列表
    onClose(); // 关闭弹窗
  } catch (err) {
    smartSentry.captureError(err);
  } finally {
    SmartLoading.hide();
  }
}

// 暴露给父组件的方法
defineExpose({
  show,
});
</script>
