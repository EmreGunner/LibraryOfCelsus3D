"use client"

import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"

export function usePerformanceMonitor() {
  const fpsRef = useRef<number[]>([])
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())

  useFrame(() => {
    frameCount.current++
    const now = performance.now()
    const elapsed = now - lastTime.current

    if (elapsed >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / elapsed)
      fpsRef.current.push(fps)
      if (fpsRef.current.length > 60) {
        fpsRef.current.shift()
      }
      frameCount.current = 0
      lastTime.current = now
    }
  })

  const getAverageFPS = () => {
    if (fpsRef.current.length === 0) return 0
    const sum = fpsRef.current.reduce((a, b) => a + b, 0)
    return Math.round(sum / fpsRef.current.length)
  }

  const getMinFPS = () => {
    if (fpsRef.current.length === 0) return 0
    return Math.min(...fpsRef.current)
  }

  return { getAverageFPS, getMinFPS }
}

export function detectDeviceCapability() {
  if (typeof window === "undefined") return "high"

  const canvas = document.createElement("canvas")
  const gl = canvas.getContext("webgl") || canvas.getContext("webgl2")

  if (!gl) return "low"

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
  const renderer = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    : "unknown"

  // Check for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  // Check for low-end indicators
  const deviceMemory = (navigator as any).deviceMemory as number | undefined
  const isLowEnd =
    isMobile ||
    navigator.hardwareConcurrency < 4 ||
    (deviceMemory && deviceMemory < 4)

  if (isLowEnd) return "low"
  if (isMobile) return "medium"
  return "high"
}

