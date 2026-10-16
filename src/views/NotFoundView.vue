<script setup>
/* ============ 404 视图 NotFoundView ============
   通配符路由组件：匹配所有未定义的路径
   第二次实验：使用 el-result 组件展示 404 状态 */
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => router.replace({ name: 'Home' })
const goBack = () => router.go(-1)
</script>

<template>
  <div class="not-found-view">
    <el-result icon="404" title="404" sub-title="您访问的页面可能已被移动、删除或暂时不可用。">
      <template #extra>
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.not-found-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
</style>
