import React from "react";
import ColorPicker from "./ColorPicker";
import ShapeSelector from "./ShapeSelector";
import { useWhiteboardStore } from "../Canvas/useWhiteboardStore";
import type { fabric } from "fabric";

interface ToolbarProps {
  getCanvas: () => fabric.Canvas | null;
}

const Toolbar: React.FC<ToolbarProps> = ({ getCanvas }) => {
  const { tool, setTool, undo, redo, clear } = useWhiteboardStore();

  return (
    <div className="flex items-center gap-4 bg-white/80 px-6 py-3 rounded-xl shadow mb-2 w-full justify-center border border-gray-200">
      <button
        className={`toolbar-btn ${tool === 'pen' ? 'bg-blue-100' : ''}`}
        title="Pen"
        onClick={() => setTool('pen')}
      >
        <span role="img" aria-label="Pen" className="text-xl">✏️</span>
      </button>
      <button
        className={`toolbar-btn ${tool === 'eraser' ? 'bg-blue-100' : ''}`}
        title="Eraser"
        onClick={() => setTool('eraser')}
      >
        <span role="img" aria-label="Eraser" className="text-xl">🧽</span>
      </button>
      <ShapeSelector />
      <ColorPicker />
      <button
        className="toolbar-btn"
        title="Undo"
        onClick={() => { const c = getCanvas(); c && undo(c); }}
      >
        <span role="img" aria-label="Undo" className="text-xl">↩️</span>
      </button>
      <button
        className="toolbar-btn"
        title="Redo"
        onClick={() => { const c = getCanvas(); c && redo(c); }}
      >
        <span role="img" aria-label="Redo" className="text-xl">↪️</span>
      </button>
      <button
        className="toolbar-btn"
        title="Clear"
        onClick={() => { const c = getCanvas(); c && clear(c); }}
      >
        <span role="img" aria-label="Clear" className="text-xl">🗑️</span>
      </button>
    </div>
  );
};

export default Toolbar;
