/* ============ 路由配置 ============
   实验四改造：
   1. 新增文章模块路由（列表 / 详情 / 后台管理）
   2. 全局前置守卫改用 Pinia 用户 Store 判断登录状态
   （注意：必须在守卫函数内部调用 useUserStore()，
    确保 Pinia 已完成初始化） */
import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '../stores/user.js'

// 路由级组件：使用动态导入实现懒加载
const HomeView = () => import('../views/HomeView.vue')
const ProjectsView = () => import('../views/ProjectsView.vue')
const ProjectListView = () => import('../views/ProjectListView.vue')
const ProjectDetailView = () => import('../views/ProjectDetailView.vue')
const ArticlesView = () => import('../views/ArticlesView.vue')
const ArticleListView = () => import('../views/ArticleListView.vue')
const ArticleDetailView = () => import('../views/ArticleDetailView.vue')
const AboutView = () => import('../views/AboutView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')
const LoginView = () => import('../views/LoginView.vue')
const AdminView = () => import('../views/AdminView.vue')
const ProfileEditView = () => import('../views/admin/ProfileEditView.vue')
const ProjectEditView = () => import('../views/admin/ProjectEditView.vue')
const ArticleEditView = () => import('../views/admin/ArticleEditView.vue')

// 路由表
const routes = [
  // 根路径重定向到首页
  {
    path: '/',
    redirect: '/home'
  },
  // 首页
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { title: '首页' }
  },
  // 项目页（父路由：嵌套路由布局）
  {
    path: '/projects',
    name: 'Projects',
    component: ProjectsView,
    redirect: '/projects/list',
    meta: { title: '项目展示' },
    children: [
      // 项目列表（嵌套子路由）
      {
        path: 'list',
        name: 'ProjectList',
        component: ProjectListView,
        meta: { title: '项目列表' }
      },
      // 项目详情（动态路由参数 :id）
      {
        path: 'detail/:id(\\d+)',
        name: 'ProjectDetail',
        component: ProjectDetailView,
        meta: { title: '项目详情' }
      }
    ]
  },
  // 文章页（父路由：嵌套路由布局，实验四新增）
  {
    path: '/articles',
    name: 'Articles',
    component: ArticlesView,
    redirect: '/articles/list',
    meta: { title: '文章中心' },
    children: [
      // 文章列表（嵌套子路由）
      {
        path: 'list',
        name: 'ArticleList',
        component: ArticleListView,
        meta: { title: '文章列表' }
      },
      // 文章详情（动态路由参数 :id）
      {
        path: 'detail/:id(\\d+)',
        name: 'ArticleDetail',
        component: ArticleDetailView,
        meta: { title: '文章详情' }
      }
    ]
  },
  // 关于页
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { title: '关于我' }
  },
  // 登录页
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: '登录' }
  },
  // 后台管理（需要登录权限）
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    redirect: '/admin/profile',
    meta: { requiresAuth: true, title: '后台管理' },
    children: [
      {
        path: 'profile',
        name: 'AdminProfile',
        component: ProfileEditView,
        meta: { requiresAuth: true, title: '编辑个人简介' }
      },
      {
        path: 'projects',
        name: 'AdminProjects',
        component: ProjectEditView,
        meta: { requiresAuth: true, title: '编辑项目信息' }
      },
      // 文章信息管理（实验四新增，同样需要登录）
      {
        path: 'articles',
        name: 'AdminArticles',
        component: ArticleEditView,
        meta: { requiresAuth: true, title: '编辑文章信息' }
      }
    ]
  },
  // 404 通配符路由（必须放在最后）
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: { title: '页面不存在' }
  }
]

// 创建路由实例
// 使用 Hash 模式（createWebHashHistory）便于本地直接打开文件预览
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 切换路由时滚动到顶部
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫：更新页面标题 + 登录校验
// 实验四改造：在守卫函数内部调用 useUserStore() 读取登录状态
router.beforeEach((to, from, next) => {
  // 根据 meta.title 更新浏览器标签页标题
  document.title = to.meta.title ? `${to.meta.title} - 个人主页` : '个人主页'

  // 在守卫内部获取用户 Store（模块顶层调用会报"未初始化"错误）
  const userStore = useUserStore()

  // 路由守卫：检查是否需要登录权限
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // 未登录 → 重定向到登录页，并记录目标路径（登录成功后跳回）
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
