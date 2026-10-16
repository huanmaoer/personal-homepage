<script setup>
/* ============ 项目展示页面容器组件 ProjectsPage ============
   页面级组件：持有项目数据、筛选状态，组织"标题 / 筛选 / 列表"三个区域
   组件拆分：
     - SectionHeader：区块标题（props + #extra 具名插槽）
     - ProjectFilter：筛选栏（props + defineModel 双向同步）
     - ProjectList：列表容器（props + 作用域插槽暴露当前项目/序号）
     - ProjectCard：可复用项目卡片（props + 默认插槽 + 具名插槽）
   插槽综合应用：
     - 具名插槽 #extra：标题区右侧的数量统计徽章
     - 作用域插槽：ProjectList 把当前 project / index 暴露给父组件模板
     - 默认插槽覆盖：带封面的项目定制卡片主体内容
     - 具名插槽 #actions：为"技能搜索工具"定制双按钮操作区
   合理选择 props 与插槽：
     - 项目数据、筛选选项、标题文本等"数据/配置" → props 单向传入
     - 按钮组合、封面结构、统计徽章等"由父组件决定的模板内容" → 插槽 */
import { ref, computed, reactive } from 'vue'
import SectionHeader from './SectionHeader.vue'
import ProjectFilter from './ProjectFilter.vue'
import ProjectList from './ProjectList.vue'
import ProjectCard from './ProjectCard.vue'

// 项目数据：由页面组件持有（父组件共享状态），通过 props 单向下传
const projects = reactive([
  {
    id: 1,
    title: '个人主页 Vue 重构',
    status: '已完成',
    tags: ['Vue3', '组件化', '组合式API'],
    desc: '将实验一单页迁移至 Vue 工程，拆分 7 个业务组件，完成 defineProps / defineEmits / defineModel 通信。',
    time: '2026-09',
    cover: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    title: '技能搜索工具',
    status: '已完成',
    tags: ['defineModel', 'Computed'],
    desc: '通过 defineModel 实现搜索关键词双向同步，配合计算属性对技能列表实时过滤。',
    time: '2026-09'
  },
  {
    id: 3,
    title: '校园二手交易平台',
    status: '开发中',
    tags: ['Vue3', 'Vite', 'Pinia'],
    desc: '面向在校学生的二手商品发布与交易平台，支持商品搜索、发布、收藏与站内信。',
    time: '2026-10'
  },
  {
    id: 4,
    title: '课程表助手',
    status: '开发中',
    tags: ['Vue3', '日历组件'],
    desc: '课表导入、周次切换与上课提醒，支持自定义课程颜色。',
    time: '2026-09'
  },
  {
    id: 5,
    title: '记账小程序',
    status: '规划中',
    tags: ['微信小程序', '云开发'],
    desc: '轻量级个人记账工具，支持分类统计、月度报表与预算提醒。',
    time: '2026-11'
  },
  {
    id: 6,
    title: '开源组件库',
    status: '规划中',
    tags: ['TypeScript', 'Vue3'],
    desc: '沉淀实验中的通用 UI 组件：徽章、卡片、弹窗、筛选栏等，供后续项目复用。',
    time: '2026-12'
  }
])

// 筛选选项与当前选中项
const filterOptions = ['全部', '已完成', '开发中', '规划中']
const activeFilter = ref('全部')

// 根据筛选值计算展示的项目列表
const filterProjects = computed(() => {
  if (activeFilter.value === '全部') return projects
  return projects.filter((p) => p.status === activeFilter.value)
})

// 父组件处理查看项目操作
const handleView = (project) => {
  console.log('查看项目详情：', project.title)
}
</script>

<template>
  <section class="projects-page">
    <!-- 区块标题：props 传入标题文本，#extra 具名插槽传入数量统计 -->
    <SectionHeader title="项目展示" subtitle="综合应用 props 与插槽实现的个人项目集">
      <template #extra>
        <span class="count-badge">共 {{ projects.length }} 个项目</span>
      </template>
    </SectionHeader>

    <!-- 筛选栏：props 传选项数据，defineModel 双向同步筛选值 -->
    <ProjectFilter v-model="activeFilter" :options="filterOptions" />

    <!-- 项目列表：作用域插槽把当前 project / index 暴露给父组件模板 -->
    <ProjectList :projects="filterProjects">
      <template #default="{ project, index }">
        <ProjectCard :project="project" :index="index">
          <!-- 默认插槽覆盖：带封面的项目定制卡片主体（封面 + 简介 + 标签） -->
          <template v-if="project.cover" #default>
            <div class="card-cover" :style="{ background: project.cover }">
              <span class="cover-no">#{{ String(index + 1).padStart(2, '0') }}</span>
            </div>
            <p class="card-desc">{{ project.desc }}</p>
            <div class="card-tags">
              <span v-for="tag in project.tags" :key="tag" class="skill-tag">{{ tag }}</span>
            </div>
          </template>

          <!-- 具名插槽定制：#actions 操作区（仅对"技能搜索工具"定制为双按钮） -->
          <template v-if="project.id === 2" #actions>
            <button class="btn btn-edit" @click="handleView(project)">在线预览</button>
            <button class="btn btn-default" @click="handleView(project)">查看源码</button>
          </template>
        </ProjectCard>
      </template>
    </ProjectList>
  </section>
</template>

<style scoped>
.projects-page {
  width: 100%;
}

.count-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 13px;
  background-color: var(--box-bg);
  border: 1px solid var(--border-color);
}

.card-cover {
  height: 120px;
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 10px 12px;
}

.cover-no {
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
</style>
