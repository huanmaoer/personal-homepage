<script setup>
/* ============ 项目列表视图 ProjectListView ============
   嵌套子路由组件：对应路由 /projects/list
   实验四：项目数据改用项目 Store（storeToRefs 解构保持响应式，
   筛选使用 Store 的函数型 getter filterByStatus）
   第二次实验：
   - el-radio-group / el-radio-button 状态筛选
   - el-card 项目卡片
   - el-tag 状态与技术标签
   - el-empty 空状态
   - el-row / el-col 栅格布局 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '../stores/project.js'

const router = useRouter()

// 获取项目 Store 实例
const projectStore = useProjectStore()
const { totalCount, doneCount, developingCount, planningCount } = storeToRefs(projectStore)

// 筛选选项与当前选中项
const filterOptions = ['全部', '已完成', '开发中', '规划中']
const activeFilter = ref('全部')

// 根据筛选值计算展示的项目列表（使用 Store 的函数型 getter）
const filterProjects = computed(() =>
  projectStore.filterByStatus(activeFilter.value)
)

// 不同状态对应的 el-tag 类型
const statusTagType = (status) => {
  if (status === '已完成') return 'success'
  if (status === '开发中') return 'primary'
  return 'warning'
}

// 查看项目详情：编程式导航 push 跳转到详情页
const handleView = (project) => {
  router.push({ name: 'ProjectDetail', params: { id: project.id } })
}
</script>

<template>
  <div class="project-list-view">
    <!-- 筛选栏：el-radio-group 按钮组 -->
    <el-card shadow="never" class="filter-card">
      <el-radio-group v-model="activeFilter">
        <el-radio-button v-for="opt in filterOptions" :key="opt" :value="opt">
          {{ opt }}
        </el-radio-button>
      </el-radio-group>

      <!-- el-space 统计信息 -->
      <el-space class="stats" :size="16">
        <span>共 {{ totalCount }} 个</span>
        <el-tag size="small" type="success">已完成 {{ doneCount }}</el-tag>
        <el-tag size="small" type="primary">开发中 {{ developingCount }}</el-tag>
        <el-tag size="small" type="warning">规划中 {{ planningCount }}</el-tag>
      </el-space>
    </el-card>

    <!-- 项目卡片栅格 -->
    <el-row :gutter="20">
      <el-col v-for="(project, index) in filterProjects" :key="project.id" :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="project-card" @click="handleView(project)">
          <!-- 封面色块 -->
          <div
            class="card-cover"
            :style="project.cover ? { background: project.cover } : {}"
          >
            <span class="cover-no">#{{ String(index + 1).padStart(2, '0') }}</span>
            <el-tag :type="statusTagType(project.status)" size="small" class="cover-tag">
              {{ project.status }}
            </el-tag>
          </div>

          <h3 class="card-title">{{ project.title }}</h3>
          <p class="card-desc">{{ project.desc }}</p>

          <div class="card-tags">
            <el-tag v-for="tag in project.tags" :key="tag" size="small" effect="plain">
              {{ tag }}
            </el-tag>
          </div>

          <div class="card-time">
            <el-icon><Clock /></el-icon>
            {{ project.time }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 空状态 -->
    <el-empty v-if="filterProjects.length === 0" description="该状态下暂无项目" />
  </div>
</template>

<style scoped>
.filter-card {
  margin-bottom: 20px;
}

.stats {
  margin-left: auto;
}

.project-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.project-card:hover {
  transform: translateY(-4px);
}

.card-cover {
  height: 100px;
  border-radius: 6px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 8px 10px;
  background: var(--box-bg);
}

.cover-no {
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.cover-tag {
  margin: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
}

.card-desc {
  font-size: 13px;
  line-height: 1.7;
  opacity: 0.8;
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.card-time {
  font-size: 12px;
  opacity: 0.6;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
