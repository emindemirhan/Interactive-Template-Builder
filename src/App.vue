<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useTemplateStore } from './stores/template'
import ElementPalette from './components/ElementPalette.vue'
import CanvasArea from './components/CanvasArea.vue'
import PropertiesPanel from './components/PropertiesPanel.vue'
import TemplateBar from './components/TemplateBar.vue'

const store = useTemplateStore()

function handleKeydown(e: KeyboardEvent) {
  if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return

  if (e.key === 'Delete' || e.key === 'Backspace') {
    store.deleteSelected()
  }
  if (e.ctrlKey && e.key === 'z') {
    e.preventDefault()
    store.undo()
  }
  if (e.ctrlKey && e.key === 'y') {
    e.preventDefault()
    store.redo()
  }
  if (store.selectedElementId) {
    const nudge = e.shiftKey ? 10 : 1
    const el = store.selectedElement
    if (!el) return
    if (e.key === 'ArrowUp') { e.preventDefault(); store.moveElement(el.id, el.position.x, el.position.y - nudge); store.commitMove() }
    if (e.key === 'ArrowDown') { e.preventDefault(); store.moveElement(el.id, el.position.x, el.position.y + nudge); store.commitMove() }
    if (e.key === 'ArrowLeft') { e.preventDefault(); store.moveElement(el.id, el.position.x - nudge, el.position.y); store.commitMove() }
    if (e.key === 'ArrowRight') { e.preventDefault(); store.moveElement(el.id, el.position.x + nudge, el.position.y); store.commitMove() }
  }
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">Interactive Template Builder</h1>
      <div class="header-actions">
        <button class="btn-icon" :disabled="!store.canUndo" @click="store.undo()">↩ Undo</button>
        <button class="btn-icon" :disabled="!store.canRedo" @click="store.redo()">↪ Redo</button>
      </div>
    </header>
    <div class="app-body">
      <aside class="sidebar-left">
        <ElementPalette />
      </aside>
      <main class="canvas-wrapper">
        <CanvasArea />
        <div class="z-controls">
          <button class="btn-sm" :disabled="!store.selectedElementId" @click="store.bringForward(store.selectedElementId!)">↑ Bring Forward</button>
          <button class="btn-sm" :disabled="!store.selectedElementId" @click="store.sendBackward(store.selectedElementId!)">↓ Send Backward</button>
        </div>
      </main>
      <aside class="sidebar-right">
        <PropertiesPanel />
      </aside>
    </div>
    <footer class="app-footer">
      <TemplateBar />
    </footer>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}

.app-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-icon:hover:not(:disabled) {
  background: #f9fafb;
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar-left {
  width: 150px;
  border-right: 1px solid #e5e7eb;
  padding: 16px;
  background: #fff;
}

.canvas-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  gap: 12px;
  padding: 24px;
}

.z-controls {
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 6px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}

.btn-sm:hover:not(:disabled) {
  background: #f9fafb;
}

.btn-sm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.sidebar-right {
  width: 280px;
  border-left: 1px solid #e5e7eb;
  padding: 16px;
  background: #fff;
  overflow-y: auto;
}

.app-footer {
  border-top: 1px solid #e5e7eb;
  padding: 10px 24px;
  background: #fff;
}
</style>
