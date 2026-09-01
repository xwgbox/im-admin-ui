<!--
  * 订单表
  *
  * @Author:    xwg
  * @Date:      2025-05-28 09:56:48
  * @Copyright  001
-->
<template>
    <!---------- 查询表单form begin ----------->
    <a-form class="smart-query-form">
        <a-row class="smart-query-form-row">
            <a-form-item label="下单用户ID" class="smart-query-form-item">
                <a-input style="width: 200px" v-model:value="queryForm.memberId" placeholder="下单用户ID" />
            </a-form-item>
            <a-form-item label="订单编号" class="smart-query-form-item">
                <a-input style="width: 200px" v-model:value="queryForm.orderNo" placeholder="订单编号" />
            </a-form-item>
          <a-form-item label="订单状态" class="smart-query-form-item">
            <DictSelect
                width="200px"
                v-model:value="queryForm.status"
                keyCode="order_status"
                placeholder="请选择订单状态"/>
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
    <!---------- 查询表单form end ----------->

    <a-card size="small" :bordered="false" :hoverable="true">
        <!---------- 表格操作行 begin ----------->
        <a-row class="smart-table-btn-block">
            <div class="smart-table-operate-block">
            </div>
            <div class="smart-table-setting-block">
                <TableOperator v-model="columns" :tableId="null" :refresh="queryData" />
            </div>
        </a-row>
        <!---------- 表格操作行 end ----------->

        <!---------- 表格 begin ----------->
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

	    <!-- 有图片预览时 注释解开并把下面的'picture'修改成自己的图片字段名即可 -->
              <!-- <template v-if="column.dataIndex === 'picture'">
                  <FilePreview :fileList="text" type="picture" />
                </template> -->

	    <!-- 使用字典时 注释解开并把下面的'dict'修改成自己的字典字段名即可 有多个字典字段就复制多份同理修改 不然不显示字典 -->
              <!-- 方便修改tag的颜色 orange green purple success processing error default warning -->
              <!-- <template v-if="column.dataIndex === 'dict'">
                <a-tag color="cyan">
                  {{ text && text.length > 0 ? text.map((e) => e.valueName).join(',') : '暂无' }}
                </a-tag>
              </template> -->

                <template v-if="column.dataIndex === 'action'">
                    <div class="smart-table-operate">
                    </div>
                </template>
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


    </a-card>
</template>
<script setup>
    import { reactive, ref, onMounted } from 'vue';
    import { message, Modal } from 'ant-design-vue';
    import { SmartLoading } from '/@/components/framework/smart-loading';
    import { orderApi } from '/@/api/business/order/order-api';
    import { PAGE_SIZE_OPTIONS } from '/@/constants/common-const';
    import { smartSentry } from '/@/lib/smart-sentry';
    import DictSelect from '/@/components/support/dict-select/index.vue';
    import DictPreview from '/@/components/dict-preview/index.vue';
    import { useDict } from '/@/utils/dict';
    import TableOperator from '/@/components/support/table-operator/index.vue';
    //import FilePreview from '/@/components/support/file-preview/index.vue'; // 图片预览组件

    // ---------------------------- 表格列 ----------------------------
    // 获取字典数据
    const descList = useDict('order_status');
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
        // {
        //     title: '关联的价格ID',
        //     dataIndex: 'priceId',
        //     ellipsis: true,
        // },
        // {
        //     title: '下单用户ID',
        //     dataIndex: 'memberId',
        //     ellipsis: true,
        // },
        {
            title: '订单编号',
            dataIndex: 'orderNo',
            ellipsis: true,
        },
        {
            title: '会员类型 ',
            dataIndex: 'typeDesc',
            ellipsis: true,
        },
        {
            title: '真实价格',
            dataIndex: 'paymentPrice',
            ellipsis: true,
        },
        {
            title: '状态',
            dataIndex: 'statusDesc',
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
        orderNo: undefined, //订单编号
          status: undefined,
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
            let queryResult = await orderApi.queryPage(queryForm);
            tableData.value = queryResult.data.list;
            total.value = queryResult.data.total;
        } catch (e) {
            smartSentry.captureError(e);
        } finally {
            tableLoading.value = false;
        }
    }


    onMounted(queryData);


</script>
