import React, { useRef } from "react";
import Toolbar from "./components/Toolbar/Toolbar";
import WhiteboardCanvas from "./components/Canvas/WhiteboardCanvas";
import UserPresence from "./components/Common/UserPresence";
import type { fabric } from "fabric";

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;
const CONTAINER_WIDTH = CANVAS_WIDTH * 1.2;
const CANVAS_WRAPPER_WIDTH = CANVAS_WIDTH * 1.05;

const App: React.FC = () => {
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col items-center justify-center font-sans p-4">
      <div className="flex flex-col items-center" style={{ width: CONTAINER_WIDTH }}>
        <h1 className="text-3xl font-bold text-blue-700 mb-2 mt-6 drop-shadow-sm">Welcome to Collaborative Whiteboard!</h1>
        <p className="text-gray-600 mb-2 text-lg">Draw, create, and collaborate in real time.</p>
        <div className="mb-2 text-sm text-gray-500">Whiteboard size: <span className="font-mono">{CANVAS_WIDTH} x {CANVAS_HEIGHT}</span> px</div>
        <UserPresence />
        <div 
          className="rounded-2xl shadow-2xl bg-white/90 px-8 py-4 flex flex-col items-center"
          style={{ width: CONTAINER_WIDTH }}
        >
          <Toolbar getCanvas={() => fabricCanvasRef.current} toolbarWidth={CANVAS_WRAPPER_WIDTH} />
          <div className="flex flex-row items-start" style={{ width: CANVAS_WRAPPER_WIDTH }}>
            <div className="flex-1 flex flex-col items-center">
              <WhiteboardCanvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fabricCanvasRef={fabricCanvasRef} wrapperWidth={CANVAS_WRAPPER_WIDTH} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
