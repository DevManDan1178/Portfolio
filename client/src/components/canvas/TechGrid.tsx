import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Decal, OrbitControls, Preload, useTexture } from '@react-three/drei'
import CanvasLoader from '../page/Loader'
import { MOUSE, Vector3, Spherical, type Mesh } from 'three'
import { animated, useSpring } from '@react-spring/three'
import type { NodeStatus, TechnologyNode } from '../page/Technologies'

const CAMERA_TARGET_DISTANCE : number = 100
const BALL_DISTANCE_FROM_CAMERA : number = 8.5
const BALL_SIDE_ROWS : number = 1
const BALL_ANGLE_STEP : number = 3.5 * Math.PI/180
const SOLVED_BALL_SPIN_SPEED : number = 0.5
const DEFAULT_BALL_SCALE = 3.5
const SOLVED_BALL_SCALE = 2.25
const DEFAULT_BALL_DECAL_SCALE = 1.15
const SOLVED_BALL_DECAL_SCALE = 1.25

const Ball = ({ icon, position, rotationY, status, onClick } : {icon : string, position : Vector3, rotationY : number, status : NodeStatus, onClick : () => (void)}) => {
  const [decal] = useTexture([icon])

  const { flip }= useSpring({
    flip : (status.selected || status.solved) ? 1 : 0,
    config: {mass:1, tension: 180, friction: 20}
  })
  
  const [solvedSpinRateX] = useState(
    () => Math.random() > 0.5 ? 0.70710678118 : -0.70710678118
  )

  const [solvedSpinRateY] = useState(
    () => Math.random() > 0.5 ? 0.70710678118 : -0.70710678118
  )
  const solvedSpin = useRef(0)

  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (!meshRef.current) return

    const baseRotation = flip.get() * Math.PI + rotationY

    if (!status.solved) {
      meshRef.current.rotation.y = baseRotation
      meshRef.current.rotation.x = 0
      return
    }

    solvedSpin.current += delta * SOLVED_BALL_SPIN_SPEED

    meshRef.current.rotation.y =
      baseRotation +
      solvedSpin.current * solvedSpinRateY

    meshRef.current.rotation.x =
      solvedSpin.current * solvedSpinRateX * flip.get()
  })

  
  return (
    <group position={position}>
        <animated.mesh
          castShadow
          receiveShadow
          scale={status.solved ? SOLVED_BALL_SCALE : DEFAULT_BALL_SCALE}
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
        >
        <boxGeometry args = {[1.5, 1.5, 1.5]}/>
        <meshStandardMaterial 
          color='#fff8eb'
          polygonOffset
          polygonOffsetFactor={-0.5}
          flatShading
        />
        <Decal 
          depthTest
          scale={status.solved ? SOLVED_BALL_DECAL_SCALE : DEFAULT_BALL_DECAL_SCALE}
          position = {[0, 0, 1]}
          rotation = {[0, 0, 0]}
          map = {decal}
        />
      </animated.mesh>
    </group>
  )
}

