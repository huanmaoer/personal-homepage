<script setup>
/* ============ 顶部导航组件 PageHeader ============
   实验三：使用 RouterLink 实现导航跳转和高亮
   第二次实验：使用 Element Plus 的 el-menu 菜单组件实现顶部导航
   - el-menu 的 :router="true" 属性开启路由模式，index 即路径
   - default-active 根据当前路由高亮菜单项 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps({
  title: { type: String, default: '' },
  theme: { type: String, default: 'light' }
})

const emit = defineEmits(['toggle-theme'])

const route = useRoute()

// 导航菜单数据：index 为路由路径，el-menu 路由模式下据此跳转
const navItems = [
  { label: '首页', path: '/home' },
  { label: '项目', path: '/projects/list' },
  { label: '文章', path: '/articles/list' },
  { label: '关于', path: '/about' },
  { label: '后台管理', path: '/admin' }
]

// 当前激活的菜单项：根据当前路径匹配（项目/文章父路由下子路由也高亮父项）
const activeIndex = computed(() => {
  const path = route.path
  if (path.startsWith('/projects')) return '/projects/list'
  if (path.startsWith('/articles')) return '/articles/list'
  if (path.startsWith('/admin')) return '/admin'
  return path
})
</script>

<template>
  <header class="page-header">
    <div class="header-inner">
      <!-- 品牌名称：点击返回首页 -->
      <RouterLink to="/home" class="brand-link">
        <h1 class="brand">{{ title }}</h1>
      </RouterLink>

      <!-- Element Plus 菜单组件：开启路由模式 -->
      <el-menu
        class="nav-menu"
        mode="horizontal"
        :default-active="activeIndex"
        router
        :ellipsis="false"
        :style="{ borderBottom: 'none', backgroundColor: 'transparent', flex: 1 }"
      >
        <el-menu-item v-for="item in navItems" :key="item.path" :index="item.path">
          {{ item.label }}
        </el-menu-item>
      </el-menu>

      <!-- 主题切换按钮（Element Plus 按钮组件） -->
      <el-button
        :type="theme === 'light' ? 'default' : 'warning'"
        size="small"
        @click="emit('toggle-theme')"
      >
        {{ theme === 'light' ? '切换暗色' : '切换亮色' }}
      </el-button>
    </div>
  </header>
</template>

<style scoped>
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.3s, border-color 0.3s;
}

.header-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 16px;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.brand-link {
  text-decoration: none;
  color: var(--text-color);
  flex-shrink: 0;
}

.brand {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.nav-menu {
  --el-menu-text-color: var(--text-color);
  --el-menu-active-color: #3b82f6;
}

/* el-menu-item 去掉默认 padding 上下间距，使垂直居中 */
.nav-menu :deep(.el-menu-item) {
  border-bottom: 2px solid transparent !important;
  height: 62px;
  line-height: 62px;
}
</style>
