"use client"

import { useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { Text, Box } from "@react-three/drei"

interface BookHotspotProps {
  bookId: string
  position: [number, number, number]
  onInteract: (bookId: string) => void
}

export default function BookHotspot({ bookId, position, onInteract }: BookHotspotProps) {
  const { camera, raycaster, pointer } = useThree()
  const [isHovered, setIsHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!meshRef.current) return

    // Simple rotation animation
    meshRef.current.rotation.y += 0.01
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    onInteract(bookId)
  }

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[0.3, 0.5, 0.1]}
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
        <meshStandardMaterial 
          color={isHovered ? "#ff6b6b" : "#8B0000"}
          emissive={isHovered ? "#ff6b6b" : "#8B0000"}
          emissiveIntensity={isHovered ? 0.5 : 0.2}
        />
      </Box>
      {isHovered && (
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          Click to read
        </Text>
      )}
    </group>
  )
}

