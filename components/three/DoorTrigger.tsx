"use client"

import { useRouter } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { Text, Box } from "@react-three/drei"

interface DoorTriggerProps {
  position: [number, number, number]
  onEnter?: () => void
}

export default function DoorTrigger({ position, onEnter }: DoorTriggerProps) {
  const router = useRouter()
  const { camera } = useThree()
  const [isNear, setIsNear] = useState(false)
  const triggerRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!triggerRef.current || !camera) return

    const distance = camera.position.distanceTo(
      new THREE.Vector3(...position)
    )

    // Check if player is within 5 units of door (increased distance)
    if (distance < 5) {
      if (!isNear) setIsNear(true)
    } else {
      if (isNear) setIsNear(false)
    }
  })

  useEffect(() => {
    if (!isNear) return

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "f" && isNear) {
        if (onEnter) {
          onEnter()
        } else {
          router.push("/interior")
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isNear, onEnter, router])

  return (
    <group ref={triggerRef} position={position}>
      {/* Main door frame - black wooden door */}
      <Box
        args={[1.2, 2.8, 0.15]} // Width, Height, Depth - realistic door size
        position={[0, 1.4, 0]}
        onPointerOver={() => {
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default"
        }}
      >
        <meshStandardMaterial 
          color="#1a1a1a" // Very dark black
          metalness={0.1}
          roughness={0.8}
        />
      </Box>
      
      {/* Door panels for realistic look */}
      <Box
        args={[1.0, 0.4, 0.02]}
        position={[0, 1.8, 0.08]}
      >
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </Box>
      <Box
        args={[1.0, 0.4, 0.02]}
        position={[0, 1.4, 0.08]}
      >
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </Box>
      <Box
        args={[1.0, 0.4, 0.02]}
        position={[0, 1.0, 0.08]}
      >
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </Box>
      
      {/* Door handle */}
      <Box
        args={[0.05, 0.15, 0.05]}
        position={[0.45, 1.2, 0.1]}
      >
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Text on door - black text with white outline */}
      <Text
        position={[0, 1.4, 0.09]}
        fontSize={0.2}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#ffffff"
        maxWidth={0.85}
        textAlign="center"
      >
        Press F to enter
      </Text>
    </group>
  )
}

