/* ============ 文章 Store（stores/article.js） ============
   Pinia 定义文章 Store：管理文章列表数据，提供增删改查 actions
   持久化：state 初始化从 localStorage 读取，actions 修改后写入 localStorage
   ============================================================ */
import { defineStore } from 'pinia'

// localStorage 存储键名
const STORAGE_KEY = 'articles'

/**
 * 从 localStorage 读取文章列表；无保存数据或解析失败时返回内置默认数据
 * @returns {Array} 文章数组
 */
function loadArticles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (Array.isArray(data)) return data
    }
  } catch (err) {
    console.warn('读取 localStorage[articles] 失败，已使用默认数据', err)
  }
  return defaultArticles
}

// 默认文章数据（与课程实验内容相关的种子文章）
const defaultArticles = [
  {
    id: 1,
    title: 'Vue3 组合式 API 学习笔记',
    category: '技术笔记',
    summary: '从 setup 语法糖到 ref、reactive、computed、watch，系统梳理组合式 API 的核心概念与使用场景。',
    content: '组合式 API 是 Vue3 推荐的组织代码方式。setup 是组件逻辑的入口，在其中声明的变量与函数都可以直接在模板中使用。\n\nref 用于包装基本类型值，访问时需要 .value；reactive 用于包装对象，可以直接访问属性。两者都是响应式数据，配合 computed 可以派生计算值，配合 watch 可以监听变化。\n\n相比选项式 API，组合式 API 的优势在于：同一业务逻辑的代码可以集中在一起，组件规模变大时更容易维护与复用。',
    tags: ['Vue3', '组合式API'],
    time: '2026-09-20'
  },
  {
    id: 2,
    title: 'Pinia 状态管理初探',
    category: '技术笔记',
    summary: '为什么需要全局状态管理？state、getters、actions 三者如何分工？storeToRefs 又解决了什么问题？',
    content: '当多个组件需要共享同一份数据时，仅靠 props 逐层传递会非常繁琐，这时就需要全局状态管理。Pinia 是 Vue 官方推荐的下一代状态管理库。\n\n一个 Store 由三部分组成：state 存储响应式数据，相当于组件的 data；getters 基于 state 派生计算值，具有缓存特性，相当于 computed；actions 是修改 state 的方法，是改变状态的唯一推荐入口，支持同步与异步操作。\n\n直接解构 Store 实例会导致响应性丢失，因为解构后的变量只是普通值。使用 storeToRefs 可以把 state 和 getters 包装为 ref，解构后依然保持响应式；actions 则不需要包装，可以直接从 Store 实例解构使用。',
    tags: ['Pinia', '状态管理'],
    time: '2026-10-06'
  },
  {
    id: 3,
    title: 'Vue Router 路由守卫实践',
    category: '学习心得',
    summary: '用 beforeEach 全局前置守卫实现登录校验，结合路由 meta 元信息灵活控制页面访问权限。',
    content: '路由守卫是 Vue Router 提供的导航钩子。beforeEach 会在每次路由跳转前执行，适合做登录校验、页面标题更新等全局逻辑。\n\n在守卫函数内部可以直接调用 useUserStore() 读取登录状态——但要注意必须在守卫函数内部调用，而不是在模块顶层调用，以确保 Pinia 已完成初始化。\n\n配合路由的 meta 字段，可以灵活标记哪些页面需要认证：meta.requiresAuth = true 的页面在未登录时重定向到登录页，并携带 redirect 参数记录来源路径，登录成功后自动跳回。',
    tags: ['Vue Router', '路由守卫'],
    time: '2026-10-10'
  },
  {
    id: 4,
    title: 'localStorage 实现数据持久化',
    category: '技术笔记',
    summary: 'Pinia 本身不提供持久化能力，手动读写 localStorage 是理解数据流的最佳实践。',
    content: 'Pinia 的数据存在内存中，页面刷新后会重置为初始值。要实现刷新后数据不丢失，需要手动接入 localStorage。\n\n思路很简单：state 初始化时通过 JSON.parse 从 localStorage 读取已保存的值作为默认值；在 actions 修改 state 后，通过 JSON.stringify 同步写入 localStorage。\n\n这样做的优点是逻辑透明、不引入额外依赖，也便于在 DevTools 中观察每一次状态变化；缺点是需要在每个 Store 中重复编写读写代码，当 Store 较多时可以考虑使用 pinia-plugin-persistedstate 之类的插件统一处理。',
    tags: ['localStorage', '持久化'],
    time: '2026-10-11'
  },
  {
    id: 5,
    title: '前端工程化学习总结',
    category: '学习心得',
    summary: '从 Vite 构建工具到组件化开发，回顾本学期前端课程的关键收获与踩坑记录。',
    content: '本学期学习了 Vue3 工程化开发的全流程：使用 Vite 搭建项目脚手架，理解单文件组件 SFC 的编译过程，掌握组件通信的多种方式。\n\n踩过不少坑：比如忘了在 main.js 注册路由导致页面空白、props 传对象时响应性丢失、打包后在本地直接打开文件时路由失效等。后来统一改用 Hash 模式路由解决本地预览问题。\n\n最大的收获是建立了组件化思维：页面拆分成可复用的组件，数据通过 props 单向流动，状态变化通过事件上报，代码结构清晰且易于维护。',
    tags: ['工程化', 'Vite'],
    time: '2026-10-05'
  },
  {
    id: 6,
    title: '关于大学生涯规划的一点思考',
    category: '生活随笔',
    summary: '记录大三开学前对技术方向、学习节奏与生活平衡的思考。',
    content: '转眼已经大二升大三，前端方向的学习从写页面到了解工程化与状态管理，越来越接近真实项目的复杂度。\n\n接下来打算在数据结构与算法上多花时间，同时把 Vue3 生态深入下去：Pinia、TypeScript、组件库封装。学习节奏上，坚持每周一篇技术笔记，把踩过的坑沉淀下来。\n\n技术之外，也提醒自己保持运动和阅读，平衡好学习与生活。',
    tags: ['随笔', '规划'],
    time: '2026-09-28'
  }
]

