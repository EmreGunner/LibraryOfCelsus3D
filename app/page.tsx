"use client"

import { Suspense, useState } from "react"
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
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
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
    <main className="w-full h-screen">
      <Canvas 
        camera={{ position: [0.51, -5, 18.38], fov: 50 }}
        gl={{ 
          antialias: true, 
          toneMappingExposure: 1.2,
          outputColorSpace: "srgb"
        }}
        shadows
        onCreated={({ camera, gl: renderer }) => {
          renderer.toneMapping = THREE.ACESFilmicToneMapping
          setCameraRef(camera)
        }}
      >
        <color attach="background" args={["#87CEEB"]} />
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

