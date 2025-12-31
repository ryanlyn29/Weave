'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { User } from '../../../packages/shared/types'

interface UserCubeProps {
  user: User
  isCurrentUser: boolean
}

export function UserCube({ user, isCurrentUser }: UserCubeProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(user.position.x, user.position.y, user.position.z)
    }
  })

  return (
    <mesh ref={meshRef} position={[user.position.x, user.position.y, user.position.z]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={isCurrentUser ? '#00ff00' : '#0066ff'}
        emissive={isCurrentUser ? '#00ff00' : '#0066ff'}
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}


