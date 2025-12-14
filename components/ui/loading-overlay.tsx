"use client"

import { useProgress } from "@react-three/drei"
import { useEffect, useState } from "react"

export default function LoadingOverlay() {
  const { progress, active } = useProgress()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!active && progress === 100) {
      const timer = setTimeout(() => setVisible(false), 500)
      return () => clearTimeout(timer)
    }
    setVisible(active || progress < 100)
  }, [active, progress])

  if (!visible) return null

  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="text-center text-white">
        <div className="text-2xl mb-4">Loading Library of Celsus...</div>
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-sm">{Math.round(progress)}%</div>
      </div>
    </div>
  )
}

