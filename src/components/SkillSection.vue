<script setup>
import SkillSearch from './SkillSearch.vue'
import SkillList from './SkillList.vue'

/* ============ 技能区域容器组件 SkillSection ============
   props：skills（过滤后的技能列表）—— 父组件单向传入
   defineModel('keyword')：中转搜索关键词，实现父组件 → 本组件 → SkillSearch 的双向同步
   emits：select（技能标签点击）—— 由 SkillList 上报后继续转发给父组件 */
defineProps({
  skills: { type: Array, default: () => [] }
})

const keyword = defineModel('keyword', { default: '' })

const emit = defineEmits(['select'])
</script>

<template>
  <section class="card skills">
    <h2 class="card-title">技能兴趣搜索</h2>

    <!-- 搜索框：v-model:keyword 双向绑定 -->
    <SkillSearch v-model:keyword="keyword" />

    <h3 class="sub-title">技能列表</h3>

    <!-- 技能标签列表：props 传入数据，点击事件转发给父组件 -->
    <SkillList :skills="skills" @select="emit('select', $event)" />
  </section>
</template>
