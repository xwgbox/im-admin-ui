<!--
  * 用户表
  *
  * @Author:    xwg
  * @Date:      2025-03-27 14:09:18
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
    <a-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 7 }">
      <!--        <a-form-item label="主键ID"  name="id">-->
      <!--          <a-input-number style="width: 100%" v-model:value="form.id" placeholder="主键ID" />-->
      <!--        </a-form-item>-->
      <a-form-item label="用户类型" name="memberType">
        <SmartEnumSelect width="100%" v-model:value="form.memberType" enumName="MEMBER_TYPE_ENUM" placeholder="用户类型"/>
      </a-form-item>
      <a-form-item label="过期时间" name="endTime">
        <a-input-number style="width: 100%" v-model:value="form.endTime" placeholder="过期时间"/>
      </a-form-item>
      <a-form-item label="交友次数" name="makeFriendsQuantity">
        <a-input-number style="width: 100%" v-model:value="form.makeFriendsQuantity" placeholder="交友次数"/>
      </a-form-item>
      <a-form-item label="评论次数" name="reviewQuantity">
        <a-input-number style="width: 100%" v-model:value="form.reviewQuantity" placeholder="评论次数"/>
      </a-form-item>
      <a-form-item label="暖心服务次数" name="activitiesQuantity" >
        <a-input-number style="width: 100%" v-model:value="form.activitiesQuantity" placeholder="暖心服务次数"/>
      </a-form-item>
      <a-form-item label="社交账号次数" name="socialMediaAccountsQuantity">
        <a-input-number style="width: 100%" v-model:value="form.socialMediaAccountsQuantity" placeholder="查看社交账号次数"/>
      </a-form-item>
      <a-form-item label="匹配交友次数" name="matchMakingFriendsQuantity">
        <a-input-number style="width: 100%" v-model:value="form.matchMakingFriendsQuantity" placeholder="匹配交友次数"/>
      </a-form-item>
      <a-form-item label="状态" name="status">
        <SmartEnumSelect width="100%" v-model:value="form.status" enumName="MEMBER_STATUS_ENUM" placeholder="状态"/>
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
import {nextTick, reactive, ref} from 'vue';
import _ from 'lodash';
import {message} from 'ant-design-vue';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {memberApi} from '/@/api/business/member/member-api';
import {smartSentry} from '/@/lib/smart-sentry';
import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';

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
  memberApi.queryDetails({id:rowData.id}).then(data=>{
    console.log(data)
    Object.assign(form, data.data);
  });
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
  id: undefined, //主键ID
  userName: undefined, //用户账号
  status: undefined, //状态
  memberType: undefined, //状态
  makeFriendsQuantity: undefined,
  endTime: undefined,
  reviewQuantity: undefined,
  activitiesQuantity: undefined,
  socialMediaAccountsQuantity: undefined,
};

let form = reactive({...formDefault});

const rules = {
  // id: [{required: true, message: '主键ID 必填'}],
  // userName: [{required: true, message: '用户账号 必填'}],
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
      await memberApi.update(form);
    } else {
      await memberApi.add(form);
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
