<script setup lang="ts">
import { computed } from 'vue'
import { useTemplateStore } from '../stores/template'
import type { TemplateElement } from '../types'

defineEmits<{ close: [] }>()

const store = useTemplateStore()

const sortedElements = computed(() =>
  [...store.elements].sort((a, b) => a.zIndex - b.zIndex)
)

function getElementStyle(el: TemplateElement): Record<string, string> {
  const base: Record<string, string> = {
    position: 'absolute',
    left: el.position.x + 'px',
    top: el.position.y + 'px',
    width: el.size.width + 'px',
    height: el.size.height + 'px',
    zIndex: String(el.zIndex),
  }

  switch (el.type) {
    case 'heading':
      return { ...base, fontSize: el.fontSize + 'px', color: el.color, textAlign: el.alignment, fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: el.alignment === 'center' ? 'center' : el.alignment === 'right' ? 'flex-end' : 'flex-start' }
    case 'text':
      return { ...base, fontSize: el.fontSize + 'px', color: el.color, textAlign: el.alignment, display: 'flex', alignItems: 'center', justifyContent: el.alignment === 'center' ? 'center' : el.alignment === 'right' ? 'flex-end' : 'flex-start' }
    case 'button':
      return { ...base, backgroundColor: el.backgroundColor, color: el.textColor, borderRadius: el.borderRadius + 'px', border: 'none', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }
    case 'image':
      return base
    case 'divider':
      return base
  }
}

function getContent(el: TemplateElement): string {
  switch (el.type) {
    case 'heading': return el.content
    case 'text': return el.content
    case 'button': return el.text
    default: return ''
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h3>Preview: {{ store.templateName }}</h3>
        <button class="modal-close" @click="$emit('close')">×</button>
      </div>
      <div class="modal-body">
        <div
          class="preview-canvas"
          :style="{
            width: store.canvasSize.width + 'px',
            height: store.canvasSize.height + 'px',
            backgroundColor: store.backgroundColor,
          }"
        >
          <template v-for="el in sortedElements" :key="el.id">
            <div v-if="el.type === 'heading' || el.type === 'text'" :style="getElementStyle(el)">
              {{ getContent(el) }}
            </div>
            <div v-else-if="el.type === 'button'" :style="getElementStyle(el)">
              {{ getContent(el) }}
            </div>
            <div v-else-if="el.type === 'image'" :style="getElementStyle(el)">
              <img v-if="el.url" :src="el.url" :alt="el.altText" style="width:100%;height:100%;object-fit:cover" />
              <div v-else class="preview-image-placeholder" :style="{ width: '100%', height: '100%', background: '#f3f4f6', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '12px' }">
                {{ el.size.width }} x {{ el.size.height }}
              </div>
            </div>
            <div v-else-if="el.type === 'divider'" :style="getElementStyle(el)">
              <hr :style="{ width: '100%', borderColor: el.color, borderWidth: el.thickness + 'px', borderStyle: 'solid', borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'absolute', top: '50%', transform: 'translateY(-50%)' }" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.modal-close {
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
  line-height: 1;
}

.modal-close:hover {
  color: #111;
}

.modal-body {
  padding: 24px;
  display: flex;
  justify-content: center;
}

.preview-canvas {
  position: relative;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
</style>
