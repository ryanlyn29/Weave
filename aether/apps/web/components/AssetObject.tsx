'use client'

import { useMemo } from 'react'
import { Asset } from '../../../packages/shared/types'
import * as THREE from 'three'

interface AssetObjectProps {
  asset: Asset
}

export function AssetObject({ asset }: AssetObjectProps) {
  const color = useMemo(() => {
    return new THREE.Color(asset.color || '#ff6b6b')
  }, [asset.color])

  // Simple geometry based on asset type
  const geometry = useMemo(() => {
    switch (asset.type.toLowerCase()) {
      case 'sphere':
        return <sphereGeometry args={[asset.scale.x, 32, 32]} />
      case 'cylinder':
        return <cylinderGeometry args={[asset.scale.x, asset.scale.x, asset.scale.y, 32]} />
      default:
        return <boxGeometry args={[asset.scale.x, asset.scale.y, asset.scale.z]} />
    }
  }, [asset.type, asset.scale])

  return (
    <mesh
      position={[asset.position.x, asset.position.y, asset.position.z]}
      castShadow
      receiveShadow
    >
      {geometry}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  )
}


