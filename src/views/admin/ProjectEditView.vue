<script setup>
/* ============ 项目信息编辑视图 ProjectEditView ============
   后台管理嵌套子路由：对应路由 /admin/projects
   实验四：结合项目 Store 实现项目信息的增删改查（CRUD）
   第二次实验：
   - el-table 表格展示项目列表
   - el-dialog 对话框承载新增/编辑表单
   - el-form / el-input / el-select 表单组件
   - ElMessageBox.confirm 删除确认
   - ElMessage 操作反馈 */
import { ref, reactive, computed } from 'vue'
import { useProjectStore } from '../../stores/project.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// 获取项目 Store 实例
const projectStore = useProjectStore()

// el-table 列定义
const columns = [
  { prop: 'id', label: 'ID', width: 70 },
  { prop: 'title', label: '项目名称', minWidth: 180 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'time', label: '时间', width: 100 }
]

// 对话框显隐与当前编辑 id
const dialogVisible = ref(false)
const editingId = ref(null)
const dialogTitle = computed(() => (editingId.value !== null ? '编辑项目' : '新增项目'))

// 表单与校验
const formRef = ref(null)
const form = reactive({
  title: '',
  status: '规划中',
  tags: '',
  desc: '',
  time: '2026-10'
})

const rules = {
  title: [{ required: true, message: '请输入项目名称', trigger: 'blur' }]
}

// 状态对应标签类型
const statusTagType = (status) => {
  if (status === '已完成') return 'success'
  if (status === '开发中') return 'primary'
  return 'warning'
}

/** 重置表单 */
function resetForm() {
  editingId.value = null
  Object.assign(form, {
    title: '',
    status: '规划中',
    tags: '',
    desc: '',
    time: '2026-10'
  })
}

/** 打开新增对话框 */
function handleAddClick() {
  resetForm()
  dialogVisible.value = true
}

/** 打开编辑对话框 */
function handleEdit(project) {
  editingId.value = project.id
  Object.assign(form, {
    title: project.title,
    status: project.status,
    tags: project.tags.join(', '),
    desc: project.desc,
    time: project.time
  })
  dialogVisible.value = true
}

/** 保存：根据 editingId 判断新增还是更新 */
async function handleSave() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  const data = { ...form }
  if (editingId.value !== null) {
    projectStore.updateProject(editingId.value, data)
    ElMessage.success('项目更新成功！')
  } else {
    projectStore.addProject(data)
    ElMessage.success('项目添加成功！')
  }
  dialogVisible.value = false
}

/** 删除项目：弹确认框 */
function handleDelete(project) {
  ElMessageBox.confirm(
    `确定要删除项目「${project.title}」吗？删除后不可恢复。`,
    '删除确认',
    { confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'warning' }
  )
    .then(() => {
      const ok = projectStore.deleteProject(project.id)
      if (ok) ElMessage.success(`已删除项目：${project.title}`)
    })
    .catch(() => {})
}
</script>

<template>
  <div class="project-edit-view">
    <el-card shadow="never">
      <template #header>
        <div class="edit-head">
          <span style="font-size: 16px; font-weight: 600">项目信息管理</span>
          <el-button type="primary" @click="handleAddClick">
            <el-icon style="margin-right: 4px"><Plus /></el-icon>
            新增项目
          </el-button>
        </div>
      </template>

      <!-- el-table 项目列表 -->
      <el-table :data="projectStore.projects" stripe border style="width: 100%">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="title" label="项目名称" min-width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" width="100" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="projectStore.projects.length === 0" description="暂无项目" />
    </el-card>

    <!-- el-dialog 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px" destroy-on-close>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item label="项目名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入项目名称" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="已完成" value="已完成" />
            <el-option label="开发中" value="开发中" />
            <el-option label="规划中" value="规划中" />
          </el-select>
        </el-form-item>

        <el-form-item label="技术标签">
          <el-input v-model="form.tags" placeholder="如：Vue3, JavaScript（逗号分隔）" />
        </el-form-item>

        <el-form-item label="项目描述">
          <el-input
            v-model="form.desc"
            type="textarea"
            :rows="2"
            placeholder="简要描述项目内容"
          />
        </el-form-item>

        <el-form-item label="时间">
          <el-input v-model="form.time" placeholder="如：2026-10" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.edit-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
