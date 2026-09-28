<template>
  <div>
    <!-- 查询表单 -->
    <a-card class="mb-4">
      <a-form layout="inline" :model="queryForm" @submit="handleQuery">
        <a-form-item label="用户ID">
          <a-input v-model:value="queryForm.memberId" placeholder="请输入用户ID" />
        </a-form-item>
        <a-form-item label="时间范围">
          <a-range-picker v-model:value="queryForm.timeRange" valueFormat="YYYY-MM-DD HH:mm:ss" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">查询</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 列表 -->
    <a-table
        :scroll="{ y: '100%' }"
        :dataSource="listData"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        rowKey="id"
    >
      <!-- 状态标签 -->
      <template #status="{ text }">
        <a-tag v-if="text === 0" color="blue">待审核</a-tag>
        <a-tag v-else-if="text === 1" color="green">审核通过</a-tag>
        <a-tag v-else color="red">审核拒绝</a-tag>
      </template>

      <!-- 操作列 -->
      <template #action="{ record }">
        <a-space>
          <a @click="openDetail(record.id)">详情</a>
          <a-dropdown>
            <a class="ant-dropdown-link">审核操作 <DownOutlined /></a>
            <template #overlay>
              <a-menu @click="(e) => handleStatusChange(record.id, e.key)">
                <a-menu-item key="1">通过</a-menu-item>
                <a-menu-item key="2">拒绝</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-popconfirm title="确定删除吗？" @confirm="() => handleDelete(record.id)">
            <a-button type="link" danger>删除</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>

    <!-- 详情弹窗 -->
    <!-- 1. 添加 @cancel 事件监听关闭动作，添加 destroy-on-close 彻底销毁视频组件 -->
    <a-modal

        v-model:open="detailVisible"
        title="动态详情"
        :footer="null"
        width="600px"
        @cancel="handleCancel"
        destroy-on-close
    >
      <div v-if="detailData">
        <p><strong>内容：</strong>{{ detailData.content }}</p>

        <!-- 媒体展示 -->
        <div class="media-container mt-3">
          <!-- 视频播放 -->
          <div v-if="detailData.type === 0 && detailData.mediaUrls?.length" class="video-wrapper">
            <vue3-video-play
                ref="videoPlayerRef"
                :src="detailData.mediaUrls[0]"
                width="100%"
                controls
                autoplay
            />
          </div>

          <!-- 图片展示 -->
          <div v-if="detailData.type === 1 && detailData.mediaUrls?.length">
            <a-image.PreviewGroup>
              <a-image
                  v-for="(url, index) in detailData.mediaUrls"
                  :key="index"
                  :width="100"
                  :src="url"
                  style="margin-right: 8px; margin-bottom: 8px"
              />
            </a-image.PreviewGroup>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted,onActivated  } from 'vue';
import { useRoute } from 'vue-router'; // 引入 useRoute
import { DownOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { postApi } from '/@/api/business/post/post-api';
import vue3VideoPlay from 'vue3-video-play';
import 'vue3-video-play/dist/style.css';

const route = useRoute();
// 表格列定义
const columns = [
  { title: 'ID', dataIndex: 'id', width: 100 },
  { title: '用户id', dataIndex: 'memberId', width: 100 },
  { title: '类型', dataIndex: 'type', customRender: ({ text }) => (text === 1 ? '图片' : text === 0 ?'视频': '文字') },
  { title: '可见性', dataIndex: 'visibility', customRender: ({ text }) => (text === 0 ? '全部' : '会员') },
  { title: '状态', dataIndex: 'status', slots: { customRender: 'status' } },
  { title: '点赞数', dataIndex: 'likeCount' },
  { title: '创建时间', dataIndex: 'createTime' ,width: 200},
  { title: '操作', slots: { customRender: 'action' }, width: 240 },
];

// 查询表单数据
const queryForm = ref({
  memberId: undefined,
  timeRange: [],
});

// 列表数据相关
const listData = ref([]);
const loading = ref(false);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  onChange: (page, pageSize) => {
    pagination.value.current = page;
    pagination.value.pageSize = pageSize;
    fetchData();
  },
});

// 详情弹窗相关
const detailVisible = ref(false);
const detailData = ref(null);
const videoPlayerRef = ref(null); // 视频组件引用

// 1. 获取列表数据
const fetchData = async () => {
  loading.value = true;
  try {
    const params = {
      memberId: queryForm.value.memberId,
      pageNum: pagination.value.current,
      pageSize: pagination.value.pageSize,
    };
    if (queryForm.value.timeRange && queryForm.value.timeRange.length === 2) {
      params.startTime = queryForm.value.timeRange[0];
      params.endTime = queryForm.value.timeRange[1];
    }

    const res = await postApi.queryPage(params);
    if (res.code === 0) {
      listData.value = res.data.list;
      pagination.value.total = res.data.total;
    } else {
      message.error(res.msg);
    }
  } catch (error) {
    message.error('请求失败');
  } finally {
    loading.value = false;
  }
};

// 2. 打开详情
const openDetail = async (id) => {
  try {
    const res = await postApi.detail({ id });
    if (res.code === 0) {
      detailData.value = res.data;
      detailVisible.value = true;
    }
  } catch (error) {
    message.error('获取详情失败');
  }
};

// 3. 修改审核状态
const handleStatusChange = async (id, status) => {
  try {
    const res = await postApi.updateStatus({ id, status });
    if (res.code === 0) {
      message.success('操作成功');
      fetchData();
    } else {
      message.error(res.msg);
    }
  } catch (error) {
    message.error('操作失败');
  }
};

// 4. 删除动态
const handleDelete = async (id) => {
  try {
    const res = await postApi.delete({ id });
    if (res.code === 0) {
      message.success('删除成功');
      fetchData();
    }
  } catch (error) {
    message.error('删除失败');
  }
};

// 5. 查询操作
const handleQuery = (e) => {
  e.preventDefault();
  pagination.value.current = 1;
  fetchData();
};

// 6. 关闭弹窗时暂停视频
const handleCancel = () => {
  // 尝试获取内部 video 元素并暂停（防止后台继续播放或产生回音）
  if (videoPlayerRef.value) {
    const videoEl = videoPlayerRef.value.$el?.querySelector('video');
    if (videoEl && !videoEl.paused) {
      videoEl.pause();
    }
  }
};

// 页面加载时获取数据
onMounted(() => {
  // 核心代码：判断 URL 中是否存在 memberId 参数，若有则赋值
  if (route.query.memberId) {
    queryForm.value.memberId = route.query.memberId;
  }
  fetchData();
});


// keep-alive 缓存后再次激活时触发（如果路由配置了 keep-alive 则需要）
onActivated(() => {
  if (route.query.memberId) {
    queryForm.value.memberId = route.query.memberId;
  }
  fetchData();
});
</script>

<style scoped>
.mb-4 { margin-bottom: 16px; }
.mt-3 { margin-top: 12px; }

/* 视频容器样式：防止视频超出模态框 */
.video-wrapper {
  max-width: 100%;
  overflow: hidden;
}
</style>