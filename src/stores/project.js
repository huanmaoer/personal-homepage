/* ============ 项目 Store（stores/project.js） ============
   Pinia 定义项目 Store：管理项目列表数据，提供增删改查 actions
   持久化：state 初始化从 localStorage 读取，actions 修改后写入 localStorage
   ============================================================ */
import { defineStore } from 'pinia'

// localStorage 存储键名
const STORAGE_KEY = 'projects'

/**
 * 从 localStorage 读取项目列表；无保存数据或解析失败时返回内置默认数据
 * @returns {Array} 项目数组
 */
function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      // 校验是数组才使用，避免脏数据
      if (Array.isArray(data)) return data
    }
  } catch (err) {
    console.warn('读取 localStorage[projects] 失败，已使用默认数据', err)
  }
  return defaultProjects
}

// 默认项目数据（首次访问时的种子数据，实验二/实验三沿用）
const defaultProjects = [
  {
    id: 1,
    title: '个人主页 Vue 重构',
    status: '已完成',
    tags: ['Vue3', '组件化', '组合式API'],
    desc: '将实验一单页迁移至 Vue 工程，拆分 7 个业务组件，完成 defineProps / defineEmits / defineModel 通信。',
    detail: '本项目是实验二的核心成果，将原生HTML/CSS/JS实现的个人主页重构为Vue3单页应用。主要工作包括：\n1. 拆分UserProfile、SkillSection、ProjectsPage等7个业务组件\n2. 熟练运用defineProps实现父传子、defineEmits实现子传父\n3. 使用defineModel实现双向数据绑定\n4. 综合运用默认插槽、具名插槽和作用域插槽\n5. 实现亮色/暗色主题切换功能',
    time: '2026-09',
    cover: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    title: '技能搜索工具',
    status: '已完成',
    tags: ['defineModel', 'Computed'],
    desc: '通过 defineModel 实现搜索关键词双向同步，配合计算属性对技能列表实时过滤。',
    detail: '实现了一个技能标签搜索过滤功能。通过defineModel实现父子组件间的双向数据绑定，配合computed计算属性实时过滤技能列表。还实现了技能标签点击选中、搜索关键词变化监听等功能。',
    time: '2026-09'
  },
  {
    id: 3,
    title: '校园二手交易平台',
    status: '开发中',
    tags: ['Vue3', 'Vite', 'Pinia'],
    desc: '面向在校学生的二手商品发布与交易平台，支持商品搜索、发布、收藏与站内信。',
    detail: '面向在校学生的C2C二手交易平台。目前正在开发阶段，计划实现以下功能：\n- 商品发布与管理\n- 多条件搜索与筛选\n- 商品收藏与浏览历史\n- 站内即时通讯\n- 订单状态跟踪',
    time: '2026-10'
  },
  {
    id: 4,
    title: '课程表助手',
    status: '开发中',
    tags: ['Vue3', '日历组件'],
    desc: '课表导入、周次切换与上课提醒，支持自定义课程颜色。',
    detail: '一款轻量化的课程表管理工具。支持导入Excel格式课表，按周次切换显示，课程颜色自定义配置，上课前推送提醒。界面设计简洁美观，操作流畅。',
    time: '2026-09'
  },
  {
    id: 5,
    title: '记账小程序',
    status: '规划中',
    tags: ['微信小程序', '云开发'],
    desc: '轻量级个人记账工具，支持分类统计、月度报表与预算提醒。',
    detail: '计划开发的微信小程序项目。主要功能包括：日常收支记录、分类统计饼图、月度支出报表、预算设置与超支提醒、数据云同步。',
    time: '2026-11'
  },
  {
    id: 6,
    title: '开源组件库',
    status: '规划中',
    tags: ['TypeScript', 'Vue3'],
    desc: '沉淀实验中的通用 UI 组件：徽章、卡片、弹窗、筛选栏等，供后续项目复用。',
    detail: '将课程实验中积累的通用UI组件封装为开源组件库，包括：状态徽章、项目卡片、筛选栏、编辑弹窗、搜索框、标签组等。使用TypeScript编写，完善类型定义和单元测试。',
    time: '2026-12'
  }
]

// 定义并导出项目 Store（id 为 'project'）
export const useProjectStore = defineStore('project', {
  // ---------- state ----------
  state: () => ({
    // 项目列表：初始化时从 localStorage 恢复，无数据用默认种子数据
    projects: loadProjects()
  }),

  // ---------- getters：派生的统计数据与查询函数 ----------
  getters: {
    // 项目总数
    totalCount: (state) => state.projects.length,
    // 已完成项目数
    doneCount: (state) => state.projects.filter((p) => p.status === '已完成').length,
    // 开发中项目数
    developingCount: (state) => state.projects.filter((p) => p.status === '开发中').length,
    // 规划中项目数
    planningCount: (state) => state.projects.filter((p) => p.status === '规划中').length,
    // 函数型 getter：按状态筛选（'全部' 返回完整列表）
    filterByStatus: (state) => (status) =>
      status === '全部' ? state.projects : state.projects.filter((p) => p.status === status),
    // 函数型 getter：按 id 查找项目（找不到返回 undefined）
    getById: (state) => (id) => state.projects.find((p) => p.id === Number(id))
  },

  // ---------- actions：增删改查 ----------
  actions: {
    /** 内部方法：把项目列表写入 localStorage */
    saveProjects() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.projects))
    },

    /**
     * 新增项目
     * @param {object} data 项目表单数据（title/status/tags/desc/detail/time）
     * @returns {object} 新创建的项目对象
     */
    addProject(data) {
      // 生成新 id：取当前最大 id + 1
      const maxId = this.projects.reduce((max, p) => Math.max(max, p.id), 0)
      const project = {
        id: maxId + 1,
        title: String(data.title || '').trim(),
        status: data.status || '规划中',
        // tags 支持数组或逗号分隔字符串两种输入，统一转为数组
        tags: Array.isArray(data.tags)
          ? data.tags
          : String(data.tags || '').split(/[,，\s]+/).filter(Boolean),
        desc: String(data.desc || '').trim(),
        detail: String(data.detail || data.desc || '').trim(),
        time: data.time || '2026-10'
      }
      this.projects.push(project)
      // 修改后立即持久化
      this.saveProjects()
      return project
    },

    /**
     * 更新项目
     * @param {number|string} id   项目 id
     * @param {object} data  需要更新的字段（局部字段即可，其余保留）
     * @returns {object|null} 更新后的项目；找不到返回 null
     */
    updateProject(id, data) {
      const index = this.projects.findIndex((p) => p.id === Number(id))
      if (index === -1) return null
      // 合并：保留原有字段，覆盖传入字段
      const old = this.projects[index]
      this.projects[index] = {
        ...old,
        ...data,
        id: old.id,
        title: data.title !== undefined ? String(data.title).trim() : old.title,
        // tags 兼容数组/字符串输入
        tags: Array.isArray(data.tags)
          ? data.tags
          : typeof data.tags === 'string'
            ? data.tags.split(/[,，\s]+/).filter(Boolean)
            : old.tags
      }
      // 修改后立即持久化
      this.saveProjects()
      return this.projects[index]
    },

    /**
     * 删除项目
     * @param {number|string} id 项目 id
     * @returns {boolean} 是否删除成功
     */
    deleteProject(id) {
      const index = this.projects.findIndex((p) => p.id === Number(id))
      if (index === -1) return false
      this.projects.splice(index, 1)
      // 删除后立即持久化
      this.saveProjects()
      return true
    }
  }
})
