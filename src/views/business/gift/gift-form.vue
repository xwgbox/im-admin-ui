<!--
  * 9
  *
  * @Author:    xwg
  * @Date:      2025-05-18 15:10:27
  * @Copyright  001
-->
<template>
  <a-modal
      :title="form.id ? '编辑' : '添加'"
      :width="400"
      :open="visibleFlag"
      @cancel="onClose"
      :maskClosable="false"
      :destroyOnClose="true"
  >
    <a-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 5 }" >
<!--        <a-form-item label="id"  name="id">-->
<!--          <a-input-number style="width: 100%" v-model:value="form.id" placeholder="id" />-->
<!--        </a-form-item>-->
        <a-form-item label="名称"  name="giftName">
          <a-input style="width: 100%" v-model:value="form.giftName" placeholder="名称" />
        </a-form-item>
        <a-form-item label="图片"  name="giftImageUrl">
          <FileUpload
              :defaultFileList="form.giftImageUrl"
              :folder="FILE_FOLDER_TYPE_ENUM.COMMON.value"
              buttonText="上传 图片"
              maxUploadSize=1
              listType="text"
              @change="e => form.giftImageUrl = e"
          />
        </a-form-item>
        <a-form-item label="钻石数量"  name="giftPrice">
          <a-input-number style="width: 100%" v-model:value="form.giftPrice" placeholder="数量" />
        </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="onClose">取消</a-button>
        <a-button type="primary" @click="onSubmit">保存</a-button>
      </a-space>
    </template>
  </a-modal>
</template>
<script setup>
  import { reactive, ref, nextTick } from 'vue';
  import _ from 'lodash';
  import { message } from 'ant-design-vue';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { giftApi } from '/@/api/business/gift/gift-api';
  import { smartSentry } from '/@/lib/smart-sentry';
  import FileUpload from '/@/components/support/file-upload/index.vue';
  import { FILE_FOLDER_TYPE_ENUM } from '/@/constants/support/file-const';

  // ------------------------ 事件 ------------------------

  const emits = defineEmits(['reloadList']);

  // ------------------------ 显示与隐藏 ------------------------
  // 是否显示
  const visibleFlag = ref(false);

  function show(rowData) {
    Object.assign(form, formDefault);
    if (rowData && !_.isEmpty(rowData)) {
      Object.assign(form, rowData);
    }
    // 使用字典时把下面这注释修改成自己的字典字段 有多个字典字段就复制多份同理修改 不然打开表单时不显示字典初始值
    // if (form.status && form.status.length > 0) {
    //   form.status = form.status.map((e) => e.valueCode);
    // }
    visibleFlag.value = true;
    nextTick(() => {
      formRef.value.clearValidate();
    });
  }

  function onClose() {
    Object.assign(form, formDefault);
    visibleFlag.value = false;
  }

  // ------------------------ 表单 ------------------------

  // 组件ref
  const formRef = ref();

  const formDefault = {
      id: undefined, //id
      giftName: undefined, //名称
      giftImageUrl: undefined, //图片
      giftPrice: undefined, //数量
  };

  let form = reactive({ ...formDefault });

  const rules = {
      // id: [{ required: true, message: 'id 必填' }],
      giftName: [{ required: true, message: '名称 必填' }],
      giftImageUrl: [{ required: true, message: '图片 必填' }],
      giftPrice: [{ required: true, message: '数量 必填' }],
  };

  // 点击确定，验证表单
  async function onSubmit() {
    try {
      await formRef.value.validateFields();
      save();
    } catch (err) {
      message.error('参数验证错误，请仔细填写表单数据!');
    }
  }

  // 新建、编辑API
  async function save() {
    SmartLoading.show();
    try {
      if (form.id) {
        await giftApi.update(form);
      } else {
        await giftApi.add(form);
      }
      message.success('操作成功');
      emits('reloadList');
      onClose();
    } catch (err) {
      smartSentry.captureError(err);
    } finally {
      SmartLoading.hide();
    }
  }

  defineExpose({
    show,
  });
</script>
