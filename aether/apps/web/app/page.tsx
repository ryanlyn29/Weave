'use client'

import { Canvas } from '@react-three/fiber'
import { AetherScene } from '@/components/AetherScene'
import { UI } from '@/components/UI'

export default function Home() {
  return (
    <main className="w-screen h-screen relative">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <AetherScene />
      </Canvas>
      <UI />
    </main>
  )
}


