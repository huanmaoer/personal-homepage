<script setup>
/* ============ 可复用状态徽章组件 StatusBadge ============
   props：status（状态文本，如"已完成 / 开发中 / 规划中"）—— 展示数据由父组件传入
   内部根据状态文本映射颜色样式；也可通过默认插槽覆盖徽章文字 */
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, default: '' }
})

// 状态文本 → 样式类型映射（未匹配时使用默认样式）
const typeMap = {
  已完成: 'success',
  开发中: 'warning',
  规划中: 'info'
}

const badgeClass = computed(() => typeMap[props.status] || 'default')
</script>

<template>
  <span class="status-badge" :class="`is-${badgeClass}`">
    <slot>{{ status }}</slot>
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  white-space: nowrap;
}

.is-success {
  background-color: #dcfce7;
  color: #166534;
}

.is-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.is-info {
  background-color: #dbeafe;
  color: #1e40af;
}

.is-default {
  background-color: var(--box-bg);
  color: var(--text-color);
}

/* 暗色主题下的徽章配色 */
:root.dark .is-success {
  background-color: #14532d;
  color: #bbf7d0;
}

:root.dark .is-warning {
  background-color: #78350f;
  color: #fde68a;
}

:root.dark .is-info {
  background-color: #1e3a8a;
  color: #bfdbfe;
}
</style>
