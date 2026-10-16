<script setup>
/* ============ 项目列表容器组件 ProjectList ============
   props：projects（项目数组）—— 数据由父组件传入
   作用域插槽：遍历项目时把 { project, index } 显式提供给父组件模板。
   （父组件模板默认只能访问自身数据；若父组件需要使用子组件遍历得到的
     当前项目、序号，子组件必须通过作用域插槽显式提供相应数据） */
defineProps({
  projects: { type: Array, default: () => [] }
})
</script>

<template>
  <div class="projects-grid">
    <template v-for="(project, index) in projects" :key="project.id">
      <slot :project="project" :index="index" />
    </template>
    <p v-if="projects.length === 0" class="empty-tip">暂无符合条件的项目</p>
  </div>
</template>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}

.empty-tip {
  grid-column: 1 / -1;
  text-align: center;
  padding: 30px 0;
  font-size: 14px;
  opacity: 0.6;
}
</style>
