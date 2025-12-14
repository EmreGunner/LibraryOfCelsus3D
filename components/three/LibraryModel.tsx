"use client"

import { useGLTF } from "@react-three/drei"
import { useMemo, useRef } from "react"
import * as THREE from "three"

export default function LibraryModel() {
  const { scene } = useGLTF("/models/library-exterior.glb")
  const groupRef = useRef<THREE.Group>(null)

  const clonedScene = useMemo(() => {
    const cloned = scene.clone()
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
        
        // Fix materials for proper rendering
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material]
          
          materials.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
              mat.needsUpdate = true
              // Ensure proper color space
              if (mat.map) {
                mat.map.colorSpace = "srgb"
                mat.map.needsUpdate = true
                mat.map.flipY = false
              }
              if (mat.normalMap) {
                mat.normalMap.needsUpdate = true
                mat.normalMap.flipY = false
              }
              if (mat.roughnessMap) {
                mat.roughnessMap.needsUpdate = true
                mat.roughnessMap.flipY = false
              }
              if (mat.metalnessMap) {
                mat.metalnessMap.needsUpdate = true
                mat.metalnessMap.flipY = false
              }
              // Fix rendering issues
              mat.side = THREE.FrontSide
              mat.flatShading = false
            }
          })
        }
        
        // Ensure geometry is properly set up
        if (child.geometry) {
          child.geometry.computeVertexNormals()
          child.geometry.computeBoundingBox()
        }
      }
    })
    return cloned
  }, [scene])

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  )
}
