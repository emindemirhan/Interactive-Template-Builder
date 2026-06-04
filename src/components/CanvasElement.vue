<script setup lang="ts">
import type { TemplateElement } from '../types'

const props = defineProps<{
  element: TemplateElement
  selected: boolean
}>()

const emit = defineEmits<{
  resize: [e: MouseEvent]
}>()
</script>

<template>
  <div
    class="canvas-element"
    :class="{ selected }"
    :style="{
      left: props.element.position.x + 'px',
      top: props.element.position.y + 'px',
      width: props.element.size.width + 'px',
      height: props.element.size.height + 'px',
      zIndex: props.element.zIndex,
    }"
  >
    <template v-if="props.element.type === 'heading'">
      <h2
        class="el-heading"
        :style="{
          fontSize: props.element.fontSize + 'px',
          color: props.element.color,
          textAlign: props.element.alignment,
        }"
      >{{ props.element.content }}</h2>
    </template>

    <template v-else-if="props.element.type === 'text'">
      <p
        class="el-text"
        :style="{
          fontSize: props.element.fontSize + 'px',
          color: props.element.color,
          textAlign: props.element.alignment,
        }"
      >{{ props.element.content }}</p>
    </template>

    <template v-else-if="props.element.type === 'button'">
      <button
        class="el-button"
        :style="{
          backgroundColor: props.element.backgroundColor,
          color: props.element.textColor,
          borderRadius: props.element.borderRadius + 'px',
        }"
      >{{ props.element.text }}</button>
    </template>

    <template v-else-if="props.element.type === 'image'">
      <div class="el-image" v-if="!props.element.url">
        <span class="image-placeholder">{{ props.element.size.width }} x {{ props.element.size.height }}</span>
      </div>
      <img
        v-else
        :src="props.element.url"
        :alt="props.element.altText"
        class="el-img"
      />
    </template>

    <template v-else-if="props.element.type === 'divider'">
      <hr
        class="el-divider"
        :style="{
          borderColor: props.element.color,
          borderWidth: props.element.thickness + 'px',
        }"
      />
    </template>

    <div
      v-if="selected"
      class="resize-handle"
      @mousedown.stop="emit('resize', $event)"
    />
  </div>
</template>

<style scoped>
.canvas-element {
  position: absolute;
  cursor: move;
  user-select: none;
}

.canvas-element.selected {
  outline: 2px dashed #4f46e5;
  outline-offset: 2px;
}

.resize-handle {
  position: absolute;
  right: -5px;
  bottom: -5px;
  width: 10px;
  height: 10px;
  background: #4f46e5;
  border-radius: 2px;
  cursor: se-resize;
}

.el-heading {
  margin: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-weight: 700;
}

.el-text {
  margin: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.el-button {
  width: 100%;
  height: 100%;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.el-image {
  width: 100%;
  height: 100%;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  color: #9ca3af;
  font-size: 12px;
}

.el-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.el-divider {
  width: 100%;
  border-style: solid;
  border-top: none;
  border-left: none;
  border-right: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
</style>
