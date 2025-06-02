import React, { useRef } from "react";
import Toolbar from "./components/Toolbar/Toolbar";
import WhiteboardCanvas from "./components/Canvas/WhiteboardCanvas";
import UserPresence from "./components/Common/UserPresence";
import type { fabric } from "fabric";

const BOARD_WIDTH = 1280;
const BOARD_HEIGHT = 720;

const App: React.FC = () => {
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full flex flex-col items-center" style={{ minWidth: BOARD_WIDTH + 200 }}>
        <h1 className="text-3xl font-bold text-blue-700 mb-2 mt-6 drop-shadow-sm">Welcome to Collaborative Whiteboard!</h1>
        <p className="text-gray-600 mb-2 text-lg">Draw, create, and collaborate in real time.</p>
        <div className="mb-2 text-sm text-gray-500">Whiteboard size: <span className="font-mono">{BOARD_WIDTH} x {BOARD_HEIGHT}</span> px</div>
        <UserPresence />
        <div 
          className="rounded-2xl shadow-2xl bg-white/90 p-4 flex flex-col items-center w-full"
          style={{ 
            minWidth: BOARD_WIDTH + 100,
            maxWidth: '95vw'
          }}
        >
          <Toolbar getCanvas={() => fabricCanvasRef.current} />
          <div className="flex flex-row items-start w-full mt-2">
            <div className="flex-1 flex flex-col items-center">
              <WhiteboardCanvas width={BOARD_WIDTH} height={BOARD_HEIGHT} fabricCanvasRef={fabricCanvasRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
