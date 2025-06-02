import { create } from 'zustand';
import type { fabric } from 'fabric';

export type Tool = 'pen' | 'rectangle' | 'ellipse' | 'line' | 'eraser';

interface WhiteboardState {
  tool: Tool;
  color: string;
  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  undoStack: any[];
  redoStack: any[];
  saveState: (state: any) => void;
  undo: (canvas: fabric.Canvas) => void;
  redo: (canvas: fabric.Canvas) => void;
  clear: (canvas: fabric.Canvas) => void;
  reset: () => void;
}

// Utility function to make all objects on canvas non-selectable and non-interactive
const makeAllObjectsNonSelectable = (canvas: fabric.Canvas) => {
  canvas.forEachObject((obj) => {
    obj.set({
      selectable: false,
      evented: false,
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: 'default',
      moveCursor: 'default'
    });
  });
  canvas.discardActiveObject();
  canvas.renderAll();
};

// Helper function to temporarily disable canvas events during state loading
const withoutEvents = (canvas: fabric.Canvas, callback: () => void) => {
  // Store original event handlers
  const eventHandlers = {
    'object:added': (canvas as any).__eventListeners?.['object:added'] || [],
    'object:modified': (canvas as any).__eventListeners?.['object:modified'] || [],
    'object:removed': (canvas as any).__eventListeners?.['object:removed'] || []
  };
  
  // Remove event listeners temporarily
  Object.keys(eventHandlers).forEach(eventName => {
    canvas.off(eventName);
  });
  
  // Execute callback without events
  callback();
  
  // After restoring state, make all objects non-selectable
  makeAllObjectsNonSelectable(canvas);
  
  // Restore event listeners
  Object.entries(eventHandlers).forEach(([eventName, handlers]) => {
    handlers.forEach((handler: any) => {
      canvas.on(eventName, handler);
    });
  });
};

export const useWhiteboardStore = create<WhiteboardState>((set, get) => ({
  tool: 'pen',
  color: '#000000',
  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  undoStack: [],
  redoStack: [],
  saveState: (state) => set((s) => ({ undoStack: [...s.undoStack, state], redoStack: [] })),
  undo: (canvas) => {
    const { undoStack, redoStack } = get();
    if (undoStack.length < 2) return;
    const prev = undoStack[undoStack.length - 2];
    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [undoStack[undoStack.length - 1], ...redoStack],
    });
    withoutEvents(canvas, () => {
      canvas.loadFromJSON(prev, () => {
        makeAllObjectsNonSelectable(canvas);
        canvas.renderAll();
      });
    });
  },
  redo: (canvas) => {
    const { undoStack, redoStack } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    set({
      undoStack: [...undoStack, next],
      redoStack: redoStack.slice(1),
    });
    withoutEvents(canvas, () => {
      canvas.loadFromJSON(next, () => {
        makeAllObjectsNonSelectable(canvas);
        canvas.renderAll();
      });
    });
  },
  clear: (canvas) => {
    canvas.clear();
    canvas.backgroundColor = "#fff";
    canvas.renderAll();
    set((s) => ({ undoStack: [...s.undoStack, canvas.toDatalessJSON()], redoStack: [] }));
  },
  reset: () => set({ undoStack: [], redoStack: [] }),
}));
