<script setup>
/* ============ 项目详情视图 ProjectDetailView ============
   动态路由组件：对应路由 /projects/detail/:id
   实验四：按 id 查找项目改用项目 Store 的函数型 getter getById
   第二次实验：使用 el-card / el-tag / el-button / el-descriptions 重构详情 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '../stores/project.js'

const route = useRoute()
const router = useRouter()

// 获取项目 Store 实例
const projectStore = useProjectStore()

// 获取路由参数 id，转为数字
const projectId = computed(() => Number(route.params.id))

// 根据 id 查找对应项目
const project = computed(() => projectStore.getById(projectId.value))

// 不同状态对应的 el-tag 类型
const statusTagType = (status) => {
  if (status === '已完成') return 'success'
  if (status === '开发中') return 'primary'
  return 'warning'
}

const goBack = () => router.go(-1)
const goToList = () => router.push({ name: 'ProjectList' })
</script>

<template>
  <div class="project-detail-view">
    <!-- 项目不存在时的处理：el-result -->
    <el-result
      v-if="!project"
      icon="warning"
      title="未找到该项目"
      :sub-title="`项目 ID 为 ${projectId} 的项目不存在或已被删除。`"
    >
      <template #extra>
        <el-button type="primary" @click="goToList">返回项目列表</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </template>
    </el-result>

    <!-- 项目详情内容 -->
    <el-card v-else shadow="never" class="detail-card">
      <div class="detail-head">
        <div>
          <h2 class="detail-title">{{ project.title }}</h2>
          <p class="detail-time">更新时间：{{ project.time }}</p>
        </div>
        <el-tag :type="statusTagType(project.status)" size="large">{{ project.status }}</el-tag>
      </div>

      <!-- 技术标签 -->
      <div class="detail-tags">
        <el-tag v-for="tag in project.tags" :key="tag" effect="plain" style="margin-right: 6px">
          {{ tag }}
        </el-tag>
      </div>

      <el-divider />

      <h3 class="sub-title">项目简介</h3>
      <p class="detail-desc">{{ project.desc }}</p>

      <h3 class="sub-title">详细说明</h3>
      <pre class="detail-content">{{ project.detail }}</pre>

      <div class="detail-actions">
        <el-button @click="goBack">返回上一页</el-button>
        <el-button type="primary" @click="goToList">返回项目列表</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.detail-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.detail-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.detail-time {
  font-size: 14px;
  opacity: 0.6;
  margin-top: 4px;
}

.detail-tags {
  margin-bottom: 8px;
}

.sub-title {
  font-size: 16px;
  font-weight: 600;
  margin: 16px 0 8px;
}

.detail-desc {
  font-size: 15px;
  line-height: 1.8;
  opacity: 0.85;
}

.detail-content {
  font-family: inherit;
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-wrap;
  background-color: var(--box-bg);
  padding: 14px 16px;
  border-radius: 8px;
  margin: 8px 0 0;
}

.detail-actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}
</style>
