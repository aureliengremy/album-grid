"use client";

import { GridEditor } from "./GridEditor";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function CanvasArea() {
  return (
    <div className="flex-1 relative flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
      {/* 
        We use a ScrollArea to allow the canvas to be larger than viewport.
        However, for a nice editor feel, we might want centering.
        The default ScrollArea from shadcn might need tweaking to center content if smaller than viewport.
        We'll wrap GridEditor in a container that has min sizes.
      */}
      <div className="w-full h-[calc(100vh-64px)] p-8 flex items-center justify-center overflow-hidden">
         <div className="relative w-full h-full flex items-center justify-center">
           <GridEditor />
         </div>
      </div>
    </div>
  );
}
