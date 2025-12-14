"use client"

import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

interface CameraDebugProps {
  onPositionUpdate: (pos: { x: number; y: number; z: number }) => void
}

export default function CameraDebug({ onPositionUpdate }: CameraDebugProps) {
  const positionRef = useRef({ x: 0, y: 0, z: 0 })

  useFrame(({ camera }) => {
    const newPos = {
      x: parseFloat(camera.position.x.toFixed(2)),
      y: parseFloat(camera.position.y.toFixed(2)),
      z: parseFloat(camera.position.z.toFixed(2)),
    }
    if (
      newPos.x !== positionRef.current.x ||
      newPos.y !== positionRef.current.y ||
      newPos.z !== positionRef.current.z
    ) {
      positionRef.current = newPos
      onPositionUpdate(newPos)
    }
  })

  return null
}
