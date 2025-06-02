import React from "react";
import { useWhiteboardStore } from "../Canvas/useWhiteboardStore";

const colors = [
  "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF"
];

const ColorPicker: React.FC = () => {
  const { color, setColor } = useWhiteboardStore();
  return (
    <div className="flex items-center gap-1">
      {colors.map((c) => (
        <button
          key={c}
          className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-blue-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
          style={{ backgroundColor: c }}
          title={c}
          onClick={() => setColor(c)}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
