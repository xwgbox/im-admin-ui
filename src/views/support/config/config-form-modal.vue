<!--
  * 系统设置表单
  * 
  * @Author:    火花-主任：卓大
  * @Date:      2022-06-08 21:50:41 
  * @Wechat:    zhuda1024 
  * @Email:     lab1024@163.com 
  * @Copyright  火花 （ https://1024lab.net ），Since 2012
-->
<template>
  <a-modal :open="visible" :title="form.configId ? '编辑' : '添加'" ok-text="确认" cancel-text="取消" @ok="onSubmit" @cancel="onClose" width="60%"
           :style="{ maxWidth: '1000px', minWidth: '600px' }">
    <a-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 5 }">
      <a-form-item label="参数Key" name="configKey">
        <a-input v-model:value="form.configKey" placeholder="请输入参数Key" />
      </a-form-item>
      <a-form-item label="参数名称" name="configName">
        <a-input v-model:value="form.configName" placeholder="请输入参数名称" />
      </a-form-item>
      <a-form-item label="输入类型" name="inputType">
        <a-select v-model:value="form.inputType" placeholder="请选择输入类型">
          <a-select-option value="input">输入框</a-select-option>
          <a-select-option value="richtext">富文本</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="参数值" name="configValue">
        <a-input
            v-if="form.inputType === 'input' || !form.inputType"
            v-model:value="form.configValue"
            placeholder="请输入参数值"
        />
        <div v-else-if="form.inputType === 'richtext'" style="border: 1px solid #ccc; z-index: 9999">
          <Toolbar              style="border-bottom: 1px solid #ccc"
                                :editor="editorRef"
                                :defaultConfig="toolbarConfig"
                                :mode="mode"
          />
          <Editor              style="height: 300px; overflow-y: hidden;"
                               v-model="form.configValue"
                               :defaultConfig="editorConfig"
                               :mode="mode"
                               @onCreated="handleCreated"
          />
        </div>
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <textarea v-model="form.remark" style="width: 100%; height: 100px; outline: none"></textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
  import { message } from 'ant-design-vue';
  import {onBeforeUnmount, reactive, ref} from 'vue';
  import { configApi } from '/@/api/support/config-api';
  import { smartSentry } from '/@/lib/smart-sentry';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import '@wangeditor/editor/dist/css/style.css' // 引入 css
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { fileApi } from '/@/api/support/file-api';
  import {FILE_FOLDER_TYPE_ENUM} from "/@/constants/support/file-const";
  // emit
  const emit = defineEmits(['reloadList']);
  // 编辑器实例，必须用 shallowRef
  const editorRef = ref()
  const mode = ref('default')

  // 工具栏配置
  const toolbarConfig = {}
  // 编辑器配置
  const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        // 自定义图片上传 TODO: 需要根据实际图片上传接口配置
        async customUpload(file, insertFn) {
          try {
            // 创建 FormData 对象用于上传文件
            const formData = new FormData();
            formData.append('file', file);

            // 调用文件上传接口
            const res = await fileApi.uploadFile(formData,FILE_FOLDER_TYPE_ENUM.COMMON.value);

            // 检查返回结果
            if (res.code === 0 && res.data) {
              // 插入图片到编辑器
              insertFn(res.data.fileUrl, res.data.fileName);
            } else {
              message.error(res.message || '上传失败');
            }
          } catch (err) {
            console.error('图片上传失败:', err);
            message.error('图片上传失败');
            smartSentry.captureError(err);
          }
          console.log('需要实现图片上传功能')
        }
      }
    }
  }

  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
  })

  const handleCreated = (editor) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
  }
  //  组件
  const formRef = ref();

  const formDefault = {
    configId: undefined,
    configKey: '',
    configName: '',
    inputType: 'input', // 添加输入类型枚举，默认为输入框

    configValue: '',
    remark: '',
  };
  let form = reactive({ ...formDefault });
  const rules = {
    configKey: [{ required: true, message: '请输入参数key' }],
    configName: [{ required: true, message: '请输入参数名称' }],
    configValue: [{ required: true, message: '请输入参数值' }],
    inputType: [{ required: true, message: '请输入参数值' }],
  };
  // 是否展示
  const visible = ref(false);

  function showModal(rowData) {
    Object.assign(form, formDefault);
    if (rowData) {
      Object.assign(form, rowData);
    }
    visible.value = true;
  }

  function onClose() {
    Object.assign(form, formDefault);
    visible.value = false;
  }

  function onSubmit() {
    formRef.value
      .validate()
      .then(async () => {
        SmartLoading.show();
        try {
          if (form.configId) {
            await configApi.updateConfig(form);
          } else {
            await configApi.addConfig(form);
          }
          message.success(`${form.configId ? '修改' : '添加'}成功`);
          emit('reloadList');
          onClose();
        } catch (error) {
          smartSentry.captureError(error);
        } finally {
          SmartLoading.hide();
        }
      })
      .catch((error) => {
        console.log('error', error);
        message.error('参数验证错误，请仔细填写表单数据!');
      });
  }

  defineExpose({
    showModal,
  });
</script>
