"use client"

import { useRef, useState, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import booksData from "@/lib/data/books.json"
import type { Book } from "@/lib/data/types"

// Preload GLB models
useGLTF.preload("/models/quran.glb")
useGLTF.preload("/models/torah.glb")

interface BookHotspotProps {
  bookId: string
  position: [number, number, number]
  onInteract: (bookId: string) => void
}

export default function BookHotspot({ bookId, position, onInteract }: BookHotspotProps) {
  const [isHovered, setIsHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  
  const book = (booksData as Book[]).find((b) => b.id === bookId)
  
  // Load the appropriate GLB model
  const modelPath = bookId === "quran" ? "/models/quran.glb" : "/models/torah.glb"
  const { scene } = useGLTF(modelPath)
  
  // Clone and prepare the model
  const clonedModel = useMemo(() => {
    const cloned = scene.clone()
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
        
        // Ensure materials are properly set up
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material]
          materials.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
              mat.needsUpdate = true
              if (mat.map) {
                mat.map.colorSpace = "srgb"
                mat.map.needsUpdate = true
              }
            }
          })
        }
      }
    })
    return cloned
  }, [scene])

  // Gentle floating animation
  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime
    groupRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.05
    groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.1
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    onInteract(bookId)
  }

  // Get scale from book data or use default
  const baseScale = book?.scale || 1
  const hoverScale = baseScale * 1.1

  return (
    <group 
      ref={groupRef} 
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setIsHovered(true)
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        setIsHovered(false)
        document.body.style.cursor = "default"
      }}
    >
      <primitive 
        object={clonedModel} 
        scale={isHovered ? hoverScale : baseScale}
      />
      
      {/* Subtle glow on hover */}
      {isHovered && (
        <pointLight
          position={[0, 0, 0]}
          intensity={1}
          color="#FFD700"
          distance={1}
        />
      )}
    </group>
  )
}
