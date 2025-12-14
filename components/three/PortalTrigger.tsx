"use client"

import { useRouter } from "next/navigation"
import { Box } from "@react-three/drei"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function PortalTrigger() {
  const router = useRouter()
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  const handleClick = () => {
    router.push("/interior")
  }

  return (
    <Box
      ref={meshRef}
      args={[2, 3, 0.5]}
      position={[0, 1.5, -5]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default"
      }}
    >
      <meshStandardMaterial color="orange" transparent opacity={0.7} />
    </Box>
  )
}

