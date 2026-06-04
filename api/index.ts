import express from 'express'
import cors from 'cors'
import { nanoid } from 'nanoid'

interface Position { x: number; y: number }
interface Size { width: number; height: number }
interface BaseElement { id: string; type: string; position: Position; size: Size; zIndex: number }
interface Template {
  id: string
  name: string
  elements: BaseElement[]
  canvasSize: Size
  backgroundColor: string
  createdAt: string
  updatedAt: string
}

const app = express()
app.use(cors())
app.use(express.json())

const templates: Map<string, Template> = new Map()

app.get('/api/templates', (_req, res) => {
  res.json(Array.from(templates.values()))
})

app.post('/api/templates', (req, res) => {
  const body = req.body
  const now = new Date().toISOString()

  if (body.id && templates.has(body.id)) {
    const existing = templates.get(body.id)!
    const updated: Template = {
      ...existing,
      name: body.name,
      elements: body.elements,
      canvasSize: body.canvasSize,
      backgroundColor: body.backgroundColor,
      updatedAt: now,
    }
    templates.set(updated.id, updated)
    res.json(updated)
  } else {
    const template: Template = {
      id: nanoid(),
      name: body.name || 'Untitled Template',
      elements: body.elements || [],
      canvasSize: body.canvasSize || { width: 400, height: 500 },
      backgroundColor: body.backgroundColor || '#ffffff',
      createdAt: now,
      updatedAt: now,
    }
    templates.set(template.id, template)
    res.status(201).json(template)
  }
})

app.delete('/api/templates/:id', (req, res) => {
  const { id } = req.params
  if (templates.has(id)) {
    templates.delete(id)
    res.status(204).end()
  } else {
    res.status(404).json({ error: 'Template not found' })
  }
})

export default app
