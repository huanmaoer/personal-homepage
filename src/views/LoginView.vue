<script setup>
/* ============ 登录视图 LoginView ============
   路由组件：对应路由 /login
   实验四：登录状态改用用户 Store 的 login action（并持久化到 localStorage）
   第二次实验：使用 el-form / el-form-item / el-input / el-button 重构登录表单 */
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 获取用户 Store
const userStore = useUserStore()

// 登录表单与校验规则
const form = reactive({ username: '', password: '' })
const formRef = ref(null)

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 登录提交：调用用户 Store 的 login action 完成认证
const handleLogin = async () => {
  // 先执行 Element Plus 表单校验
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  // 模拟认证：任意非空账号密码均可登录
  const ok = userStore.login(form.username, form.password)
  if (!ok) {
    ElMessage.error('登录失败，请重试')
    return
  }
  ElMessage.success(`登录成功，欢迎 ${form.username}`)
  console.log('登录成功：', form.username, '→ 已写入用户 Store 并持久化')

  // 登录成功后跳回原目标页面
  const redirect = route.query.redirect || '/admin'
  router.replace(redirect)
}
</script>

<template>
  <div class="login-view">
    <el-card shadow="hover" class="login-card">
      <template #header>
        <div class="login-head">
          <h2 class="login-title">管理员登录</h2>
          <p class="login-subtitle">请登录后访问后台管理页面</p>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @keyup.enter="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-button type="primary" class="login-btn" @click="handleLogin">
          登 录
        </el-button>
      </el-form>

      <p class="login-tip">演示账号：任意输入用户名和密码即可登录</p>
    </el-card>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.login-card {
  width: 400px;
  max-width: 100%;
}

.login-head {
  text-align: center;
}

.login-title {
  font-size: 22px;
  margin: 0 0 6px;
}

.login-subtitle {
  font-size: 14px;
  opacity: 0.6;
  margin: 0;
}

.login-btn {
  width: 100%;
}

.login-tip {
  text-align: center;
  font-size: 13px;
  opacity: 0.5;
  margin: 12px 0 0;
}
</style>
