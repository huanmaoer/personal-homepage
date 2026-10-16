<script setup>
/* ============ 技能列表组件 SkillList ============
   props：skills（技能数组）—— 父组件单向传入，子组件只负责展示
   emits：select（点击某个技能标签）—— 上报父组件记录/处理选中项 */
defineProps({
  skills: { type: Array, default: () => [] }
})

const emit = defineEmits(['select'])
</script>

<template>
  <div class="skill-list">
    <span
      v-for="skill in skills"
      :key="skill"
      class="skill-tag"
      title="点击选中该技能"
      @click="emit('select', skill)"
    >
      {{ skill }}
    </span>
    <p v-if="skills.length === 0" class="empty-tip">没有匹配的技能</p>
  </div>
</template>

<style scoped>
.empty-tip {
  margin-top: 8px;
  font-size: 14px;
  color: var(--text-color);
  opacity: 0.6;
}
</style>
