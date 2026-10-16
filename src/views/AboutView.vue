<script setup>
/* ============ 关于视图 AboutView（个人信息页） ============
   路由组件：对应路由 /about
   实验四：个人信息改用用户 Store（storeToRefs 解构保持响应式）
   第二次实验：
   - el-descriptions 描述列表展示个人信息
   - el-card 卡片容器
   - el-timeline 时间线组件：新增"校园与项目经历"时间线（实验硬性要求） */
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user.js'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 时间线数据：校园经历与项目里程碑（可在后台修改个人信息后联动展示）
const timelineItems = [
  {
    time: '2024-09',
    title: '入学重庆工程学院',
    content: '进入计算机科学与技术专业，开始系统学习前端与后端开发基础。',
    type: 'primary'
  },
  {
    time: '2025-06',
    title: '完成首个个人主页（原生 HTML/CSS/JS）',
    content: '从零手写静态个人主页，掌握了语义化标签、Flex 布局与原生 JS 交互。',
    type: 'success'
  },
  {
    time: '2025-12',
    title: '学生会办公室任职干事',
    content: '参与活动策划与文档整理，锻炼了跨部门协作与沟通能力。',
    type: 'warning'
  },
  {
    time: '2026-06',
    title: 'Vue3 工程化项目实战',
    content: '使用 Vite + Vue Router + Pinia 重构个人主页，完成组件化与状态管理实验。',
    type: 'primary'
  },
  {
    time: '2026-10',
    title: 'Element Plus 组件库重构',
    content: '引入 Element Plus，使用布局、菜单、表单、对话框、时间线等组件全面美化界面。',
    type: 'danger'
  }
]
</script>

<template>
  <div class="about-view">
    <!-- 个人信息卡片：el-descriptions 描述列表 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-title-row">
          <span>关于我</span>
          <el-tag type="info" effect="plain">{{ userInfo.xh }}</el-tag>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="姓名">{{ userInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ userInfo.xh }}</el-descriptions-item>
        <el-descriptions-item label="专业班级">{{ userInfo.majorClass }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">
          <el-link type="primary" :href="`mailto:${userInfo.email}`">{{ userInfo.email }}</el-link>
        </el-descriptions-item>
        <el-descriptions-item label="个人简介" :span="2">
          {{ userInfo.intro }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 校园与项目经历：el-timeline 时间线（实验要求新增） -->
    <el-card shadow="never">
      <template #header>
        <div class="card-title-row">
          <span>校园与项目经历</span>
          <el-tag size="small" type="success">{{ timelineItems.length }} 个节点</el-tag>
        </div>
      </template>

      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in timelineItems"
          :key="index"
          :timestamp="item.time"
          placement="top"
          :type="item.type"
        >
          <el-card shadow="hover">
            <h4 class="tl-title">{{ item.title }}</h4>
            <p class="tl-content">{{ item.content }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <!-- 联系方式卡片 -->
    <el-card shadow="never">
      <template #header><span>联系方式</span></template>
      <el-space direction="vertical" :size="10">
        <div><el-icon><Message /></el-icon> 邮箱：{{ userInfo.email }}</div>
        <div><el-icon><Link /></el-icon> GitHub：github.com/jiangjingyi</div>
        <div><el-icon><Notebook /></el-icon> 博客：blog.jiangjingyi.dev</div>
      </el-space>
    </el-card>
  </div>
</template>

<style scoped>
.about-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tl-title {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 600;
}

.tl-content {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  opacity: 0.8;
}
</style>
