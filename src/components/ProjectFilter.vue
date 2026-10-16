<script setup>
/* ============ 项目筛选组件 ProjectFilter ============
   props：options（筛选选项数组）—— 选项数据由父组件传入
   defineModel：当前选中项与父组件双向同步（v-model），无需手动 emit */
defineProps({
  options: { type: Array, default: () => [] }
})

const active = defineModel({ default: '全部' })
</script>

<template>
  <div class="filter-bar">
    <button
      v-for="opt in options"
      :key="opt"
      class="filter-btn"
      :class="{ active: active === opt }"
      @click="active = opt"
    >
      {{ opt }}
    </button>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.filter-btn {
  padding: 6px 16px;
  border-radius: 18px;
  border: 1px solid var(--border-color);
  background-color: var(--box-bg);
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

.filter-btn:hover {
  border-color: #3b82f6;
}

.filter-btn.active {
  background-color: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}
</style>
