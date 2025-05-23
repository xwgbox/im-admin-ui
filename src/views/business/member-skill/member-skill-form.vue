<!--
  * 会员技能表，用于记录会员提供的技能和服务
  *
  * @Author:    xwg
  * @Date:      2025-04-24 23:46:46
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
        <a-form-item label="技能类型，例如暖心服务、技术咨询等"  name="skillType">
          <a-input style="width: 100%" v-model:value="form.skillType" placeholder="技能类型，例如暖心服务、技术咨询等" />
        </a-form-item>
        <a-form-item label="具体服务内容，例如连麦聊天、代码审查等"  name="specificServiceId">
          <a-input-number style="width: 100%" v-model:value="form.specificServiceId" placeholder="具体服务内容，例如连麦聊天、代码审查等" />
        </a-form-item>
        <a-form-item label="服务时长，例如20分钟、1小时等"  name="serviceDuration">
          <a-input-number style="width: 100%" v-model:value="form.serviceDuration" placeholder="服务时长，例如20分钟、1小时等" />
        </a-form-item>
        <a-form-item label="技能费用，单位为货币（如人民币）"  name="skillFee">
          <a-input-number style="width: 100%" v-model:value="form.skillFee" placeholder="技能费用，单位为货币（如人民币）" />
        </a-form-item>
        <a-form-item label="技能说明，描述该技能的详细信息"  name="skillDescription">
          <a-input style="width: 100%" v-model:value="form.skillDescription" placeholder="技能说明，描述该技能的详细信息" />
        </a-form-item>
        <a-form-item label="会员id"  name="memberId">
          <a-input-number style="width: 100%" v-model:value="form.memberId" placeholder="会员id" />
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
  import { memberSkillApi } from '/@/api/business/member-skill/member-skill-api';
  import { smartSentry } from '/@/lib/smart-sentry';

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
      skillType: undefined, //技能类型，例如暖心服务、技术咨询等
      specificServiceId: undefined, //具体服务内容，例如连麦聊天、代码审查等
      serviceDuration: undefined, //服务时长，例如20分钟、1小时等
      skillFee: undefined, //技能费用，单位为货币（如人民币）
      skillDescription: undefined, //技能说明，描述该技能的详细信息
      memberId: undefined, //会员id
  };

  let form = reactive({ ...formDefault });

  const rules = {
      skillType: [{ required: true, message: '技能类型，例如暖心服务、技术咨询等 必填' }],
      specificServiceId: [{ required: true, message: '具体服务内容，例如连麦聊天、代码审查等 必填' }],
      serviceDuration: [{ required: true, message: '服务时长，例如20分钟、1小时等 必填' }],
      skillFee: [{ required: true, message: '技能费用，单位为货币（如人民币） 必填' }],
      memberId: [{ required: true, message: '会员id 必填' }],
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
        await memberSkillApi.update(form);
      } else {
        await memberSkillApi.add(form);
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
