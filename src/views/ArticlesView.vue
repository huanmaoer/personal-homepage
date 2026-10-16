<script setup>
/* ============ 文章页父路由 ArticlesView ============
   嵌套路由父组件：提供文章中心布局标题和子路由出口 <RouterView>
   第二次实验：使用 el-page-header 页头组件 */
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.push('/home')
</script>

<template>
  <div class="articles-view">
    <el-page-header content="文章中心" @back="goBack">
      <template #content>
        <span style="font-size: 18px; font-weight: 600; margin-left: 12px">文章中心</span>
      </template>
      <template #extra>
        <el-tag effect="plain">技术笔记与学习心得分享</el-tag>
      </template>
    </el-page-header>

    <el-divider />

    <!-- 嵌套路由出口 -->
    <RouterView />
  </div>
</template>

<style scoped>
.articles-view {
  width: 100%;
}
</style>
