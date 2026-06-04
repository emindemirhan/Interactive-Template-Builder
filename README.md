# Interactive Template Builder

A drag-and-drop popup template builder built with Vue 3, TypeScript, and Express.

## Setup

```bash
npm install
```

## Running

```bash
# Start frontend dev server (port 5173)
npm run dev

# Start backend API server (port 3001)
npm run server

# Run tests
npm run test
```

The frontend proxies `/api` requests to the backend server at port 3001.

## Architecture

- **Frontend**: Vue 3 + Composition API + TypeScript + Pinia
- **Backend**: Express with in-memory storage
- **Build**: Vite
- **Testing**: Vitest + Vue Test Utils

### Project Structure

```
src/
├── components/
│   ├── CanvasArea.vue      # Drop zone + element drag/resize orchestration
│   ├── CanvasElement.vue   # Renders individual template elements
│   ├── ElementPalette.vue  # Draggable element source panel
│   ├── PropertiesPanel.vue # Selected element property editor
│   └── TemplateBar.vue     # Save/load/export controls
├── stores/
│   └── template.ts         # Pinia store with undo/redo history
├── types/
│   └── index.ts            # Shared TypeScript interfaces
├── App.vue                 # Root layout + keyboard shortcuts
└── main.ts                 # Entry point
server/
└── index.ts                # Express API (GET/POST/DELETE /api/templates)
tests/
├── template-store.test.ts  # Store logic tests
└── element-palette.test.ts # Component rendering tests
```

### Key Decisions

- **Native HTML5 DnD** for palette-to-canvas drops; mouse events for element move/resize (more control, no library dependency)
- **Pinia setup store** for centralized state with computed getters
- **History stack** (JSON snapshots) for undo/redo—simple and reliable
- **Proxy-based dev setup** so frontend and backend can run independently

### Assumptions

- Canvas size is fixed at 400×500px
- In-memory storage resets on server restart (no persistence requirement)
- Single user (no auth or concurrent editing)

### Future Improvements

- Persist templates to file/database
- Multi-select and group operations
- Snap-to-grid and alignment guides
- Copy/paste elements
- Template preview modal
- Responsive canvas scaling