const getBallPositions : (totalIndices : number) => Vector3[] = (totalIndices : number) => {
  const getPosition = (x : number, y : number) => {
    const targetPosition = new Vector3(0, 0, -CAMERA_TARGET_DISTANCE)
    const theta = x * BALL_ANGLE_STEP; // horizontal rotation
    const phi = y * BALL_ANGLE_STEP;   // vertical rotation

    const spherical = new Spherical(
    CAMERA_TARGET_DISTANCE - BALL_DISTANCE_FROM_CAMERA, // radius (fixed distance)
    phi + Math.PI / 2,         // polar angle (vertical)
    theta                       // azimuthal angle (horizontal)
    )
    const pos = new Vector3().setFromSpherical(spherical)
    return pos.add(targetPosition)
  }
  
  const ballPositions : Vector3[] = []
  const sideRowCount = 2 * BALL_SIDE_ROWS
  const sideRowBallCount = Math.round(totalIndices / (sideRowCount + 1) + (totalIndices % sideRowCount == 0 ? 0 : 1))
  const middleRowBallCount = totalIndices - sideRowCount * sideRowBallCount
  const midPointX = (sideRowBallCount - 1) * 0.5
  const midPointY = BALL_SIDE_ROWS
  //Top
  for (let rowIdx = 0; rowIdx < BALL_SIDE_ROWS; rowIdx++) {  
    const rowY = rowIdx - midPointY
    for (let ballIdx = 0; ballIdx < sideRowBallCount; ballIdx++) {
      const ballX = ballIdx - midPointX
      ballPositions[rowIdx * sideRowBallCount + ballIdx] = getPosition(ballX, rowY)
    }
  }
  //Middle
  const leftoverMidpointX = (middleRowBallCount - 1) * 0.5
  for (let ballIdx = 0; ballIdx < middleRowBallCount; ballIdx++) {
    ballPositions[BALL_SIDE_ROWS * sideRowBallCount + ballIdx] = getPosition(ballIdx - leftoverMidpointX, 0)
  }
  //Bottom
  for (let rowIdx = BALL_SIDE_ROWS; rowIdx < sideRowCount; rowIdx++) {  
    const rowY = rowIdx + 1 - midPointY
    for (let ballIdx = 0; ballIdx < sideRowBallCount; ballIdx++) {
      const ballX = ballIdx - midPointX
      ballPositions[middleRowBallCount + rowIdx * sideRowBallCount + ballIdx] = getPosition(ballX, rowY)
    }
  }
  return ballPositions
}

const getDecalRotationYForBallAtPosition : (ballPosition : Vector3) => (number) = (ballPosition: Vector3) => {
  if (!ballPosition) {
    return 0
  }
  const target = new Vector3(0, 0, -CAMERA_TARGET_DISTANCE);

  const dir = new Vector3()
    .subVectors(ballPosition, target)
    .normalize();

  return Math.atan2(dir.x, dir.z) + Math.PI;
};

export default function(
  { technologies, getOnClick } : {technologies : TechnologyNode[], 
  getOnClick : (index : number) => (() => (void))
}) {
  const [ballPositions, setBallPositions] = useState<Vector3[]>(getBallPositions(technologies.length))
  const maxCameraAngleX = Math.round(ballPositions.length / (2 * BALL_SIDE_ROWS + 1)) * BALL_ANGLE_STEP * 0.5
  const maxCameraAngleY = BALL_SIDE_ROWS * BALL_ANGLE_STEP
  if (technologies.length != ballPositions.length) {
    setBallPositions(getBallPositions(technologies.length))
  }
  return (<Canvas
      gl={{ preserveDrawingBuffer: true }}
    >
      {
      technologies.map((technologyNode : TechnologyNode, index : number) => {
        const ballPosition : Vector3 = ballPositions[index]
        return <Ball 
          icon ={technologyNode.technology.icon} 
          position={ballPosition} 
          rotationY={getDecalRotationYForBallAtPosition(ballPosition)} 
          status={technologyNode.status}
          key={index}
          onClick={getOnClick(index)}
        />
      })

      }
      <ambientLight intensity={0.65}/>
      <directionalLight position={[0,0,0.05]}/>

      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls 
          target={[0, 0, -CAMERA_TARGET_DISTANCE]}
          mouseButtons={{RIGHT: MOUSE.ROTATE, LEFT : MOUSE.ROTATE}}
          enableZoom={false}
          enablePan={false}
          enableRotate
          rotateSpeed={0.025}
          
          maxPolarAngle={Math.PI/2 + maxCameraAngleY}
          minPolarAngle={Math.PI/2 - maxCameraAngleY} 
          maxAzimuthAngle={maxCameraAngleX}
          minAzimuthAngle={-maxCameraAngleX}
        />
        
      </Suspense>
      <Preload all />
  </Canvas>
  )}
