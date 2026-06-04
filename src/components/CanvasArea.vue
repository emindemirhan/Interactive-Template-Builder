<script setup lang="ts">
import { ref } from 'vue'
import { useTemplateStore } from '../stores/template'
import type { ElementType, TemplateElement } from '../types'
import CanvasElement from './CanvasElement.vue'

const store = useTemplateStore()
const canvasRef = ref<HTMLElement | null>(null)

function onDrop(e: DragEvent) {
  e.preventDefault()
  const type = e.dataTransfer?.getData('element-type') as ElementType | undefined
  if (!type || !canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  store.addElement(type, x - 75, y - 20)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  e.dataTransfer!.dropEffect = 'copy'
}

function onCanvasClick(e: MouseEvent) {
  if (e.target === canvasRef.value) {
    store.selectElement(null)
  }
}

const dragState = ref<{ id: string; startX: number; startY: number; elX: number; elY: number } | null>(null)
const resizeState = ref<{ id: string; startX: number; startY: number; startW: number; startH: number } | null>(null)

function startDrag(e: MouseEvent, element: TemplateElement) {
  e.stopPropagation()
  store.selectElement(element.id)
  dragState.value = {
    id: element.id,
    startX: e.clientX,
    startY: e.clientY,
    elX: element.position.x,
    elY: element.position.y,
  }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent) {
  if (!dragState.value) return
  const dx = e.clientX - dragState.value.startX
  const dy = e.clientY - dragState.value.startY
  store.moveElement(dragState.value.id, dragState.value.elX + dx, dragState.value.elY + dy)
}

function stopDrag() {
  if (dragState.value) {
    store.commitMove()
    dragState.value = null
  }
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

function startResize(e: MouseEvent, element: TemplateElement) {
  e.stopPropagation()
  resizeState.value = {
    id: element.id,
    startX: e.clientX,
    startY: e.clientY,
    startW: element.size.width,
    startH: element.size.height,
  }
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

function onResize(e: MouseEvent) {
  if (!resizeState.value) return
  const dx = e.clientX - resizeState.value.startX
  const dy = e.clientY - resizeState.value.startY
  const w = Math.max(30, resizeState.value.startW + dx)
  const h = Math.max(20, resizeState.value.startH + dy)
  store.resizeElement(resizeState.value.id, w, h)
}

function stopResize() {
  if (resizeState.value) {
    store.commitResize()
    resizeState.value = null
  }
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
}

const sortedElements = computed(() =>
  [...store.elements].sort((a, b) => a.zIndex - b.zIndex)
)

import { computed } from 'vue'
</script>

<template>
  <div
    ref="canvasRef"
    class="canvas"
    :style="{
      width: store.canvasSize.width + 'px',
      height: store.canvasSize.height + 'px',
      backgroundColor: store.backgroundColor
    }"
    @drop="onDrop"
    @dragover="onDragOver"
    @click="onCanvasClick"
  >
    <CanvasElement
      v-for="element in sortedElements"
      :key="element.id"
      :element="element"
      :selected="element.id === store.selectedElementId"
      @mousedown="startDrag($event, element)"
      @resize="startResize($event, element)"
    />
  </div>
</template>

<style scoped>
.canvas {
  position: relative;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
</style>
