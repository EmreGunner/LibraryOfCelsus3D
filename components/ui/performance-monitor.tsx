"use client"

import { useEffect, useState, useRef } from "react"

export default function PerformanceMonitor() {
  const [show, setShow] = useState(false)
  const [fps, setFps] = useState(0)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const fpsHistory = useRef<number[]>([])

  useEffect(() => {
    // Toggle with P key
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "p" && e.ctrlKey) {
        setShow((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  useEffect(() => {
    if (!show) return

    let animationFrame: number
    const measureFPS = () => {
      frameCount.current++
      const now = performance.now()
      const elapsed = now - lastTime.current

      if (elapsed >= 1000) {
        const currentFPS = Math.round((frameCount.current * 1000) / elapsed)
        fpsHistory.current.push(currentFPS)
        if (fpsHistory.current.length > 60) {
          fpsHistory.current.shift()
        }

        const avg = fpsHistory.current.length > 0
          ? Math.round(fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length)
          : currentFPS
        const min = fpsHistory.current.length > 0
          ? Math.min(...fpsHistory.current)
          : currentFPS

        setFps(avg)
        frameCount.current = 0
        lastTime.current = now
      }

      animationFrame = requestAnimationFrame(measureFPS)
    }

    animationFrame = requestAnimationFrame(measureFPS)
    return () => cancelAnimationFrame(animationFrame)
  }, [show])

  if (!show) return null

  return (
    <div className="absolute top-20 left-4 bg-black bg-opacity-70 text-green-400 p-4 rounded font-mono text-sm z-50 border border-green-500">
      <div className="mb-2 font-bold text-green-300">Performance</div>
      <div className="space-y-1">
        <div>Avg FPS: {fps}</div>
      </div>
      <div className="mt-2 text-xs text-green-500">Press Ctrl+P to toggle</div>
    </div>
  )
}

