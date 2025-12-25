"use client"

import { Suspense, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useRouter } from "next/navigation"
import * as THREE from "three"
import LibraryModel from "@/components/three/LibraryModel"
import DoorTrigger from "@/components/three/DoorTrigger"
import Environment from "@/components/three/Environment"
import DesktopControls from "@/components/controls/DesktopControls"
import CameraDebug from "@/components/ui/camera-debug"
import CameraDebugOverlay from "@/components/ui/camera-debug-overlay"
import LoadingOverlay from "@/components/ui/loading-overlay"
import PerformanceMonitor from "@/components/ui/performance-monitor"

function SceneContent({ 
  onPositionUpdate,
  onDoorEnter 
}: { 
  onPositionUpdate: (pos: { x: number; y: number; z: number }) => void
  onDoorEnter: () => void
}) {
  return (
    <>
      <CameraDebug onPositionUpdate={onPositionUpdate} />
      <DesktopControls />
      {/* Bright, clear lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.0}
        castShadow={false}
      />
      {/* Additional light for clarity */}
      <hemisphereLight intensity={0.5} />
      {/* OrbitControls disabled - using first-person controls instead */}
      <Suspense fallback={null}>
        <LibraryModel />
      </Suspense>
      {/* Door trigger at ground level near entrance */}
      <DoorTrigger position={[-1.94, -5, 6.38]} onEnter={onDoorEnter} />
    </>
  )
}

export default function Home() {
  const router = useRouter()
  const [cameraPosition, setCameraPosition] = useState({ x: 0.51, y: -5, z: 18.38 })
  const [cameraRef, setCameraRef] = useState<any>(null)
  const [showLumaEmbed, setShowLumaEmbed] = useState(true)

  // Hide iframe when user interacts
  useEffect(() => {
    const handleInteraction = () => {
      setShowLumaEmbed(false)
    }

    // Listen for any user interaction
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'wheel']
    events.forEach(event => {
      window.addEventListener(event, handleInteraction, { once: true })
    })

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleInteraction)
      })
    }
  }, [])

  const handlePositionChange = (axis: "x" | "y" | "z", value: number) => {
    if (cameraRef) {
      if (axis === "x") cameraRef.position.x = value
      if (axis === "y") cameraRef.position.y = value
      if (axis === "z") cameraRef.position.z = value
      setCameraPosition({
        x: parseFloat(cameraRef.position.x.toFixed(2)),
        y: parseFloat(cameraRef.position.y.toFixed(2)),
        z: parseFloat(cameraRef.position.z.toFixed(2)),
      })
    }
  }

  const handleDoorEnter = () => {
    router.push("/interior")
  }

  return (
    <main className="w-full h-screen relative">
      {/* Luma Labs embed overlay - shows by default, hides on user interaction */}
      {showLumaEmbed && (
        <div className="absolute inset-0 z-50 bg-black">
          <iframe
            src="https://lumalabs.ai/embed/8bc305c2-53f1-4e81-b58a-1e5ce537a716?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false"
            width="100%"
            height="100%"
            frameBorder="0"
            title="luma embed"
            style={{ border: "none" }}
          />
        </div>
      )}
      <Canvas 
        camera={{ position: [0.51, -5, 18.38], fov: 50 }}
        gl={{ 
          antialias: true, 
          toneMappingExposure: 1.2,
          outputColorSpace: "srgb"
        }}
        onCreated={({ camera, gl: renderer }) => {
          renderer.toneMapping = THREE.ACESFilmicToneMapping
          setCameraRef(camera)
        }}
      >
        <color attach="background" args={["#000000"]} />
        <SceneContent 
          onPositionUpdate={setCameraPosition} 
          onDoorEnter={handleDoorEnter}
        />
      </Canvas>
      <CameraDebugOverlay 
        position={cameraPosition} 
        onPositionChange={handlePositionChange}
      />
      <LoadingOverlay />
      <PerformanceMonitor />
    </main>
  )
}

