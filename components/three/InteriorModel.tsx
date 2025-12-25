"use client"

import { useGLTF } from "@react-three/drei"
import { useMemo } from "react"
import * as THREE from "three"

useGLTF.preload("/models/library-interior.glb")

export default function InteriorModel() {
  const { scene } = useGLTF("/models/library-interior.glb")

  const clonedScene = useMemo(() => {
    const cloned = scene.clone()
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false
        child.receiveShadow = false
        if (child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material]
          materials.forEach((mat) => {
            if (
              mat instanceof THREE.MeshStandardMaterial ||
              mat instanceof THREE.MeshPhysicalMaterial
            ) {
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

  return (
    <primitive 
      object={clonedScene} 
      scale={[3, 3, 3]}
      position={[0, 0, -2]}
    />
  )
}


