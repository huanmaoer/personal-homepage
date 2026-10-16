<script setup>
import { ref } from 'vue'

/* ============ 个人信息组件 UserProfile ============
   props：userInfo（个人信息对象）—— 父组件单向传入，子组件只读不修改（单向数据流）
   emits：edit（点击"编辑个人信息"按钮）—— 上报父组件打开编辑弹窗
   内部状态：isShowDetail —— 只影响当前组件，无需与父组件共享，保留在组件内部 */
const props = defineProps({
  userInfo: { type: Object, required: true }
})

const emit = defineEmits(['edit'])

const isShowDetail = ref(false)
</script>

<template>
  <section class="card profile">
    <div class="avatar-wrap">
      <img :src="userInfo.avatar" alt="头像" class="avatar" />
    </div>

    <h2 class="card-title">个人信息</h2>

    <div class="info-item">姓名：{{ userInfo.name }}</div>
    <div class="info-item">学号：{{ userInfo.xh }}</div>
    <div class="info-item">专业班级：{{ userInfo.majorClass }}</div>

    <button class="btn btn-primary" @click="isShowDetail = !isShowDetail">
      {{ isShowDetail ? '收起详情' : '展开详情' }}
    </button>

    <div v-if="isShowDetail" class="detail-box">
      <div class="info-item">个人简介：{{ userInfo.intro }}</div>
      <div class="info-item">邮箱：{{ userInfo.email }}</div>
    </div>

    <div class="profile-actions">
      <button class="btn btn-edit" @click="emit('edit')">编辑个人信息</button>
    </div>
  </section>
</template>

<style scoped>
.profile {
  text-align: left;
}

.avatar-wrap {
  text-align: center;
  margin-bottom: 12px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-color);
}

.profile-actions {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border-color);
  text-align: right;
}
</style>
