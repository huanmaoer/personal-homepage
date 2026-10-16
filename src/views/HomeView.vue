<script setup>
/* ============ 首页视图 HomeView ============
   路由组件：对应路由 /home
   实验四：个人信息与技能列表改用用户 Store（storeToRefs 解构保持响应式）
   第二次实验：使用 Element Plus 组件重构首页
   - el-card 卡片容器
   - el-avatar 头像
   - el-tag 技能标签
   - el-input 搜索框（带前缀图标）
   - el-button 编辑按钮
   - el-row / el-col 栅格布局 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user.js'
import { useArticleStore } from '../stores/article.js'

const router = useRouter()

// 用户 Store：个人信息、技能列表（storeToRefs 保持响应式）
const userStore = useUserStore()
const { userInfo, skills } = storeToRefs(userStore)

// 文章 Store：取最新 3 篇文章作为首页"最新文章"推荐
const articleStore = useArticleStore()
const latestArticles = computed(() => articleStore.latestArticles(3))

// 搜索关键词
const searchKey = ref('')
// 选中的技能
const selectedSkill = ref('')

// 计算属性：过滤后的技能列表
const filterSkillList = computed(() => {
  const key = searchKey.value.trim().toLowerCase()
  if (!key) return skills.value
  return skills.value.filter((item) => item.toLowerCase().includes(key))
})

// 技能选中事件
const handleSelectSkill = (skill) => {
  selectedSkill.value = skill
}

// 跳转编辑个人信息（后台，需登录）
const handleEdit = () => {
  router.push({ name: 'AdminProfile' })
}

// 跳转到文章详情
const goArticle = (id) => {
  router.push({ name: 'ArticleDetail', params: { id } })
}
</script>

<template>
  <div class="home-view">
    <!-- 个人信息卡片 -->
    <el-card shadow="hover" class="profile-card">
      <div class="profile-head">
        <!-- el-avatar 头像组件 -->
        <el-avatar :size="80" :src="userInfo.avatar" class="profile-avatar">
          {{ userInfo.name.charAt(0) }}
        </el-avatar>

        <div class="profile-meta">
          <h2 class="profile-name">
            {{ userInfo.name }}
            <el-tag size="small" type="info" effect="plain" style="margin-left: 8px">
              {{ userInfo.majorClass }}
            </el-tag>
          </h2>
          <p class="profile-desc">{{ userInfo.intro }}</p>
          <el-space :size="8" wrap>
            <el-button type="primary" size="small" @click="handleEdit">
              <el-icon style="margin-right: 4px"><Edit /></el-icon>
              编辑个人信息
            </el-button>
            <el-button size="small" @click="router.push('/articles/list')">
              看看我的文章
            </el-button>
          </el-space>
        </div>
      </div>
    </el-card>

    <!-- 栅格布局：左侧技能搜索，右侧最新文章 -->
    <el-row :gutter="20">
      <!-- 技能搜索区 -->
      <el-col :xs="24" :md="14">
        <el-card shadow="never">
          <template #header>
            <div class="card-header-row">
              <span>我的技能栈</span>
              <el-tag size="small" type="success">{{ filterSkillList.length }} 项</el-tag>
            </div>
          </template>

          <!-- el-input 搜索框：带搜索前缀图标 -->
          <el-input
            v-model="searchKey"
            placeholder="搜索技能关键词，如 Vue"
            clearable
            class="skill-search"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>

          <!-- el-tag 技能标签组 -->
          <div class="skill-tags">
            <el-tag
              v-for="skill in filterSkillList"
              :key="skill"
              :type="selectedSkill === skill ? 'primary' : 'info'"
              effect="plain"
              class="skill-tag"
              @click="handleSelectSkill(skill)"
            >
              {{ skill }}
            </el-tag>
            <el-empty
              v-if="filterSkillList.length === 0"
              description="没有匹配的技能"
              :image-size="60"
            />
          </div>

          <p v-if="selectedSkill" class="select-tip">
            <el-icon><Star /></el-icon>
            最近选中技能：<b>{{ selectedSkill }}</b>
          </p>
        </el-card>
      </el-col>

      <!-- 最新文章推荐 -->
      <el-col :xs="24" :md="10">
        <el-card shadow="never">
          <template #header>
            <div class="card-header-row">
              <span>最新文章</span>
              <el-link type="primary" :underline="false" @click="router.push('/articles/list')">
                全部文章
              </el-link>
            </div>
          </template>

          <!-- el-list 文章列表 -->
          <el-space direction="vertical" :size="14" fill>
            <div
              v-for="article in latestArticles"
              :key="article.id"
              class="article-item"
              @click="goArticle(article.id)"
            >
              <div class="article-item-title">{{ article.title }}</div>
              <div class="article-item-meta">
                <el-tag size="small" effect="plain">{{ article.category }}</el-tag>
                <span class="article-item-time">{{ article.time }}</span>
              </div>
            </div>
          </el-space>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-head {
  display: flex;
  gap: 20px;
  align-items: center;
}

.profile-avatar {
  flex-shrink: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: 700;
}

.profile-name {
  font-size: 22px;
  margin: 0 0 6px;
  display: flex;
  align-items: center;
}

.profile-desc {
  font-size: 14px;
  opacity: 0.75;
  margin: 0 0 12px;
  line-height: 1.7;
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-search {
  margin-bottom: 14px;
}

.skill-tags {
  min-height: 60px;
}

.skill-tag {
  margin: 0 8px 8px 0;
  cursor: pointer;
}

.select-tip {
  margin-top: 10px;
  font-size: 13px;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-item {
  cursor: pointer;
  padding: 8px 4px;
  border-bottom: 1px dashed var(--border-color);
  transition: background 0.2s;
}

.article-item:last-child {
  border-bottom: none;
}

.article-item:hover {
  background-color: var(--box-bg);
}

.article-item-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  line-height: 1.5;
}

.article-item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.article-item-time {
  font-size: 12px;
  opacity: 0.6;
}
</style>
