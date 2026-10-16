<script setup>
/* ============ 个人简介编辑视图 ProfileEditView ============
   后台管理嵌套子路由：对应路由 /admin/profile
   实验四：编辑个人信息改用用户 Store 的 updateUserInfo action（自动持久化）
   第二次实验：使用 el-form / el-form-item / el-input / el-button 重构 */
import { reactive, ref } from 'vue'
import { useUserStore } from '../../stores/user.js'
import { ElMessage } from 'element-plus'

// 获取用户 Store
const userStore = useUserStore()

// 编辑表单：初始值来自 Store 中的 userInfo
const form = reactive({ ...userStore.userInfo })
const formRef = ref(null)

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  xh: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

// 保存修改：调用用户 Store 的 updateUserInfo action
const handleSave = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  userStore.updateUserInfo(form)
  ElMessage.success('个人信息已保存并持久化！')
  console.log('个人信息已更新并持久化：', { ...userStore.userInfo })
}

// 重置修改：从 Store 重新读取最新数据
const handleReset = () => {
  Object.assign(form, userStore.userInfo)
  ElMessage.info('已重置为最新数据')
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <span style="font-size: 16px; font-weight: 600">编辑个人简介</span>
    </template>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      style="max-width: 600px"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>

      <el-form-item label="学号" prop="xh">
        <el-input v-model="form.xh" placeholder="请输入学号" />
      </el-form-item>

      <el-form-item label="专业班级">
        <el-input v-model="form.majorClass" placeholder="请输入专业班级" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>

      <el-form-item label="个人简介">
        <el-input
          v-model="form.intro"
          type="textarea"
          :rows="4"
          placeholder="介绍一下自己吧"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleSave">保存修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
