"use client"

import { Grid } from "@react-three/drei"
import LibraryModel from "@/components/three/LibraryModel"
import Environment from "@/components/three/Environment"

export default function ExteriorScene() {
  return (
    <>
      <color attach="background" args={["#87CEEB"]} />
      <ambientLight intensity={0.3} />
      <Environment />
      <Grid
        args={[100, 100]}
        cellColor="#6f6f6f"
        sectionColor="#9d4b4b"
        cellThickness={0.5}
        sectionThickness={1}
        fadeDistance={50}
        fadeStrength={1}
      />
      <LibraryModel />
    </>
  )
}

