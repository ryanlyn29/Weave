'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Mesh, Vector3 } from 'three'
import { useAetherStore } from '@/lib/store'
import { wsManager } from '@/lib/websocket'
import { Position } from '../../../packages/shared/types'
import { UserCube } from './UserCube'
import { AssetObject } from './AssetObject'

export function AetherScene() {
  const { camera } = useThree()
  const userId = useAetherStore((state) => state.userId)
  const users = useAetherStore((state) => state.users)
  const assets = useAetherStore((state) => state.assets)
  const currentUser = useAetherStore((state) => state.currentUser)
  const isConnected = useAetherStore((state) => state.isConnected)

  // Initialize user on mount
  useEffect(() => {
    if (!userId) {
      const newUserId = `user_${Date.now()}`
      const initialPosition: Position = { x: 0, y: 0, z: 0 }
      
      useAetherStore.getState().setUserId(newUserId)
      useAetherStore.getState().setCurrentUser({
        id: newUserId,
        position: initialPosition,
        chunkID: { chunkX: 0, chunkY: 0, chunkZ: 0 },
      })
      
      wsManager.connect(newUserId, initialPosition)
    }
  }, [userId])

  // Send position updates
  useFrame(() => {
    if (currentUser && isConnected) {
      const pos = camera.position
      const newPosition: Position = {
        x: pos.x,
        y: pos.y,
        z: pos.z,
      }

      // Only send if position changed significantly
      const threshold = 0.1
      const oldPos = currentUser.position
      if (
        Math.abs(newPosition.x - oldPos.x) > threshold ||
        Math.abs(newPosition.y - oldPos.y) > threshold ||
        Math.abs(newPosition.z - oldPos.z) > threshold
      ) {
        wsManager.sendPosition(newPosition)
        useAetherStore.getState().setCurrentUser({
          ...currentUser,
          position: newPosition,
        })
      }
    }
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
      />

      {/* Grid Helper */}
      <gridHelper args={[100, 100]} />

      {/* Render all users */}
      {Array.from(users.values()).map((user) => (
        <UserCube key={user.id} user={user} isCurrentUser={user.id === userId} />
      ))}

      {/* Render all assets */}
      {Array.from(assets.values()).map((asset) => (
        <AssetObject key={asset.id} asset={asset} />
      ))}
    </>
  )
}


