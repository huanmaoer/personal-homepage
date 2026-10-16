<script setup>
/* ============ 文章信息编辑视图 ArticleEditView ============
   后台管理嵌套子路由：对应路由 /admin/articles
   结合文章 Store 实现文章信息的增删改查（CRUD）
   第二次实验：el-table + el-dialog + el-form + ElMessageBox + ElMessage */
import { ref, reactive, computed } from 'vue'
import { useArticleStore } from '../../stores/article.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// 获取文章 Store 实例
const articleStore = useArticleStore()

// 对话框显隐与当前编辑 id
const dialogVisible = ref(false)
const editingId = ref(null)
const dialogTitle = computed(() => (editingId.value !== null ? '编辑文章' : '新增文章'))

// 表单与校验
const formRef = ref(null)
const form = reactive({
  title: '',
  category: '技术笔记',
  summary: '',
  content: '',
  tags: '',
  time: '2026-10-16'
})

const rules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章正文', trigger: 'blur' }]
}

// 分类对应标签类型
const categoryTagType = (cat) => {
  if (cat === '技术笔记') return 'primary'
  if (cat === '学习心得') return 'success'
  return 'warning'
}

/** 重置表单 */
function resetForm() {
  editingId.value = null
  Object.assign(form, {
    title: '',
    category: '技术笔记',
    summary: '',
    content: '',
    tags: '',
    time: '2026-10-16'
  })
}

/** 打开新增对话框 */
function handleAddClick() {
  resetForm()
  dialogVisible.value = true
}

/** 打开编辑对话框 */
function handleEdit(article) {
  editingId.value = article.id
  Object.assign(form, {
    title: article.title,
    category: article.category,
    summary: article.summary,
    content: article.content,
    tags: article.tags.join(', '),
    time: article.time
  })
  dialogVisible.value = true
}

/** 保存 */
async function handleSave() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  const data = { ...form }
  if (editingId.value !== null) {
    articleStore.updateArticle(editingId.value, data)
    ElMessage.success('文章更新成功！')
  } else {
    articleStore.addArticle(data)
    ElMessage.success('文章添加成功！')
  }
  dialogVisible.value = false
}

/** 删除文章 */
function handleDelete(article) {
  ElMessageBox.confirm(
    `确定要删除文章「${article.title}」吗？删除后不可恢复。`,
    '删除确认',
    { confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'warning' }
  )
    .then(() => {
      const ok = articleStore.deleteArticle(article.id)
      if (ok) ElMessage.success(`已删除文章：${article.title}`)
    })
    .catch(() => {})
}
</script>

<template>
  <div class="article-edit-view">
    <el-card shadow="never">
      <template #header>
        <div class="edit-head">
          <span style="font-size: 16px; font-weight: 600">文章信息管理</span>
          <el-button type="primary" @click="handleAddClick">
            <el-icon style="margin-right: 4px"><Plus /></el-icon>
            新增文章
          </el-button>
        </div>
      </template>

      <!-- el-table 文章列表 -->
      <el-table :data="articleStore.articles" stripe border style="width: 100%">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="title" label="文章标题" min-width="220" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="100">
          <template #default="{ row }">
            <el-tag :type="categoryTagType(row.category)" size="small">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="发布时间" width="110" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="articleStore.articles.length === 0" description="暂无文章" />
    </el-card>

    <!-- el-dialog 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="640px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>

        <el-form-item label="分类">
          <el-select v-model="form.category" style="width: 100%">
            <el-option label="技术笔记" value="技术笔记" />
            <el-option label="学习心得" value="学习心得" />
            <el-option label="生活随笔" value="生活随笔" />
          </el-select>
        </el-form-item>

        <el-form-item label="摘要">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="2"
            placeholder="简要概括文章内容"
          />
        </el-form-item>

        <el-form-item label="正文内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            placeholder="请输入文章正文，支持换行"
          />
        </el-form-item>

        <el-form-item label="技术标签">
          <el-input v-model="form.tags" placeholder="如：Vue3, Pinia（逗号分隔）" />
        </el-form-item>

        <el-form-item label="发布时间">
          <el-input v-model="form.time" placeholder="如：2026-10-16" />
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
