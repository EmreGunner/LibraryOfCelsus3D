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
      {/* Rectangular door shape - realistic door size (1m wide, 2.5m tall) */}
      <Box
        args={[1, 2.5, 0.15]}
        position={[0, 1.25, 0]}
        onPointerOver={() => {
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default"
        }}
      >
        <meshStandardMaterial 
          color={isNear ? "#00ff00" : "#ffaa00"} 
          emissive={isNear ? "#00ff00" : "#ffaa00"}
          emissiveIntensity={0.6}
          transparent
          opacity={0.85}
        />
      </Box>
      
      {/* Text directly on the door rectangle - smaller font to fit */}
      <Text
        position={[0, 1.25, 0.08]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="black"
        maxWidth={0.9}
        textAlign="center"
      >
        Press F to enter to library
      </Text>
    </group>
  )
}

