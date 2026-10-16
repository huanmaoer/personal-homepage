<script setup>
/* ============ 可复用项目卡片组件 ProjectCard ============
   props：project（项目对象）、index（序号）—— 数据由父组件（经 ProjectList 作用域插槽）传入
   插槽设计（合理选择 props 与插槽）：
     - 默认插槽：卡片主体内容，未传入时默认展示简介 + 技术标签
     - 具名插槽 #title：卡片标题区，未传入时默认展示项目标题
     - 具名插槽 #actions：卡片底部操作区，未传入时默认展示"查看详情"按钮
   emits：view（点击默认"查看详情"按钮时上报父组件） */
import StatusBadge from './StatusBadge.vue'

defineProps({
  project: { type: Object, required: true },
  index: { type: Number, default: 0 }
})

const emit = defineEmits(['view'])
</script>

<template>
  <article class="project-card">
    <!-- 标题区：默认标题 + 状态徽章；父组件可通过 #title 具名插槽定制 -->
    <div class="card-head">
      <slot name="title">
        <h3 class="project-title">{{ project.title }}</h3>
      </slot>
      <StatusBadge :status="project.status" />
    </div>

    <!-- 主体区：默认简介 + 标签；父组件可通过默认插槽整体定制 -->
    <div class="card-body">
      <slot>
        <p class="card-desc">{{ project.desc }}</p>
        <div class="card-tags">
          <span v-for="tag in project.tags" :key="tag" class="skill-tag">{{ tag }}</span>
        </div>
      </slot>
    </div>

    <!-- 操作区：默认"查看详情"；父组件可通过 #actions 具名插槽定制 -->
    <div class="card-actions">
      <slot name="actions">
        <button class="btn btn-primary" @click="emit('view', project)">查看详情</button>
      </slot>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px 22px;
  box-shadow: var(--shadow);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.3s;
}

.project-card:hover {
  transform: translateY(-3px);
  border-color: #3b82f6;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.project-title {
  font-size: 17px;
  font-weight: 700;
  margin: 0;
}

.card-body {
  flex: 1;
}

.card-desc {
  font-size: 14px;
  line-height: 1.7;
  opacity: 0.85;
  margin: 0;
}

.card-tags {
  margin-top: 10px;
}

.card-actions {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.card-actions .btn {
  margin: 0;
}
</style>
