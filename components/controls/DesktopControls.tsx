"use client"

import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function DesktopControls() {
  const { camera, gl } = useThree()
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"))
  const isMouseDown = useRef(false)
  const lastMousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!camera) return

    // Initialize camera rotation
    euler.current.setFromQuaternion(camera.quaternion)

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "w":
          moveState.current.forward = true
          break
        case "s":
          moveState.current.backward = true
          break
        case "a":
          moveState.current.left = true
          break
        case "d":
          moveState.current.right = true
          break
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "w":
          moveState.current.forward = false
          break
        case "s":
          moveState.current.backward = false
          break
        case "a":
          moveState.current.left = false
          break
        case "d":
          moveState.current.right = false
          break
      }
    }

    const handleMouseDown = (event: MouseEvent) => {
      isMouseDown.current = true
      lastMousePos.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = () => {
      isMouseDown.current = false
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDown.current) return

      const deltaX = event.clientX - lastMousePos.current.x
      const deltaY = event.clientY - lastMousePos.current.y

      euler.current.setFromQuaternion(camera.quaternion)
      euler.current.y -= deltaX * 0.003
      euler.current.x -= deltaY * 0.003

      // Clamp vertical rotation
      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x))

      camera.quaternion.setFromEuler(euler.current)
      lastMousePos.current = { x: event.clientX, y: event.clientY }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    gl.domElement.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      gl.domElement.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [camera, gl])

  useFrame((state, delta) => {
    if (!camera) return

    const speed = 5 * delta
    const direction = new THREE.Vector3()

    // Calculate movement direction based on camera orientation
    if (moveState.current.forward) {
      direction.z -= 1
    }
    if (moveState.current.backward) {
      direction.z += 1
    }
    if (moveState.current.left) {
      direction.x -= 1
    }
    if (moveState.current.right) {
      direction.x += 1
    }

    if (direction.length() > 0) {
      direction.normalize()
      direction.multiplyScalar(speed)

      // Apply movement relative to camera rotation (only Y axis for horizontal movement)
      const horizontalEuler = new THREE.Euler(0, euler.current.y, 0, "YXZ")
      direction.applyEuler(horizontalEuler)

      // Store current position
      const currentPos = camera.position.clone()
      const newPos = currentPos.clone().add(direction)

      // Check for wall collisions before moving
      const raycaster = new THREE.Raycaster()
      const meshes: THREE.Mesh[] = []
      state.scene.traverse((object) => {
        if (object instanceof THREE.Mesh && object.visible) {
          meshes.push(object)
        }
      })

      // Check collision at player height (capsule-like collision)
      const playerHeight = 1.6
      const playerRadius = 0.3
      const checkPoints = [
        new THREE.Vector3(newPos.x, newPos.y, newPos.z), // Center
        new THREE.Vector3(newPos.x, newPos.y + playerHeight * 0.5, newPos.z), // Top
        new THREE.Vector3(newPos.x, newPos.y - playerHeight * 0.5, newPos.z), // Bottom
      ]

      let canMove = true
      for (const point of checkPoints) {
        raycaster.set(point, direction.clone().normalize())
        const intersects = raycaster.intersectObjects(meshes, false)
        for (const intersect of intersects) {
          if (intersect.distance < playerRadius + 0.1) {
            canMove = false
            break
          }
        }
        if (!canMove) break
      }

      if (canMove) {
        // Move horizontally
        camera.position.x = newPos.x
        camera.position.z = newPos.z

        // Raycast down to find ground/stairs - start from higher up
        raycaster.set(
          new THREE.Vector3(camera.position.x, camera.position.y + 10, camera.position.z),
          new THREE.Vector3(0, -1, 0)
        )

        if (meshes.length > 0) {
          const intersects = raycaster.intersectObjects(meshes, false)

          if (intersects.length > 0) {
            // Place camera at human height (1.6m) above the ground
            const groundHeight = intersects[0].point.y
            camera.position.y = groundHeight + 1.6
          } else {
            // If no ground found, try a shorter raycast
            raycaster.set(
              new THREE.Vector3(camera.position.x, camera.position.y + 2, camera.position.z),
              new THREE.Vector3(0, -1, 0)
            )
            const shortIntersects = raycaster.intersectObjects(meshes, false)
            if (shortIntersects.length > 0) {
              const groundHeight = shortIntersects[0].point.y
              camera.position.y = groundHeight + 1.6
            }
          }
        }
      }
    } else {
      // Even when not moving, keep camera on ground
      const raycaster = new THREE.Raycaster()
      raycaster.set(
        new THREE.Vector3(camera.position.x, camera.position.y + 10, camera.position.z),
        new THREE.Vector3(0, -1, 0)
      )

      const meshes: THREE.Mesh[] = []
      state.scene.traverse((object) => {
        if (object instanceof THREE.Mesh && object.visible) {
          meshes.push(object)
        }
      })

      if (meshes.length > 0) {
        const intersects = raycaster.intersectObjects(meshes, false)
        if (intersects.length > 0) {
          const groundHeight = intersects[0].point.y
          const targetY = groundHeight + 1.6
          // Smoothly adjust Y position
          camera.position.y += (targetY - camera.position.y) * 0.1
        }
      }
    }
  })

  return null
}

