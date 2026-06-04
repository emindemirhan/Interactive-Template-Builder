import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTemplateStore } from '../src/stores/template'

describe('Template Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds an element and selects it', () => {
    const store = useTemplateStore()
    expect(store.elements).toHaveLength(0)

    store.addElement('heading')

    expect(store.elements).toHaveLength(1)
    expect(store.elements[0].type).toBe('heading')
    expect(store.selectedElementId).toBe(store.elements[0].id)
  })

  it('deletes the selected element', () => {
    const store = useTemplateStore()
    store.addElement('button')
    const id = store.elements[0].id

    store.deleteElement(id)

    expect(store.elements).toHaveLength(0)
    expect(store.selectedElementId).toBeNull()
  })

  it('supports undo and redo', () => {
    const store = useTemplateStore()
    store.addElement('text')
    store.addElement('button')

    expect(store.elements).toHaveLength(2)

    store.undo()
    expect(store.elements).toHaveLength(1)

    store.redo()
    expect(store.elements).toHaveLength(2)
  })

  it('updates element properties', () => {
    const store = useTemplateStore()
    store.addElement('heading')
    const id = store.elements[0].id

    store.updateElement(id, { content: 'New Title' } as never)

    const el = store.elements[0]
    expect(el.type === 'heading' && el.content).toBe('New Title')
  })

  it('manages z-index with bring forward and send backward', () => {
    const store = useTemplateStore()
    store.addElement('heading')
    store.addElement('text')

    const first = store.elements[0]
    const second = store.elements[1]
    expect(first.zIndex).toBe(0)
    expect(second.zIndex).toBe(1)

    store.bringForward(first.id)
    expect(store.elements.find(e => e.id === first.id)!.zIndex).toBe(1)
    expect(store.elements.find(e => e.id === second.id)!.zIndex).toBe(0)
  })
})
