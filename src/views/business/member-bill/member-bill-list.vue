<!--
 * 会员账单管理
 *
 * @Author:    xwg
 * @Date:      2025-05-28 09:56:48
 * @Copyright  001
-->
<template>
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="下单用户ID" class="smart-query-form-item">
        <a-input style="width: 200px" v-model:value="queryForm.memberId" placeholder="下单用户ID" />
      </a-form-item>
<!--      <a-form-item label="账单标题" class="smart-query-form-item">-->
<!--        <a-input style="width: 200px" v-model:value="queryForm.title" placeholder="账单标题" />-->
<!--      </a-form-item>-->
      <a-form-item label="收支方向" class="smart-query-form-item">
        <a-select style="width: 200px" v-model:value="queryForm.pm" placeholder="请选择收支方向">
          <a-select-option value="0">支出</a-select-option>
          <a-select-option value="1">获得</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="smart-query-form-item">
        <a-button type="primary" @click="onSearch">
          <template #icon>
            <SearchOutlined />
          </template>
          查询
        </a-button>
        <a-button @click="resetQuery" class="smart-margin-left10">
          <template #icon>
            <ReloadOutlined />
          </template>
          重置
        </a-button>
      </a-form-item>
    </a-row>
  </a-form>

  <a-card size="small" :bordered="false" :hoverable="true">
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="null" :refresh="queryData" />
      </div>
    </a-row>

    <a-table
        size="small"
        :scroll="{ y: '100%' }"
        :dataSource="tableData"
        :columns="columns"
        rowKey="id"
        bordered
        :loading="tableLoading"
        :pagination="false"
    >
      <template #bodyCell="{ text, record, column }">
        <template v-if="column.dataIndex === 'pm'">
          <a-tag :color="text === 0 ? 'orange' : 'green'">
            {{ text === 0 ? '支出' : '获得' }}
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
          </div>
        </template>
      </template>
    </a-table>

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
  </a-card>
</template>

<script setup>
import { reactive, ref, onMounted,onActivated  } from 'vue';
import { useRoute } from 'vue-router'; // 引入 useRoute
import { message, Modal } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { memberBillApi } from '/@/api/business/member-bill/member-bill-api';
import { PAGE_SIZE_OPTIONS } from '/@/constants/common-const';
import { smartSentry } from '/@/lib/smart-sentry';
import TableOperator from '/@/components/support/table-operator/index.vue';


const route = useRoute();
// ---------------------------- 表格列 ----------------------------
const columns = ref([
  {
    title: '主键ID',
    dataIndex: 'id',
    ellipsis: true,
  },
  {
    title: '用户昵称',
    dataIndex: 'nickName',
    ellipsis: true,
  },
  {
    title: '账单标题',
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: '收支方向',
    dataIndex: 'pm',
    ellipsis: true,
  },
  {
    title: '明细金额',
    dataIndex: 'number',
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    ellipsis: true,
  },
]);

// ---------------------------- 查询数据表单和方法 ----------------------------
const queryFormState = {
  memberId: undefined, //下单用户ID
  title: undefined, //账单标题
  pm: undefined, //收支方向 0=支出 1=获得
  pageNum: 1,
  pageSize: 10,
};
// 查询表单form
const queryForm = reactive({ ...queryFormState });
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
function onSearch(){
  queryForm.pageNum = 1;
  queryData();
}

// 查询数据
async function queryData() {
  tableLoading.value = true;
  try {
    let queryResult = await memberBillApi.queryPage(queryForm);
    tableData.value = queryResult.data.list;
    total.value = queryResult.data.total;
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    tableLoading.value = false;
  }
}
function fetchData() {
  // 核心代码：判断 URL 中是否存在 memberId 参数，若有则赋值
  if (route.query.memberId) {
    queryForm.memberId = route.query.memberId;
  }
  queryData();
}
// 首次挂载
onMounted(() => {
  fetchData();
});

// keep-alive 缓存后再次激活时触发（如果路由配置了 keep-alive 则需要）
onActivated(() => {
  fetchData();
});


</script>