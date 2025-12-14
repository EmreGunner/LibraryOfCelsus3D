"use client"

import { useEffect, useState } from "react"

interface CameraDebugOverlayProps {
  position: { x: number; y: number; z: number }
  onPositionChange: (axis: "x" | "y" | "z", value: number) => void
}

export default function CameraDebugOverlay({ position, onPositionChange }: CameraDebugOverlayProps) {
  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-green-400 p-4 rounded font-mono text-sm z-50 border border-green-500">
      <div className="mb-2 font-bold text-green-300">Camera Position (Live)</div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="w-6 text-green-500">X:</label>
          <input
            type="number"
            step="0.1"
            value={position.x}
            onChange={(e) => onPositionChange("x", parseFloat(e.target.value) || 0)}
            className="bg-black border border-green-500 text-green-400 px-2 py-1 w-28 rounded"
          />
          <span className="text-xs text-green-600">{position.x}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="w-6 text-green-500">Y:</label>
          <input
            type="number"
            step="0.1"
            value={position.y}
            onChange={(e) => onPositionChange("y", parseFloat(e.target.value) || 0)}
            className="bg-black border border-green-500 text-green-400 px-2 py-1 w-28 rounded"
          />
          <span className="text-xs text-green-600">{position.y}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="w-6 text-green-500">Z:</label>
          <input
            type="number"
            step="0.1"
            value={position.z}
            onChange={(e) => onPositionChange("z", parseFloat(e.target.value) || 0)}
            className="bg-black border border-green-500 text-green-400 px-2 py-1 w-28 rounded"
          />
          <span className="text-xs text-green-600">{position.z}</span>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-green-500">
        <div className="text-xs text-green-300">
          Drag camera or edit values
        </div>
      </div>
    </div>
  )
}

