<!--
  * 会员价格表
  *
  * @Author:    xwg
  * @Date:      2025-05-26 23:20:43
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
<!--        <a-form-item label="价格类型（参考PriceTypeEnum）"  name="type">-->
<!--          <a-input-number style="width: 100%" v-model:value="form.type" placeholder="价格类型（参考PriceTypeEnum）" />-->
<!--        </a-form-item>-->

      <a-form-item label="价格类型" name="type">
        <SmartEnumSelect width="100%" v-model:value="form.type" placeholder="请选择类型" enum-name="PRICE_TYPE_ENUM" />
      </a-form-item>
        <a-form-item label="原价格"  name="originalPrice">
          <a-input-number style="width: 100%" v-model:value="form.originalPrice" placeholder="原价格" />
        </a-form-item>
        <a-form-item label="真实价格"  name="truthPrice">
          <a-input-number style="width: 100%" v-model:value="form.truthPrice" placeholder="真实价格" />
        </a-form-item>

<!--        <a-form-item label="时间类型（参考PriceTimeEnum）"  name="typeTime">-->
<!--          <a-input-number style="width: 100%" v-model:value="form.typeTime" placeholder="时间类型（参考PriceTimeEnum）" />-->
<!--        </a-form-item>-->
      <a-form-item label="时间类型" name="typeTime">
        <SmartEnumSelect width="100%" v-model:value="form.typeTime" placeholder="请选择类型" enum-name="PRICE_TIME_ENUM" />
      </a-form-item>
      <a-form-item label="有效时间"  name="effectiveTime">
        <a-input-number style="width: 100%" v-model:value="form.effectiveTime" placeholder="有效时间" />
      </a-form-item>
        <a-form-item label="交友次数"  name="makeFriendsQuantity">
          <a-input-number style="width: 100%" v-model:value="form.makeFriendsQuantity" placeholder="交友次数" />
        </a-form-item>
        <a-form-item label="评论次数"  name="reviewQuantity">
          <a-input-number style="width: 100%" v-model:value="form.reviewQuantity" placeholder="暖心服务次数" />
        </a-form-item>
      <a-form-item label="暖心服务次数"  name="activitiesQuantity">
        <a-input-number style="width: 100%" v-model:value="form.activitiesQuantity" placeholder="暖心服务次数" />
      </a-form-item>
      <a-form-item label="查看社交账号次数"  name="socialMediaAccountsQuantity">
        <a-input-number style="width: 100%" v-model:value="form.socialMediaAccountsQuantity" placeholder="暖心服务次数" />
      </a-form-item>
      <a-form-item label="匹配交友次数"  name="matchMakingFriendsQuantity">
        <a-input-number style="width: 100%" v-model:value="form.matchMakingFriendsQuantity" placeholder="暖心服务次数" />
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
  import { memberPriceApi } from '/@/api/business/member-price/member-price-api';
  import { smartSentry } from '/@/lib/smart-sentry';
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
      type: undefined, //价格类型（参考PriceTypeEnum）
      originalPrice: undefined, //原价格
      truthPrice: undefined, //真实价格
      effectiveTime: undefined, //有效时间
      typeTime: undefined, //时间类型（参考PriceTimeEnum）
      makeFriendsQuantity: undefined, //交友次数
      activitiesQuantity: undefined, //暖心服务次数
  };

  let form = reactive({ ...formDefault });

  const rules = {
      type: [{ required: true, message: '价格类型（参考PriceTypeEnum） 必填' }],
      originalPrice: [{ required: true, message: '原价格 必填' }],
      truthPrice: [{ required: true, message: '真实价格 必填' }],
      effectiveTime: [{ required: true, message: '有效时间 必填' }],
      typeTime: [{ required: true, message: '时间类型（参考PriceTimeEnum） 必填' }],
      makeFriendsQuantity: [{ required: true, message: '交友次数 必填' }],
    reviewQuantity: [{ required: true, message: '评论次数 必填' }],
      activitiesQuantity: [{ required: true, message: '暖心服务次数 必填' }],
    socialMediaAccountsQuantity: [{ required: true, message: '查看社交账号次数次数 必填' }],
    matchMakingFriendsQuantity: [{ required: true, message: '匹配交友次数次数 必填' }],
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
        await memberPriceApi.update(form);
      } else {
        await memberPriceApi.add(form);
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
