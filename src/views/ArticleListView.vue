<script setup>
/* ============ 文章列表视图 ArticleListView ============
   嵌套子路由组件：对应路由 /articles/list
   使用文章 Store（storeToRefs 解构保持响应式），按分类筛选展示文章卡片
   第二次实验：
   - el-radio-group 分类筛选
   - el-card 文章卡片
   - el-tag 分类标签
   - el-empty 空状态
   - el-row / el-col 栅格 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '../stores/article.js'

const router = useRouter()

// 获取文章 Store 实例
const articleStore = useArticleStore()
const { articles, totalCount, categoryStats } = storeToRefs(articleStore)

// 分类筛选选项
const filterOptions = ['全部', '技术笔记', '学习心得', '生活随笔']
const activeFilter = ref('全部')

// 计算属性：根据当前分类筛选文章列表
const filterArticles = computed(() =>
  articleStore.filterByCategory(activeFilter.value)
)

// 分类对应的 el-tag 类型
const categoryTagType = (cat) => {
  if (cat === '技术笔记') return 'primary'
  if (cat === '学习心得') return 'success'
  return 'warning'
}

// 查看文章详情
const handleView = (article) => {
  router.push({ name: 'ArticleDetail', params: { id: article.id } })
}
</script>

<template>
  <div class="article-list-view">
    <!-- 分类筛选栏 -->
    <el-card shadow="never" class="filter-card">
      <el-radio-group v-model="activeFilter">
        <el-radio-button v-for="opt in filterOptions" :key="opt" :value="opt">
          {{ opt }}
          <span v-if="opt !== '全部' && categoryStats[opt]" class="radio-count">
            ({{ categoryStats[opt] }})
          </span>
        </el-radio-button>
      </el-radio-group>
      <span class="total-tip">共 {{ totalCount }} 篇文章</span>
    </el-card>

    <!-- 文章卡片栅格 -->
    <el-row :gutter="20">
      <el-col v-for="article in filterArticles" :key="article.id" :xs="24" :sm="12">
        <el-card shadow="hover" class="article-card" @click="handleView(article)">
          <div class="article-head">
            <el-tag :type="categoryTagType(article.category)" size="small">
              {{ article.category }}
            </el-tag>
            <span class="article-time">
              <el-icon><Calendar /></el-icon>
              {{ article.time }}
            </span>
          </div>

          <h3 class="article-title">{{ article.title }}</h3>
          <p class="article-summary">{{ article.summary }}</p>

          <div class="article-tags">
            <el-tag v-for="tag in article.tags" :key="tag" size="small" effect="plain">
              {{ tag }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 空状态 -->
    <el-empty v-if="filterArticles.length === 0" description="暂无该分类下的文章" />
  </div>
</template>

<style scoped>
.filter-card {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.radio-count {
  font-size: 12px;
  opacity: 0.75;
}

.total-tip {
  font-size: 13px;
  opacity: 0.6;
}

.article-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.article-card:hover {
  transform: translateY(-3px);
}

.article-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.article-time {
  font-size: 13px;
  opacity: 0.6;
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 8px;
  line-height: 1.5;
}

.article-summary {
  font-size: 14px;
  line-height: 1.7;
  opacity: 0.8;
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
</style>
