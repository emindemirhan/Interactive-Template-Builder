<script setup lang="ts">
import { useTemplateStore } from '../stores/template'

const store = useTemplateStore()

function updateProp(key: string, value: unknown) {
  if (!store.selectedElementId) return
  store.updateElement(store.selectedElementId, { [key]: value } as never)
}
</script>

<template>
  <div class="properties" v-if="store.selectedElement">
    <h3 class="panel-title">PROPERTIES</h3>
    <div class="prop-badge">{{ store.selectedElement.type }}</div>

    <!-- Heading / Text -->
    <template v-if="store.selectedElement.type === 'heading' || store.selectedElement.type === 'text'">
      <label class="prop-label">
        {{ store.selectedElement.type === 'heading' ? 'Content' : 'Content' }}
        <input
          type="text"
          :value="store.selectedElement.content"
          @input="updateProp('content', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <label class="prop-label">
        Font Size
        <input
          type="number"
          :value="store.selectedElement.fontSize"
          @input="updateProp('fontSize', Number(($event.target as HTMLInputElement).value))"
          min="8"
          max="72"
        />
      </label>
      <label class="prop-label">
        Color
        <div class="color-row">
          <input
            type="color"
            :value="store.selectedElement.color"
            @input="updateProp('color', ($event.target as HTMLInputElement).value)"
          />
          <input
            type="text"
            :value="store.selectedElement.color"
            @change="updateProp('color', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </label>
      <label class="prop-label">
        Alignment
        <select
          :value="store.selectedElement.alignment"
          @change="updateProp('alignment', ($event.target as HTMLSelectElement).value)"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>
    </template>

    <!-- Button -->
    <template v-if="store.selectedElement.type === 'button'">
      <label class="prop-label">
        Text
        <input
          type="text"
          :value="store.selectedElement.text"
          @input="updateProp('text', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <label class="prop-label">
        Background Color
        <div class="color-row">
          <input
            type="color"
            :value="store.selectedElement.backgroundColor"
            @input="updateProp('backgroundColor', ($event.target as HTMLInputElement).value)"
          />
          <input
            type="text"
            :value="store.selectedElement.backgroundColor"
            @change="updateProp('backgroundColor', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </label>
      <label class="prop-label">
        Text Color
        <div class="color-row">
          <input
            type="color"
            :value="store.selectedElement.textColor"
            @input="updateProp('textColor', ($event.target as HTMLInputElement).value)"
          />
          <input
            type="text"
            :value="store.selectedElement.textColor"
            @change="updateProp('textColor', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </label>
      <label class="prop-label">
        Border Radius
        <div class="range-row">
          <input
            type="range"
            :value="store.selectedElement.borderRadius"
            @input="updateProp('borderRadius', Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="24"
          />
          <span>{{ store.selectedElement.borderRadius }}px</span>
        </div>
      </label>
    </template>

    <!-- Image -->
    <template v-if="store.selectedElement.type === 'image'">
      <label class="prop-label">
        Image URL
        <input
          type="text"
          :value="store.selectedElement.url"
          @input="updateProp('url', ($event.target as HTMLInputElement).value)"
          placeholder="https://..."
        />
      </label>
      <label class="prop-label">
        Alt Text
        <input
          type="text"
          :value="store.selectedElement.altText"
          @input="updateProp('altText', ($event.target as HTMLInputElement).value)"
        />
      </label>
    </template>

    <!-- Divider -->
    <template v-if="store.selectedElement.type === 'divider'">
      <label class="prop-label">
        Color
        <div class="color-row">
          <input
            type="color"
            :value="store.selectedElement.color"
            @input="updateProp('color', ($event.target as HTMLInputElement).value)"
          />
          <input
            type="text"
            :value="store.selectedElement.color"
            @change="updateProp('color', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </label>
      <label class="prop-label">
        Thickness
        <input
          type="number"
          :value="store.selectedElement.thickness"
          @input="updateProp('thickness', Number(($event.target as HTMLInputElement).value))"
          min="1"
          max="10"
        />
      </label>
    </template>

    <!-- Position & Size -->
    <div class="prop-section">
      <span class="prop-section-title">Position</span>
      <div class="pos-grid">
        <label class="prop-label mini">
          X
          <input
            type="number"
            :value="store.selectedElement.position.x"
            @change="updateProp('position', { ...store.selectedElement!.position, x: Number(($event.target as HTMLInputElement).value) })"
          />
        </label>
        <label class="prop-label mini">
          Y
          <input
            type="number"
            :value="store.selectedElement.position.y"
            @change="updateProp('position', { ...store.selectedElement!.position, y: Number(($event.target as HTMLInputElement).value) })"
          />
        </label>
      </div>
    </div>

    <div class="prop-section">
      <span class="prop-section-title">Size</span>
      <div class="pos-grid">
        <label class="prop-label mini">
          Width
          <input
            type="number"
            :value="store.selectedElement.size.width"
            @change="updateProp('size', { ...store.selectedElement!.size, width: Number(($event.target as HTMLInputElement).value) })"
          />
        </label>
        <label class="prop-label mini">
          Height
          <input
            type="number"
            :value="store.selectedElement.size.height"
            @change="updateProp('size', { ...store.selectedElement!.size, height: Number(($event.target as HTMLInputElement).value) })"
          />
        </label>
      </div>
    </div>

    <button class="btn-delete" @click="store.deleteSelected()">Delete Element</button>
  </div>

  <div class="properties empty" v-else>
    <p class="empty-text">Select an element to edit its properties</p>
  </div>
</template>

<style scoped>
.properties {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-title {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.5px;
}

.prop-badge {
  display: inline-block;
  padding: 4px 10px;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
  align-self: flex-start;
}

.prop-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
}

.prop-label input[type="text"],
.prop-label input[type="number"] {
  width: 100%;
}

.prop-label select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 13px;
}

.color-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-row input[type="color"] {
  width: 32px;
  height: 32px;
  padding: 2px;
  border-radius: 4px;
  cursor: pointer;
}

.color-row input[type="text"] {
  flex: 1;
}

.range-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-row input[type="range"] {
  flex: 1;
}

.range-row span {
  font-size: 12px;
  color: #6b7280;
  min-width: 35px;
}

.prop-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.prop-section-title {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
}

.pos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.prop-label.mini input {
  width: 100%;
}

.btn-delete {
  margin-top: 16px;
  padding: 10px;
  background: #fff;
  border: 1px solid #ef4444;
  border-radius: 6px;
  color: #ef4444;
  font-weight: 500;
  cursor: pointer;
  font-size: 13px;
}

.btn-delete:hover {
  background: #fef2f2;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.empty-text {
  color: #9ca3af;
  font-size: 13px;
  text-align: center;
}
</style>
