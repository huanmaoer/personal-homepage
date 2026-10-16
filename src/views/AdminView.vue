<script setup>
/* ============ 后台管理父路由 AdminView ============
   嵌套路由父组件：对应路由 /admin
   提供后台管理布局和侧边导航，子路由出口渲染在右侧
   meta.requiresAuth = true，未登录时由 beforeEach 守卫拦截
   实验四改造：退出登录改用用户 Store 的 logout action
   第二次实验：使用 el-container + el-aside + el-menu 重构后台布局 */
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user.js'
import { ElMessageBox } from 'element-plus'

const router = useRouter()

// 获取用户 Store，并用 storeToRefs 解构登录状态 getter
const userStore = useUserStore()
const { loginText } = storeToRefs(userStore)

// 后台侧边菜单项
const adminMenuItems = [
  { label: '个人简介编辑', path: '/admin/profile' },
  { label: '项目信息管理', path: '/admin/projects' },
  { label: '文章信息管理', path: '/admin/articles' }
]

// 退出登录：弹确认框后调用用户 Store 的 logout action（同步持久化）
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定退出',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      userStore.logout()
      console.log('已退出登录，登录状态已写入 localStorage')
      // replace 到首页，不留后台历史记录
      router.replace({ name: 'Home' })
    })
    .catch(() => {})
}
</script>

<template>
  <!-- Element Plus 后台布局：横向容器 -->
  <el-container class="admin-view">
    <!-- 左侧管理侧边栏 -->
    <el-aside width="200px" class="admin-sidebar">
      <h3 class="sidebar-title">后台管理</h3>
      <!-- 当前登录状态（用户 Store 的 getter） -->
      <p class="login-state">{{ loginText }}</p>

      <!-- el-menu 侧边菜单：路由模式 -->
      <el-menu
        default-active="/admin/profile"
        router
        :ellipsis="false"
        class="sidebar-menu"
      >
        <el-menu-item v-for="item in adminMenuItems" :key="item.path" :index="item.path">
          <el-icon v-if="item.path === '/admin/profile'"><User /></el-icon>
          <el-icon v-else-if="item.path === '/admin/projects'"><Folder /></el-icon>
          <el-icon v-else><Document /></el-icon>
          <span style="margin-left: 6px">{{ item.label }}</span>
        </el-menu-item>
      </el-menu>

      <el-button class="logout-btn" type="danger" plain size="small" @click="handleLogout">
        退出登录
      </el-button>
    </el-aside>

    <!-- 右侧内容区：嵌套路由出口 -->
    <el-main class="admin-content">
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>
.admin-view {
  gap: 20px;
  align-items: flex-start;
  background: transparent;
}

.admin-sidebar {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 20px 12px;
  box-shadow: var(--shadow);
}

.sidebar-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.login-state {
  font-size: 12px;
  opacity: 0.6;
  margin: 0 0 12px;
}

.sidebar-menu {
  border-right: none;
  margin-bottom: 16px;
}

.logout-btn {
  width: 100%;
}

.admin-content {
  flex: 1;
  min-width: 0;
  padding: 0;
  background: transparent;
}

/* 移动端适配：侧边栏变横向 */
@media (max-width: 640px) {
  .admin-view {
    flex-direction: column;
  }
  .admin-sidebar {
    width: 100% !important;
  }
  .sidebar-menu :deep(.el-menu) {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
