import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { useWhiteboardStore } from "./useWhiteboardStore";

interface WhiteboardCanvasProps {
  width: number;
  height: number;
  fabricCanvasRef?: React.MutableRefObject<fabric.Canvas | null>;
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

const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({ width, height, fabricCanvasRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const { tool, color, saveState } = useWhiteboardStore();

  // Initialize Fabric.js canvas with fixed size
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Set the canvas element to fixed logical size
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#fff",
      selection: false, // Disable selection box completely
      width,
      height,
    });
    
    fabricRef.current = fabricCanvas;
    if (fabricCanvasRef) fabricCanvasRef.current = fabricCanvas;

    // Save state only on user actions
    const save = () => saveState(fabricCanvas.toDatalessJSON());
    fabricCanvas.on("object:added", save);
    fabricCanvas.on("object:modified", save);
    fabricCanvas.on("object:removed", save);

    // Clean up on unmount
    return () => {
      fabricCanvas.off("object:added", save);
      fabricCanvas.off("object:modified", save);
      fabricCanvas.off("object:removed", save);
      fabricCanvas.dispose();
      fabricRef.current = null;
      if (fabricCanvasRef) fabricCanvasRef.current = null;
    };
  }, [width, height]); // Only depend on logical dimensions

  // Update tool dynamically without recreating canvas
  useEffect(() => {
    const fabricCanvas = fabricRef.current;
    if (!fabricCanvas) return;

    // Clear any existing shape tool event handlers
    fabricCanvas.off('mouse:down');
    fabricCanvas.off('mouse:move'); 
    fabricCanvas.off('mouse:up');

    if (tool === "pen" || tool === "eraser") {
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = tool === "eraser" ? "#fff" : color;
      fabricCanvas.freeDrawingBrush.width = tool === "eraser" ? 16 : 2;
    } else {
      fabricCanvas.isDrawingMode = false;
      
      if (tool === 'rectangle' || tool === 'ellipse' || tool === 'line') {
        // Shape tool implementation
        let isDrawing = false;
        let shape: fabric.Object | null = null;
        let origX = 0;
        let origY = 0;

        const onMouseDown = (opt: fabric.IEvent) => {
          isDrawing = true;
          const pointer = fabricCanvas.getPointer(opt.e);
          origX = pointer.x;
          origY = pointer.y;
          
          if (tool === 'rectangle') {
            shape = new fabric.Rect({
              left: origX,
              top: origY,
              width: 0,
              height: 0,
              fill: 'rgba(0,0,0,0)',
              stroke: color,
              strokeWidth: 2,
              selectable: false,
              evented: false,
              hasControls: false,
              hasBorders: false,
              lockMovementX: true,
              lockMovementY: true,
              hoverCursor: 'default',
              moveCursor: 'default'
            });
          } else if (tool === 'ellipse') {
            shape = new fabric.Ellipse({
              left: origX,
              top: origY,
              rx: 0,
              ry: 0,
              fill: 'rgba(0,0,0,0)',
              stroke: color,
              strokeWidth: 2,
              selectable: false,
              evented: false,
              hasControls: false,
              hasBorders: false,
              lockMovementX: true,
              lockMovementY: true,
              hoverCursor: 'default',
              moveCursor: 'default'
            });
          } else if (tool === 'line') {
            shape = new fabric.Line([origX, origY, origX, origY], {
              stroke: color,
              strokeWidth: 2,
              selectable: false,
              evented: false,
              hasControls: false,
              hasBorders: false,
              lockMovementX: true,
              lockMovementY: true,
              hoverCursor: 'default',
              moveCursor: 'default'
            });
          }
          
          if (shape) fabricCanvas.add(shape);
        };

        const onMouseMove = (opt: fabric.IEvent) => {
          if (!isDrawing || !shape) return;
          const pointer = fabricCanvas.getPointer(opt.e);
          
          if (tool === 'rectangle' && shape instanceof fabric.Rect) {
            shape.set({
              width: Math.abs(pointer.x - origX),
              height: Math.abs(pointer.y - origY),
              left: Math.min(pointer.x, origX),
              top: Math.min(pointer.y, origY),
            });
          } else if (tool === 'ellipse' && shape instanceof fabric.Ellipse) {
            shape.set({
              rx: Math.abs(pointer.x - origX) / 2,
              ry: Math.abs(pointer.y - origY) / 2,
              left: Math.min(pointer.x, origX),
              top: Math.min(pointer.y, origY),
            });
          } else if (tool === 'line' && shape instanceof fabric.Line) {
            shape.set({ x2: pointer.x, y2: pointer.y });
          }
          
          fabricCanvas.renderAll();
        };

        const onMouseUp = () => {
          if (isDrawing && shape) {
            // Apply comprehensive non-selectable and non-interactive properties
            shape.set({ 
              selectable: false,
              evented: false,
              hasControls: false,
              hasBorders: false,
              lockMovementX: true,
              lockMovementY: true,
              hoverCursor: 'default',
              moveCursor: 'default'
            });
            shape = null;
            isDrawing = false;
            // Save state after shape is finished
            saveState(fabricCanvas.toDatalessJSON());
          }
        };

        fabricCanvas.on('mouse:down', onMouseDown);
        fabricCanvas.on('mouse:move', onMouseMove);
        fabricCanvas.on('mouse:up', onMouseUp);
      }
    }

    // Ensure no objects are selectable when switching tools
    makeAllObjectsNonSelectable(fabricCanvas);

  }, [tool, color]); // Update when tool or color changes

  return (
    <div
      ref={containerRef}
      className="bg-white border-2 border-blue-200 rounded-lg shadow-lg flex items-center justify-center w-full overflow-auto"
      style={{ 
        boxSizing: 'border-box',
        minHeight: height + 50,
        padding: '20px'
      }}
    >
      <canvas
        ref={canvasRef}
        id="whiteboard-canvas"
        className="rounded-lg cursor-crosshair"
        style={{ 
          width: width + 'px', 
          height: height + 'px'
        }}
      />
    </div>
  );
};

export default WhiteboardCanvas;
