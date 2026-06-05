<script setup lang="ts">
import { ref } from 'vue'
import { useTemplateStore } from '../stores/template'
import type { Template } from '../types'

const store = useTemplateStore()
const templates = ref<Template[]>([])
const loading = ref(false)
const deleting = ref<string | null>(null)

async function fetchTemplates() {
  try {
    const res = await fetch('/api/templates')
    templates.value = await res.json()
  } catch { /* server may not be running */ }
}

async function saveTemplate() {
  loading.value = true
  try {
    const data = store.getTemplateData()
    const res = await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const saved = await res.json()
    store.loadTemplate(saved)
    await fetchTemplates()
  } finally {
    loading.value = false
  }
}

async function deleteTemplate(id: string) {
  deleting.value = id
  try {
    await fetch(`/api/templates/${id}`, { method: 'DELETE' })
    if (store.templateId === id) store.newTemplate()
    await fetchTemplates()
  } finally {
    deleting.value = null
  }
}

function loadTemplate(t: Template) {
  store.loadTemplate(t)
}

function exportJSON() {
  const data = store.getTemplateData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${store.templateName || 'template'}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importJSON() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      store.loadTemplate({
        id: data.id ?? '',
        name: data.name ?? 'Imported Template',
        elements: data.elements ?? [],
        canvasSize: data.canvasSize ?? { width: 400, height: 500 },
        backgroundColor: data.backgroundColor ?? '#ffffff',
        createdAt: data.createdAt ?? new Date().toISOString(),
        updatedAt: data.updatedAt ?? new Date().toISOString(),
      })
    } catch { /* invalid file */ }
  }
  input.click()
}

function newTemplate() {
  store.newTemplate()
}

fetchTemplates()
</script>

<template>
  <div class="template-bar">
    <div class="bar-left">
      <button class="btn-action" :disabled="loading" @click="newTemplate">+ New</button>
      <button class="btn-action primary" :disabled="loading" @click="saveTemplate">Save</button>
      <button class="btn-action" :disabled="loading" @click="exportJSON">Export JSON</button>
      <button class="btn-action" @click="importJSON">Import JSON</button>
    </div>
    <div class="bar-right">
      <label class="template-name-label">Template:
        <input
          type="text"
          class="template-name-input"
          :value="store.templateName"
          @input="store.templateName = ($event.target as HTMLInputElement).value"
        />
      </label>
    </div>
  </div>

  <div class="templates-list" v-if="templates.length">
    <div v-for="t in templates" :key="t.id" class="template-item">
      <span class="template-item-name" @click="loadTemplate(t)">{{ t.name }}</span>
      <button class="btn-tiny" :disabled="deleting === t.id" @click="deleteTemplate(t.id)">×</button>
    </div>
  </div>
</template>

<style scoped>
.template-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bar-left {
  display: flex;
  gap: 8px;
}

.btn-action {
  padding: 6px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
}

.btn-action:hover {
  background: #f9fafb;
}

.btn-action.primary {
  background: #4f46e5;
  color: #fff;
  border-color: #4f46e5;
}

.btn-action.primary:hover {
  background: #4338ca;
}

.template-name-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

.template-name-input {
  padding: 4px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 13px;
  width: 180px;
}

.templates-list {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 12px;
}

.template-item-name {
  cursor: pointer;
  color: #4f46e5;
}

.template-item-name:hover {
  text-decoration: underline;
}

.btn-tiny {
  border: none;
  background: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.btn-tiny:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


</style>
