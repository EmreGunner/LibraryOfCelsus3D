"use client"

import { Suspense, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useRouter } from "next/navigation"
import InteriorScene from "@/components/scenes/InteriorScene"
import BookPopup from "@/components/ui/book-popup"
import LoadingOverlay from "@/components/ui/loading-overlay"
import type { Book } from "@/lib/data/types"

export default function InteriorPage() {
  const router = useRouter()
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  return (
    <main className="w-full h-screen relative">
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 right-4 z-50 bg-black bg-opacity-70 text-white px-4 py-2 rounded hover:bg-opacity-90"
      >
        ← Back to Exterior
      </button>
      <Canvas
        camera={{ position: [0, 1.6, 5], fov: 50 }}
        gl={{ 
          antialias: true, 
          outputColorSpace: "srgb",
          toneMappingExposure: 1.1
        }}
        shadows
      >
        <color attach="background" args={["#0a0a0a"]} />
        {/* Atmospheric fog for mysterious feel */}
        <fog attach="fog" args={["#0a0a0a", 8, 25]} />
        {/* Enhanced lighting setup for better book visibility */}
        <ambientLight intensity={0.4} color="#ffffff" />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.5} 
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />
        {/* Fill light from opposite side */}
        <directionalLight position={[-3, 6, -3]} intensity={0.6} color="#fff8e1" />
        {/* Rim light for depth */}
        <directionalLight position={[0, 2, -5]} intensity={0.4} color="#e0e0ff" />
        <OrbitControls
          minDistance={2}
          maxDistance={20}
          enablePan={true}
          enableDamping={true}
          target={[0, 1.6, -2]}
        />
        <Suspense fallback={null}>
          <InteriorScene onBookInteract={setSelectedBook} />
        </Suspense>
      </Canvas>
      <BookPopup book={selectedBook} onClose={() => setSelectedBook(null)} />
      <LoadingOverlay />
    </main>
  )
}

