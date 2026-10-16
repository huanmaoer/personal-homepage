<script setup>
import { reactive, watch } from 'vue'

/* ============ 编辑弹窗组件 EditModal ============
   defineModel('visible')：弹窗显隐与父组件双向同步（v-model:visible）
   props：userInfo（当前个人信息）—— 父组件单向传入，作为表单初始值
   emits：save（保存）—— 把弹窗内部表单数据上交给父组件统一更新（单向数据流） */
const props = defineProps({
  userInfo: { type: Object, required: true }
})

const emit = defineEmits(['save'])

const visible = defineModel('visible', { default: false })

// 弹窗内部维护的表单副本：编辑过程不影响父组件数据，保存时才上报
const editForm = reactive({
  name: '',
  xh: '',
  majorClass: '',
  email: '',
  intro: ''
})

// 每次打开弹窗时，把父组件传入的数据复制到内部表单
watch(visible, (val) => {
  if (val) {
    Object.assign(editForm, props.userInfo)
  }
})

const save = () => {
  emit('save', { ...editForm })
  visible.value = false
}

const cancel = () => {
  visible.value = false
}
</script>

<template>
  <!-- Teleport：把弹窗渲染到 body 下，避免被祖先样式/布局影响 -->
  <Teleport to="body">
    <div v-if="visible" class="modal-mask" @click.self="cancel">
      <div class="modal-box">
        <h3>编辑个人信息</h3>

        <div class="form-row">
          <label>姓名</label>
          <input v-model="editForm.name" />
        </div>
        <div class="form-row">
          <label>学号</label>
          <input v-model="editForm.xh" />
        </div>
        <div class="form-row">
          <label>专业班级</label>
          <input v-model="editForm.majorClass" />
        </div>
        <div class="form-row">
          <label>邮箱</label>
          <input v-model="editForm.email" />
        </div>
        <div class="form-row">
          <label>个人简介</label>
          <textarea rows="3" v-model="editForm.intro"></textarea>
        </div>

        <div class="modal-footer">
          <button class="btn btn-default" @click="cancel">取消</button>
          <button class="btn btn-primary" @click="save">保存修改</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  width: 400px;
  max-width: calc(100vw - 40px);
  padding: 22px;
  border-radius: 8px;
  background-color: var(--modal-bg);
  color: var(--text-color);
  box-shadow: var(--shadow);
  transition: background-color 0.3s, color 0.3s;
}

.modal-box h3 {
  text-align: center;
  margin-bottom: 18px;
}

.form-row {
  margin-bottom: 14px;
}

.form-row label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
}

.form-row input,
.form-row textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 5px;
  border: 1px solid var(--border-color);
  background-color: var(--input-bg);
  color: var(--text-color);
  outline: none;
}

.form-row input:focus,
.form-row textarea:focus {
  border-color: #3b82f6;
}

.modal-footer {
  text-align: right;
  margin-top: 10px;
}
</style>
