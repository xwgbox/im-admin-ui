<template>
  <a-modal
      v-model:visible="visible"
      title="发送系统消息"
      @ok="handleSubmit"
      :confirmLoading="loading"
      @cancel="handleCancel"
  >
    <a-form :model="formState" layout="vertical">
      <!-- 1. 消息类型选择 -->
      <a-form-item label="消息类型">
        <a-radio-group v-model:value="formState.msgType">
          <a-radio value="text">文字消息</a-radio>
          <a-radio value="imageText">图文消息</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 2. 文字消息内容 (仅当 type=text 时显示) -->
      <a-form-item
          v-if="formState.msgType === 'text'"
          label="文字内容"
          :rules="[{ required: true, message: '请输入文字内容' }]"
      >
        <a-textarea
            v-model:value="formState.content"
            :rows="4"
            placeholder="请输入要发送的文字内容"
        />
      </a-form-item>

      <!-- 3. 图文消息内容 (仅当 type=imageText 时显示) -->
      <template v-else>
        <a-form-item label="标题" :rules="[{ required: true, message: '请输入标题' }]">
          <a-input v-model:value="formState.title" placeholder="请输入图文消息标题" />
        </a-form-item>

        <a-form-item label="副标题">
          <a-input v-model:value="formState.subhead" placeholder="请输入副标题（选填）" />
        </a-form-item>

        <a-form-item label="封面图片" :rules="[{ required: true, message: '请上传图片' }]">

          <FileUpload

              :folder="FILE_FOLDER_TYPE_ENUM.COMMON.value"
              buttonText="上传 图片"
              :maxUploadSize=1
              listType="text"
              @change="e => formState.imgUrl = e[0].url"
          />
        </a-form-item>
      </template>
    </a-form>
  </a-modal>
</template>

<script setup>
import {customerApi} from '/@/api/business/im/im-api';
import FileUpload from '/@/components/support/file-upload/index.vue';
import { FILE_FOLDER_TYPE_ENUM } from '/@/constants/support/file-const';
import { ref, reactive } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const emit = defineEmits(['success']);

const visible = ref(false);
const loading = ref(false);
const currentMember = ref(null);

// 表单状态
const formState = reactive({
  msgType: 'text', // text 或 imageText
  content: '',     // 对应文字消息的 text 字段
  imgUrl: '',       // 对应图文消息的 imgUrl 字段
  title: '',       // 对应图文消息的 title 字段
  subhead: '',     // 对应图文消息的 subhead 字段
});

// 暴露给父组件调用的方法
function show(record) {
  currentMember.value = record;
  // 重置表单
  formState.msgType = 'text';
  formState.content = '';
  formState.title = '';
  formState.imgUrl = '';
  formState.subhead = '';
  visible.value = true;
}





async function handleSubmit() {
  // 1. 基础校验
  if (formState.msgType === 'text' && !formState.content) {
    message.warning('请输入文字内容');
    return;
  }

  if (formState.msgType === 'imageText') {
    if (!formState.title) {
      message.warning('请输入图文消息标题');
      return;
    }
    if (!formState.imgUrl) {
      message.warning('请上传封面图片');
      return;
    }
  }

  loading.value = true;
  try {
    // 2. 构建请求参数
    // 根据后端 SendMsgSysDto，我们需要发送 { type: 0/1, content: { ... } }

    let payload = {
      type: formState.msgType === 'text' ? 0 : 1, // 0:文字, 1:图文 (参考 IMMsgTypeSysEnum)
      content: {},
      memberId:currentMember.value.id
    };

    if (formState.msgType === 'text') {
      // 文字消息结构: content: { "text": "..." }
      payload.content = {
        text: formState.content
      };
    } else {


      payload.content = {
        imgUrl: formState.imgUrl,
        title: formState.title,
        subhead: formState.subhead

      };
    }

    console.log('提交参数:', payload);

    // TODO: 调用后端接口
    await customerApi.sendSysMsgByMemberId(payload);

    message.success('消息发送成功');
    visible.value = false;
    emit('success');
  } catch (e) {
    console.error(e);
    message.error('发送失败');
  } finally {
    loading.value = false;
  }
}

function handleCancel() {
  visible.value = false;
}

defineExpose({ show });
</script>