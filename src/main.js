/* ============ 应用入口 main.js ============
   实验四改造：
   1. 注册 Pinia 插件，使所有 Store 在全局可用
   2. 第二次实验：全局注册 Element Plus 组件库与图标
   ============================================ */
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Element Plus 组件库与样式（实验阶段使用全局注册）
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// Element Plus 中文语言包（使分页、日期等组件文案为中文）
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// Element Plus 图标库，注册为全局组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router/index.js'

// 创建 Pinia 实例并注册到应用
// 注意：必须先 use(pinia) 再 use(router)，
// 保证路由守卫内部调用 useXxxStore() 时 Pinia 已完成初始化
const pinia = createPinia()

// 创建应用实例：注册 Pinia（状态管理）、路由、Element Plus
const app = createApp(App)

// 循环注册所有 Element Plus 图标为全局组件（如 <el-icon><Edit /></el-icon>）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
// 全局注册 Element Plus，并指定中文语言包
app.use(ElementPlus, { locale: zhCn })

app.mount('#app')
