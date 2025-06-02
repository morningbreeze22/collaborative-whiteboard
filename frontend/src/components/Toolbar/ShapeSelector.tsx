import React from "react";
import { useWhiteboardStore } from "../Canvas/useWhiteboardStore";

const shapes = [
  { type: 'rectangle', icon: '▭', label: 'Rectangle' },
  { type: 'ellipse', icon: '◯', label: 'Ellipse' },
  { type: 'line', icon: '／', label: 'Line' },
];

const ShapeSelector: React.FC = () => {
  const { tool, setTool } = useWhiteboardStore();
  return (
    <div className="flex items-center gap-1">
      {shapes.map((shape) => (
        <button
          key={shape.type}
          className={`toolbar-btn ${tool === shape.type ? 'bg-blue-100' : ''}`}
          title={shape.label}
          onClick={() => setTool(shape.type as any)}
        >
          <span className="text-xl">{shape.icon}</span>
        </button>
      ))}
    </div>
  );
};

export default ShapeSelector;
