<script setup>
/* ============ 底部组件 PageFooter ============
   props：copyright（版权文案）—— 父组件单向传入
   emits：back-to-top（点击"返回顶部"按钮）—— 上报父组件执行滚动
   第二次实验：返回顶部按钮改用 Element Plus 的 el-button 组件 */
defineProps({
  copyright: { type: String, default: '' }
})

const emit = defineEmits(['back-to-top'])
</script>

<template>
  <footer class="page-footer">
    <div class="footer-inner">
      <p class="copyright">{{ copyright }}</p>
      <el-button size="small" @click="emit('back-to-top')">
        <el-icon style="margin-right: 4px"><Top /></el-icon>
        返回顶部
      </el-button>
    </div>
  </footer>
</template>

<style scoped>
.page-footer {
  border-top: 1px solid var(--border-color);
  background-color: var(--card-bg);
  transition: background-color 0.3s, border-color 0.3s;
}

.footer-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.copyright {
  font-size: 14px;
  opacity: 0.75;
  margin: 0;
}
</style>
