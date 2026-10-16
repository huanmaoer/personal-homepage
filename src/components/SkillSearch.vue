<script setup>
/* ============ 技能搜索组件 SkillSearch ============
   defineModel('keyword')：与父组件（经 SkillSection 中转）实现 v-model 双向同步，
   父组件改 searchKey 这里同步显示，这里输入也会直接更新父组件状态 */
const keyword = defineModel('keyword', { default: '' })
</script>

<template>
  <div class="search-row">
    <input
      v-model="keyword"
      class="search-input"
      type="text"
      placeholder="输入关键词搜索技能"
    />
    <button v-if="keyword" class="btn btn-clear" @click="keyword = ''">清空</button>
  </div>
</template>

<style scoped>
.search-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.search-row .search-input {
  flex: 1;
}
.search-row .btn {
  margin: 0;
  white-space: nowrap;
}
</style>
