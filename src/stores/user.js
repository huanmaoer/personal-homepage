/* ============ 用户 Store（stores/user.js） ============
   Pinia 定义用户 Store：管理个人信息、技能列表与登录状态
   持久化方案（实验要求）：
     - state 初始化时通过 JSON.parse 从 localStorage 读取已保存的值作为默认值
     - actions 修改 state 后通过 JSON.stringify 同步写入 localStorage
   ============================================================ */
import { defineStore } from 'pinia'

// localStorage 存储键名（区分不同数据，避免互相覆盖）
const STORAGE_KEY_USER = 'user-info'
const STORAGE_KEY_LOGIN = 'user-login'
const STORAGE_KEY_USERNAME = 'user-username'

/**
 * 从 localStorage 安全读取 JSON 数据
 * @param {string} key  存储键名
 * @param {*} fallback  读取失败或不存在时返回的默认值
 */
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    // 有保存值则 JSON.parse 恢复，否则返回默认值
    return raw ? JSON.parse(raw) : fallback
  } catch (err) {
    // 解析失败（如数据损坏）时回退默认值，避免页面崩溃
    console.warn(`读取 localStorage[${key}] 失败，已使用默认值`, err)
    return fallback
  }
}

// 个人信息默认值（首次访问时作为 state 初始值）
const defaultUserInfo = {
  name: '蒋静怡',
  xh: '249980712',
  majorClass: '24计科2班',
  intro: '热爱前端开发，喜欢学习Vue框架，爱好编程、阅读、跑步。',
  email: 'zhangsan@example.com',
  avatar: 'https://picsum.photos/id/64/100/100'
}

// 默认技能列表
const defaultSkills = ['Vue3', 'JavaScript', 'HTML', 'CSS', 'Python', '数据库', 'PS', 'Git']

// 定义并导出用户 Store（id 为 'user'，DevTools 中以此命名）
export const useUserStore = defineStore('user', {
  // ---------- state：存储响应式数据（相当于组件 data） ----------
  state: () => ({
    // 个人信息：初始化时从 localStorage 恢复
    userInfo: loadFromStorage(STORAGE_KEY_USER, defaultUserInfo),
    // 技能列表：同上，从 localStorage 恢复
    skills: loadFromStorage(STORAGE_KEY_USER + '-skills', defaultSkills),
    // 登录状态：默认 false，刷新后从 localStorage 恢复
    isLoggedIn: loadFromStorage(STORAGE_KEY_LOGIN, false),
    // 最近一次登录的用户名：随登录状态一起持久化
    username: loadFromStorage(STORAGE_KEY_USERNAME, '')
  }),

  // ---------- getters：基于 state 派生计算值（相当于组件 computed，具有缓存） ----------
  getters: {
    // 派生姓名：便于模板直接使用，修改 userInfo 后自动更新
    displayName: (state) => state.userInfo.name,
    // 派生邮箱
    email: (state) => state.userInfo.email,
    // 派生个人简介长度：演示 getter 的缓存计算场景
    introLength: (state) => state.userInfo.intro.length,
    // 派生登录状态文本：用于页面展示"已登录/未登录"
    loginText: (state) => (state.isLoggedIn ? `已登录（${state.username || '管理员'}）` : '未登录')
  },

  // ---------- actions：修改 state 的方法（改变状态的唯一推荐入口，支持同步/异步） ----------
  actions: {
    /**
     * 登录（模拟认证：任意非空账号密码均可登录）
     * @param {string} username 用户名
     * @param {string} password 密码
     * @returns {boolean} 是否登录成功
     */
    login(username, password) {
      // 校验非空，失败返回 false 由页面提示
      if (!username || !password) return false
      // 修改 state：登录成功
      this.isLoggedIn = true
      this.username = username
      // 持久化登录状态与用户名到 localStorage
      this.saveLoginState()
      return true
    },

    /** 退出登录：修改 state 并持久化 */
    logout() {
      this.isLoggedIn = false
      this.username = ''
      this.saveLoginState()
    },

    /**
     * 更新个人信息（浅合并）
     * @param {object} patch 需要更新的字段对象
     */
    updateUserInfo(patch) {
      // Object.assign 把传入字段合并进 userInfo
      Object.assign(this.userInfo, patch)
      // 持久化
      this.saveUserInfo()
    },

    /** 更新技能列表 */
    updateSkills(newSkills) {
      this.skills = [...newSkills]
      localStorage.setItem(STORAGE_KEY_USER + '-skills', JSON.stringify(this.skills))
    },

    // ---------- 内部持久化方法（actions 修改后同步写入 localStorage） ----------
    /** 把登录状态与用户名写入 localStorage */
    saveLoginState() {
      localStorage.setItem(STORAGE_KEY_LOGIN, JSON.stringify(this.isLoggedIn))
      localStorage.setItem(STORAGE_KEY_USERNAME, JSON.stringify(this.username))
    },

    /** 把个人信息写入 localStorage */
    saveUserInfo() {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.userInfo))
    }
  }
})
