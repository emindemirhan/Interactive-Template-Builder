export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export type ElementType = 'heading' | 'text' | 'button' | 'image' | 'divider'

export interface BaseElement {
  id: string
  type: ElementType
  position: Position
  size: Size
  zIndex: number
}

export interface HeadingElement extends BaseElement {
  type: 'heading'
  content: string
  fontSize: number
  color: string
  alignment: 'left' | 'center' | 'right'
}

export interface TextElement extends BaseElement {
  type: 'text'
  content: string
  fontSize: number
  color: string
  alignment: 'left' | 'center' | 'right'
}

export interface ButtonElement extends BaseElement {
  type: 'button'
  text: string
  backgroundColor: string
  textColor: string
  borderRadius: number
}

export interface ImageElement extends BaseElement {
  type: 'image'
  url: string
  altText: string
}

export interface DividerElement extends BaseElement {
  type: 'divider'
  color: string
  thickness: number
}

export type TemplateElement = HeadingElement | TextElement | ButtonElement | ImageElement | DividerElement

export interface Template {
  id: string
  name: string
  elements: TemplateElement[]
  canvasSize: Size
  backgroundColor: string
  createdAt: string
  updatedAt: string
}
