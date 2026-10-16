<script setup>
/* ============ 可复用区块标题组件 SectionHeader ============
   props：title（标题文本）、subtitle（副标题）—— 展示数据由父组件传入
   具名插槽：#extra（标题右侧额外区域，如统计徽章、链接按钮）—— 模板内容由父组件决定
   （"数据用 props、模板内容用插槽"：文本是数据走 props；右侧装饰是结构走插槽） */
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})
</script>

<template>
  <div class="section-header">
    <div class="header-text">
      <h2 class="header-title">{{ title }}</h2>
      <p v-if="subtitle" class="header-subtitle">{{ subtitle }}</p>
    </div>
    <div class="header-extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped>
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.header-subtitle {
  margin-top: 4px;
  font-size: 14px;
  opacity: 0.65;
}

.header-extra {
  flex-shrink: 0;
}
</style>