// 定义并导出文章 Store（id 为 'article'）
export const useArticleStore = defineStore('article', {
  // ---------- state ----------
  state: () => ({
    // 文章列表：初始化时从 localStorage 恢复，无数据用默认种子数据
    articles: loadArticles()
  }),

  // ---------- getters：派生的统计数据与查询函数 ----------
  getters: {
    // 文章总数
    totalCount: (state) => state.articles.length,
    // 函数型 getter：按分类筛选（'全部' 返回完整列表）
    filterByCategory: (state) => (category) =>
      category === '全部' ? state.articles : state.articles.filter((a) => a.category === category),
    // 函数型 getter：按 id 查找文章
    getById: (state) => (id) => state.articles.find((a) => a.id === Number(id)),
    // 函数型 getter：最新文章（按时间倒序取前 N 篇，默认 3 篇）
    latestArticles: (state) => (n = 3) =>
      [...state.articles]
        .sort((a, b) => (a.time < b.time ? 1 : -1))
        .slice(0, n),
    // 分类数量统计：返回 { 分类名: 数量 } 对象，便于展示
    categoryStats: (state) => {
      const stats = {}
      state.articles.forEach((a) => {
        stats[a.category] = (stats[a.category] || 0) + 1
      })
      return stats
    }
  },

  // ---------- actions：增删改查 ----------
  actions: {
    /** 内部方法：把文章列表写入 localStorage */
    saveArticles() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.articles))
    },

    /**
     * 新增文章
     * @param {object} data 文章表单数据（title/category/summary/content/tags/time）
     * @returns {object} 新创建的文章对象
     */
    addArticle(data) {
      // 生成新 id：取当前最大 id + 1
      const maxId = this.articles.reduce((max, a) => Math.max(max, a.id), 0)
      const article = {
        id: maxId + 1,
        title: String(data.title || '').trim(),
        category: data.category || '技术笔记',
        summary: String(data.summary || '').trim(),
        content: String(data.content || '').trim(),
        tags: Array.isArray(data.tags)
          ? data.tags
          : String(data.tags || '').split(/[,，\s]+/).filter(Boolean),
        time: data.time || new Date().toISOString().slice(0, 10)
      }
      this.articles.push(article)
      // 修改后立即持久化
      this.saveArticles()
      return article
    },

    /**
     * 更新文章
     * @param {number|string} id   文章 id
     * @param {object} data  需要更新的字段（局部字段即可，其余保留）
     * @returns {object|null} 更新后的文章；找不到返回 null
     */
    updateArticle(id, data) {
      const index = this.articles.findIndex((a) => a.id === Number(id))
      if (index === -1) return null
      // 合并：保留原有字段，覆盖传入字段
      const old = this.articles[index]
      this.articles[index] = {
        ...old,
        ...data,
        id: old.id,
        title: data.title !== undefined ? String(data.title).trim() : old.title,
        tags: Array.isArray(data.tags)
          ? data.tags
          : typeof data.tags === 'string'
            ? data.tags.split(/[,，\s]+/).filter(Boolean)
            : old.tags
      }
      // 修改后立即持久化
      this.saveArticles()
      return this.articles[index]
    },

    /**
     * 删除文章
     * @param {number|string} id 文章 id
     * @returns {boolean} 是否删除成功
     */
    deleteArticle(id) {
      const index = this.articles.findIndex((a) => a.id === Number(id))
      if (index === -1) return false
      this.articles.splice(index, 1)
      // 删除后立即持久化
      this.saveArticles()
      return true
    }
  }
})
