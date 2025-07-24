<!--
  * 轮播图
  *
  * @Author:    xwg
  * @Date:      2025-07-23 09:42:08
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
      <a-form-item label="轮播图类型"  name="bannerType">
        <SmartEnumSelect width="100%" v-model:value="form.bannerType" enumName="BANNER_ENUM" placeholder="轮播图类型"/>
      </a-form-item>
      <a-form-item label="图片地址"  name="imgUrl">
        <FileUpload
            :defaultFileList="form.imgUrl"
            :folder="FILE_FOLDER_TYPE_ENUM.COMMON.value"
            buttonText="上传 图片地址"
            listType="text"
            @change="e => form.imgUrl = e"
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
import { bannerApi } from '/@/api/business/banner/banner-api';
import { smartSentry } from '/@/lib/smart-sentry';
import FileUpload from '/@/components/support/file-upload/index.vue';
import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
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
  bannerType: undefined, //轮播图类型
  imgUrl: undefined, //图片地址
};

let form = reactive({ ...formDefault });

const rules = {
  bannerType: [{ required: true, message: '轮播图类型 必填' }],
  imgUrl: [{ required: true, message: '图片地址 必填' }],
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
      await bannerApi.update(form);
    } else {
      await bannerApi.add(form);
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
