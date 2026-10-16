<script setup>
/* ============ 根组件 App.vue ============
   实验三：使用 Vue Router 实现页面导航
   实验四改造：页脚版权信息改用用户 Store（Pinia）
   第二次实验：使用 Element Plus 的 el-container 布局组件重构整体结构
   布局：el-header 顶部导航 + el-main 路由出口 + el-footer 底部版权 */
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import PageHeader from './components/PageHeader.vue'
import PageFooter from './components/PageFooter.vue'
import { useUserStore } from './stores/user.js'

// 获取用户 Store，并用 storeToRefs 解构响应式数据
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 主题状态
const theme = ref('light')

// 主题切换：把 dark 类挂到 html 根节点
const applyTheme = () => {
  document.documentElement.classList.toggle('dark', theme.value === 'dark')
}
watch(theme, applyTheme)
onMounted(applyTheme)

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// 返回顶部（底部按钮触发）
const backToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <!-- Element Plus 布局组件：整体纵向容器 -->
  <el-container class="page" direction="vertical">
    <!-- 顶部导航：品牌 + el-menu 导航 + 主题切换 -->
    <el-header class="app-header" height="64px">
      <PageHeader :title="'个人主页'" :theme="theme" @toggle-theme="toggleTheme" />
    </el-header>

    <!-- 路由出口：匹配的页面组件渲染在这里 -->
    <el-main class="app-main">
      <RouterView />
    </el-main>

    <!-- 底部版权 -->
    <el-footer class="app-footer" height="auto">
      <PageFooter
        :copyright="`© 2026 ${userInfo.name} · Pinia 状态管理实验 · Element Plus UI 重构`"
        @back-to-top="backToTop"
      />
    </el-footer>
  </el-container>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.app-header {
  padding: 0;
  height: 64px;
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
}

.app-main {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 16px;
  background-color: transparent;
}

.app-footer {
  padding: 0;
  background-color: var(--card-bg);
  border-top: 1px solid var(--border-color);
}
</style>
