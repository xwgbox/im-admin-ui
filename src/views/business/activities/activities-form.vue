<!--
  * 9
  *
  * @Author:    xwg
  * @Date:      2025-04-23 22:49:53
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
        <a-form-item label="活动名称"  name="name">
          <a-input style="width: 100%" v-model:value="form.name" placeholder="活动名称" />
        </a-form-item>
        <a-form-item label="活动类型"  name="type">
          <DictSelect width="100%" v-model:value="form.type" keyCode="activities_type" placeholder="活动类型"/>
        </a-form-item>
        <a-form-item label="活动参与数量"  name="playerCount">
          <a-input-number style="width: 100%" v-model:value="form.playerCount" placeholder="活动参与数量" />
        </a-form-item>
        <a-form-item label="图片url"  name="imageUrl">
          <FileUpload
              :defaultFileList="form.imageUrl"
              :folder="FILE_FOLDER_TYPE_ENUM.COMMON.value"
              buttonText="上传 图片url"
              listType="text"
              @change="e => form.imageUrl = e"
          />
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
  import { activitiesApi } from '/@/api/business/activities/activities-api';
  import { smartSentry } from '/@/lib/smart-sentry';
  import FileUpload from '/@/components/support/file-upload/index.vue';
  import DictSelect from '/@/components/support/dict-select/index.vue';
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
      // id: undefined, //id
      name: undefined, //活动名称
      type: undefined, //活动类型
      playerCount: undefined, //活动参与数量
      imageUrl: undefined, //图片url
  };

  let form = reactive({ ...formDefault });

  const rules = {
      // id: [{ required: true, message: 'id 必填' }],
      name: [{ required: true, message: '活动名称 必填' }],
      type: [{ required: true, message: '活动类型 必填' }],
      playerCount: [{ required: true, message: '活动参与数量 必填' }],
      imageUrl: [{ required: true, message: '图片url 必填' }],
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
        await activitiesApi.update(form);
      } else {
        await activitiesApi.add(form);
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
