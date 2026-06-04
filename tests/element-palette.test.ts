import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import ElementPalette from '../src/components/ElementPalette.vue'

describe('ElementPalette', () => {
  it('renders all palette items', () => {
    const wrapper = mount(ElementPalette, {
      global: { plugins: [createPinia()] }
    })

    expect(wrapper.text()).toContain('Heading')
    expect(wrapper.text()).toContain('Text')
    expect(wrapper.text()).toContain('Button')
    expect(wrapper.text()).toContain('Image')
    expect(wrapper.text()).toContain('Divider')
  })

  it('adds element to store on click', async () => {
    const pinia = createPinia()
    const wrapper = mount(ElementPalette, {
      global: { plugins: [pinia] }
    })

    const { useTemplateStore } = await import('../src/stores/template')
    const store = useTemplateStore()

    await wrapper.findAll('.palette-item')[0].trigger('click')
    expect(store.elements).toHaveLength(1)
    expect(store.elements[0].type).toBe('heading')
  })
})
