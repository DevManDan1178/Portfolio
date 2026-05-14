import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader, Points } from 'three'
import { useEffect, useMemo, useRef } from 'react'

const PARTICLE_TEXTURE_PATH = '/images/Star.png'

const ROTATION_SPEED_Y = (Math.random() - 0.5) * 0.015
const ROTATION_SPEED_X = (Math.random() - 0.5) * 0.01

const MOUSE_STRENGTH = 0.25

function Particles() {
  const texture = useLoader(TextureLoader, PARTICLE_TEXTURE_PATH)

  const pointsRef = useRef<Points>(null!)

  const mouse = useRef({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    if (window.innerWidth < 768) return

    const handleMouseMove = (e: MouseEvent) =>
    {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () =>
    {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const positions = useMemo(() =>
  {
    const isMobile = window.innerWidth < 768
    const count = isMobile ? 80 : 180

    const arr = new Float32Array(count * 3)

    for (let i = 0; i < count * 3; i++)
    {
      arr[i] = (Math.random() - 0.5) * 14
    }

    return arr
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return


    pointsRef.current.rotation.y += delta * ROTATION_SPEED_Y
    pointsRef.current.rotation.x += delta * ROTATION_SPEED_X


    pointsRef.current.rotation.y +=
      (mouse.current.x * MOUSE_STRENGTH) * 0.002

    pointsRef.current.rotation.x +=
      (mouse.current.y * MOUSE_STRENGTH) * 0.002
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        map={texture}
        color="#ffffff"
        size={0.125}
        transparent
        opacity={0.25}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

export default function BackgroundCircles() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden will-change-transform">
      <Canvas
        camera={{ position: [0, 0, 5] }}
        dpr={[1, 1]}
        gl={{
         antialias: false,
          alpha: true,
         powerPreference: 'high-performance',
        }}
      >
        <Particles />
      </Canvas>
    </div>
  )
}