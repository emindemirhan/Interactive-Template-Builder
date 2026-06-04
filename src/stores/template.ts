import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { nanoid } from 'nanoid'
import type { Template, TemplateElement, ElementType } from '../types'

const DEFAULT_CANVAS = { width: 400, height: 500 }
const MAX_HISTORY = 50

function createDefaultElement(type: ElementType, x: number, y: number): TemplateElement {
  const base = { id: nanoid(), position: { x, y }, zIndex: 0 }

  switch (type) {
    case 'heading':
      return { ...base, type: 'heading', size: { width: 300, height: 40 }, content: 'Heading', fontSize: 24, color: '#000000', alignment: 'center' }
    case 'text':
      return { ...base, type: 'text', size: { width: 280, height: 30 }, content: 'Text content', fontSize: 14, color: '#333333', alignment: 'center' }
    case 'button':
      return { ...base, type: 'button', size: { width: 170, height: 48 }, text: 'Click Me', backgroundColor: '#4f46e5', textColor: '#ffffff', borderRadius: 8 }
    case 'image':
      return { ...base, type: 'image', size: { width: 150, height: 120 }, url: '', altText: 'Image' }
    case 'divider':
      return { ...base, type: 'divider', size: { width: 200, height: 4 }, color: '#e5e7eb', thickness: 4 }
  }
}

export const useTemplateStore = defineStore('template', () => {
  const elements = ref<TemplateElement[]>([])
  const selectedElementId = ref<string | null>(null)
  const templateName = ref('Untitled Template')
  const templateId = ref<string | null>(null)
  const canvasSize = ref({ ...DEFAULT_CANVAS })
  const backgroundColor = ref('#ffffff')

  const history = ref<string[]>([])
  const historyIndex = ref(-1)

  const selectedElement = computed(() =>
    elements.value.find(el => el.id === selectedElementId.value) ?? null
  )

  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  function saveState() {
    const state = JSON.stringify(elements.value)
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }
    history.value.push(state)
    if (history.value.length > MAX_HISTORY) {
      history.value.shift()
    } else {
      historyIndex.value++
    }
  }

  function undo() {
    if (!canUndo.value) return
    historyIndex.value--
    elements.value = JSON.parse(history.value[historyIndex.value])
    if (selectedElementId.value && !elements.value.find(el => el.id === selectedElementId.value)) {
      selectedElementId.value = null
    }
  }

  function redo() {
    if (!canRedo.value) return
    historyIndex.value++
    elements.value = JSON.parse(history.value[historyIndex.value])
  }

  function addElement(type: ElementType, x?: number, y?: number) {
    const posX = x ?? (canvasSize.value.width / 2 - 75)
    const posY = y ?? (elements.value.length * 60 + 20)
    const el = createDefaultElement(type, posX, posY)
    el.zIndex = elements.value.length
    elements.value.push(el)
    selectedElementId.value = el.id
    saveState()
  }

  function selectElement(id: string | null) {
    selectedElementId.value = id
  }

  function updateElement(id: string, updates: Partial<TemplateElement>) {
    const idx = elements.value.findIndex(el => el.id === id)
    if (idx === -1) return
    elements.value[idx] = { ...elements.value[idx], ...updates } as TemplateElement
    saveState()
  }

  function moveElement(id: string, x: number, y: number) {
    const idx = elements.value.findIndex(el => el.id === id)
    if (idx === -1) return
    elements.value[idx] = { ...elements.value[idx], position: { x, y } } as TemplateElement
  }

  function commitMove() {
    saveState()
  }

  function resizeElement(id: string, width: number, height: number) {
    const idx = elements.value.findIndex(el => el.id === id)
    if (idx === -1) return
    elements.value[idx] = { ...elements.value[idx], size: { width, height } } as TemplateElement
  }

  function commitResize() {
    saveState()
  }

  function deleteElement(id: string) {
    elements.value = elements.value.filter(el => el.id !== id)
    if (selectedElementId.value === id) selectedElementId.value = null
    saveState()
  }

  function deleteSelected() {
    if (selectedElementId.value) deleteElement(selectedElementId.value)
  }

  function bringForward(id: string) {
    const el = elements.value.find(e => e.id === id)
    if (!el) return
    const maxZ = Math.max(...elements.value.map(e => e.zIndex))
    if (el.zIndex < maxZ) {
      const above = elements.value.find(e => e.zIndex === el.zIndex + 1)
      if (above) above.zIndex--
      el.zIndex++
      saveState()
    }
  }

  function sendBackward(id: string) {
    const el = elements.value.find(e => e.id === id)
    if (!el) return
    if (el.zIndex > 0) {
      const below = elements.value.find(e => e.zIndex === el.zIndex - 1)
      if (below) below.zIndex++
      el.zIndex--
      saveState()
    }
  }

  function loadTemplate(template: Template) {
    templateId.value = template.id
    templateName.value = template.name
    elements.value = template.elements
    canvasSize.value = template.canvasSize
    backgroundColor.value = template.backgroundColor
    history.value = [JSON.stringify(elements.value)]
    historyIndex.value = 0
    selectedElementId.value = null
  }

  function newTemplate() {
    templateId.value = null
    templateName.value = 'Untitled Template'
    elements.value = []
    canvasSize.value = { ...DEFAULT_CANVAS }
    backgroundColor.value = '#ffffff'
    history.value = ['[]']
    historyIndex.value = 0
    selectedElementId.value = null
  }

  function getTemplateData(): Omit<Template, 'id' | 'createdAt' | 'updatedAt'> & { id?: string } {
    return {
      id: templateId.value ?? undefined,
      name: templateName.value,
      elements: elements.value,
      canvasSize: canvasSize.value,
      backgroundColor: backgroundColor.value
    }
  }

  // Initialize history
  history.value = [JSON.stringify(elements.value)]
  historyIndex.value = 0

  return {
    elements,
    selectedElementId,
    selectedElement,
    templateName,
    templateId,
    canvasSize,
    backgroundColor,
    canUndo,
    canRedo,
    addElement,
    selectElement,
    updateElement,
    moveElement,
    commitMove,
    resizeElement,
    commitResize,
    deleteElement,
    deleteSelected,
    bringForward,
    sendBackward,
    undo,
    redo,
    loadTemplate,
    newTemplate,
    getTemplateData
  }
})
