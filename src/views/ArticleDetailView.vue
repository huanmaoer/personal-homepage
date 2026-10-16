<script setup>
/* ============ 文章详情视图 ArticleDetailView ============
   动态路由组件：对应路由 /articles/detail/:id
   使用文章 Store 按 id 查找文章，展示完整内容
   第二次实验：使用 el-card / el-tag / el-button / el-divider / el-result 重构 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '../stores/article.js'

const route = useRoute()
const router = useRouter()

// 获取文章 Store 实例
const articleStore = useArticleStore()

// 获取路由参数 id
const articleId = computed(() => Number(route.params.id))

// 根据 id 查找对应文章
const article = computed(() => articleStore.getById(articleId.value))

// 分类对应标签类型
const categoryTagType = (cat) => {
  if (cat === '技术笔记') return 'primary'
  if (cat === '学习心得') return 'success'
  return 'warning'
}

const goBack = () => router.go(-1)
const goToList = () => router.push({ name: 'ArticleList' })
</script>

<template>
  <div class="article-detail-view">
    <!-- 文章不存在：el-result -->
    <el-result
      v-if="!article"
      icon="warning"
      title="未找到该文章"
      :sub-title="`文章 ID 为 ${articleId} 的文章不存在或已被删除。`"
    >
      <template #extra>
        <el-button type="primary" @click="goToList">返回文章列表</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </template>
    </el-result>

    <!-- 文章详情 -->
    <el-card v-else shadow="never">
      <div class="detail-head">
        <div>
          <h2 class="detail-title">{{ article.title }}</h2>
          <p class="detail-time">发布时间：{{ article.time }}</p>
        </div>
        <el-tag :type="categoryTagType(article.category)" size="large">
          {{ article.category }}
        </el-tag>
      </div>

      <div class="detail-tags">
        <el-tag v-for="tag in article.tags" :key="tag" effect="plain" style="margin-right: 6px">
          {{ tag }}
        </el-tag>
      </div>

      <el-divider />

      <h3 class="sub-title">摘要</h3>
      <p class="detail-summary">{{ article.summary }}</p>

      <h3 class="sub-title">正文</h3>
      <pre class="detail-content">{{ article.content }}</pre>

      <div class="detail-actions">
        <el-button @click="goBack">返回上一页</el-button>
        <el-button type="primary" @click="goToList">返回文章列表</el-button>
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

.detail-summary {
  font-size: 15px;
  line-height: 1.8;
  opacity: 0.85;
}

.detail-content {
  font-family: inherit;
  font-size: 14px;
  line-height: 1.9;
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
