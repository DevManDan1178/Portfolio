import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Preload } from '@react-three/drei'
import * as random from 'maath/random'
import type  { Points as ThreePoints } from 'three'

const X_ROTATION_VELOCITY = -0.1
const Y_ROTATION_VELOCITY = 0.075

const Stars = (props : any) => {
  const ref = useRef<ThreePoints>(null!)
  const sphere = random.inSphere(new Float32Array(3000), {radius : 5})

  useFrame((_state, delta) => {
    ref.current.rotation.x += delta * X_ROTATION_VELOCITY
    ref.current.rotation.y += delta * Y_ROTATION_VELOCITY
  })  

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          opacity={.95}
          size={0.01}
          sizeAttenuation
          depthWrite={false}
        />

      </Points>
    </group>
  )
}

const StarsCanvas = () => {
  return (
    <div className='w-full h-full absolute inset-0 z-[-1]'>
      <Canvas camera={{position:[0, 0, 0]}}>
        <Suspense fallback={null}>
          <Stars/>
        </Suspense>
        <Preload all/>
      </Canvas>
    </div>
  )
}


export default StarsCanvas