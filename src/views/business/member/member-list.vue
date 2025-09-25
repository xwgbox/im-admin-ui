<!--
  * 用户表
  *
  * @Author:    xwg
  * @Date:      2025-03-27 14:09:18
  * @Copyright  001
-->
<template>
  <!---------- 查询表单form begin ----------->
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="昵称" class="smart-query-form-item">
        <a-input style="width: 200px" v-model:value="queryForm.nickName" placeholder="昵称"/>
      </a-form-item>
      <a-form-item label="用户账号" class="smart-query-form-item">
        <a-input style="width: 200px" v-model:value="queryForm.userName" placeholder="用户账号"/>
      </a-form-item>

      <a-form-item class="smart-query-form-item">
        <a-button type="primary" @click="onSearch">
          <template #icon>
            <SearchOutlined/>
          </template>
          查询
        </a-button>
        <a-button @click="resetQuery" class="smart-margin-left10">
          <template #icon>
            <ReloadOutlined/>
          </template>
          重置
        </a-button>
      </a-form-item>
    </a-row>
  </a-form>
  <!---------- 查询表单form end ----------->

  <a-card size="small" :bordered="false" :hoverable="true">
    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button @click="showForm" type="primary" size="small">
          <template #icon>
            <PlusOutlined/>
          </template>
          新建
        </a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="null" :refresh="queryData"/>
      </div>
    </a-row>
    <!---------- 表格操作行 end ----------->

    <!---------- 表格 begin ----------->
    <a-table
        size="small"
        :dataSource="tableData"
        :columns="columns"
        rowKey="id"
        bordered
        :loading="tableLoading"
        :pagination="false"
    >
      <template #bodyCell="{ text, record, column }">

        <!-- 有图片预览时 注释解开并把下面的'picture'修改成自己的图片字段名即可 -->
        <template v-if="column.dataIndex === 'avatar'">
          <a-image :src="text" width="100%" height="100%"/>
        </template>
        <template v-if="column.dataIndex === 'gender'">
          <a-tag color="cyan">
            {{ text === 1 ? '男' : '女' }}
          </a-tag>
        </template>

        <!-- 使用字典时 注释解开并把下面的'dict'修改成自己的字典字段名即可 有多个字典字段就复制多份同理修改 不然不显示字典 -->
        <!-- 方便修改tag的颜色 orange green purple success processing error default warning -->
        <template v-if="column.dataIndex === 'status'">

            <a-tag :color="text? 'cyan':'red'">
            {{ text ? '正常' : '禁用' }}
          </a-tag>
        </template>

<!--        <template v-if="column.dataIndex === 'action'">-->
<!--          <div class="smart-table-operate">-->
<!--            <a-button @click="showForm(record)" type="link">编辑</a-button>-->
<!--          </div>-->
<!--        </template>-->
      </template>
    </a-table>
    <!---------- 表格 end ----------->

    <div class="smart-query-table-page">
      <a-pagination
          showSizeChanger
          showQuickJumper
          show-less-items
          :pageSizeOptions="PAGE_SIZE_OPTIONS"
          :defaultPageSize="queryForm.pageSize"
          v-model:current="queryForm.pageNum"
          v-model:pageSize="queryForm.pageSize"
          :total="total"
          @change="queryData"
          @showSizeChange="queryData"
          :show-total="(total) => `共${total}条`"
      />
    </div>

    <MemberForm ref="formRef" @reloadList="queryData"/>

  </a-card>
</template>
<script setup>
import {onMounted, reactive, ref} from 'vue';
import {memberApi} from '/@/api/business/member/member-api';
import {smartSentry} from '/@/lib/smart-sentry';
import MemberForm from './member-form.vue';
//import FilePreview from '/@/components/support/file-preview/index.vue'; // 图片预览组件

// ---------------------------- 表格列 ----------------------------

const columns = ref([
  {
    title: '主键ID',
    dataIndex: 'id',
    ellipsis: true,
    width: 180
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    ellipsis: true,
  },
  {
    title: '用户账号',
    dataIndex: 'userName',
    ellipsis: true,
  },
  {
    title: '用户余额',
    dataIndex: 'nowMoney',
    ellipsis: true,
    width: 80
  },
  {
    title: '佣金金额',
    dataIndex: 'brokeragePrice',
    ellipsis: true,
    width: 80
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    ellipsis: true,
    width: 50
  },
  {
    title: '性别 ',
    dataIndex: 'gender',
    ellipsis: true,
    width: 50
  }, {
    title: '会员级别',
    dataIndex: 'memberTypeDesc',
    ellipsis: true,
  },
  {
    title: '过期时间 ',
    dataIndex: 'endTime',
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    ellipsis: true,
    width: 50,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 50,
  },
]);

// ---------------------------- 查询数据表单和方法 ----------------------------

const queryFormState = {
  nickName: undefined, //昵称
  userName: undefined, //用户账号
  gender: undefined, //性别
  pageNum: 1,
  pageSize: 10,
};
// 查询表单form
const queryForm = reactive({...queryFormState});
// 表格加载loading
const tableLoading = ref(false);
// 表格数据
const tableData = ref([]);
// 总数
const total = ref(0);

// 重置查询条件
function resetQuery() {
  let pageSize = queryForm.pageSize;
  Object.assign(queryForm, queryFormState);
  queryForm.pageSize = pageSize;
  queryData();
}

// 搜索
function onSearch() {
  queryForm.pageNum = 1;
  queryData();
}

// 查询数据
async function queryData() {
  tableLoading.value = true;
  try {
    let queryResult = await memberApi.queryPage(queryForm);
    tableData.value = queryResult.data.list;
    total.value = queryResult.data.total;
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    tableLoading.value = false;
  }
}


onMounted(queryData);

// ---------------------------- 添加/修改 ----------------------------
const formRef = ref();

function showForm(data) {
  formRef.value.show(data);
}

</script>
