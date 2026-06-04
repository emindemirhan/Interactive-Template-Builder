<script setup lang="ts">
import type { ElementType } from '../types'
import { useTemplateStore } from '../stores/template'

const store = useTemplateStore()

const palette: { type: ElementType; label: string; icon: string }[] = [
  { type: 'heading', label: 'Heading', icon: 'H' },
  { type: 'text', label: 'Text', icon: 'T' },
  { type: 'button', label: 'Button', icon: '☐' },
  { type: 'image', label: 'Image', icon: '▣' },
  { type: 'divider', label: 'Divider', icon: '—' },
]

function onDragStart(e: DragEvent, type: ElementType) {
  e.dataTransfer!.setData('element-type', type)
  e.dataTransfer!.effectAllowed = 'copy'
}

function onClick(type: ElementType) {
  store.addElement(type)
}
</script>

<template>
  <div class="palette">
    <h3 class="palette-title">ELEMENTS</h3>
    <div
      v-for="item in palette"
      :key="item.type"
      class="palette-item"
      draggable="true"
      @dragstart="onDragStart($event, item.type)"
      @click="onClick(item.type)"
    >
      <span class="palette-icon">{{ item.icon }}</span>
      <span class="palette-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.palette-title {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.palette-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: grab;
  user-select: none;
  transition: background 0.15s;
}

.palette-item:hover {
  background: #f9fafb;
}

.palette-item:active {
  cursor: grabbing;
}

.palette-icon {
  width: 20px;
  text-align: center;
  font-weight: 600;
  color: #6b7280;
}

.palette-label {
  font-size: 13px;
  color: #374151;
}
</style>
