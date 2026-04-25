import { Suspense, useRef, useState, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Decal, OrbitControls, Preload, useTexture } from '@react-three/drei'
import CanvasLoader from '../Loader'
import { MOUSE, Vector3, Spherical} from 'three'
import { animated, useSpring } from '@react-spring/three'
import type { NodeStatus, TechnologyNode } from '../Technologies'

const CAMERA_TARGET_DISTANCE : number = 100
const BALL_DISTANCE_FROM_CAMERA : number = 7.5
const BALL_SIDE_ROWS : number = 1
const BALL_ANGLE_STEP : number = 3.5 * Math.PI/180
const SOLVED_BALL_SPIN_SPEED : number = 0.5
const DEFAULT_BALL_SCALE = 2.75
const SOLVED_BALL_SCALE = 2.25
const SOLVED_BALL_DECAL_SCALE = 1.5

const Ball = ({ icon, position, rotationY, status, onClick } : {icon : string, position : Vector3, rotationY : number, status : NodeStatus, onClick : () => (void)}) => {
  const [decal] = useTexture([icon])
  const meshRef = useRef<HTMLDivElement | null>(null)
  
  const { flip }= useSpring({
    flip : (status.selected || status.solved) ? 1 : 0,
    config: {mass:1, tension: 180, friction: 20}
  })
  
  const [solvedSpin, setSolvedSpin]  = useState(0)
  const solvedSpinRateX = useRef(Math.random() > 0.5 ? 0.70710678118 : -0.70710678118)
  const solvedSpinRateY = useRef(Math.random() > 0.5 ? 0.70710678118 : -0.70710678118)

  useFrame((_, delta) => {
    if (!status.solved) {
      return
    }
    setSolvedSpin(solvedSpin + delta * SOLVED_BALL_SPIN_SPEED) 
  })

  return (
    <group position={position}>
        <animated.mesh 
        castShadow 
        receiveShadow
        scale={status.solved ? SOLVED_BALL_SCALE : DEFAULT_BALL_SCALE}
        ref={meshRef}
        rotation-y={flip.to((f : number) => f * Math.PI + rotationY + (status.solved ? solvedSpin * solvedSpinRateY.current : 0))}
        rotation-x={flip.to((f : number) => f * (status.solved ? solvedSpin * solvedSpinRateX.current : 0))}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
      >
        <icosahedronGeometry args = {[1, 1]}/>
        <meshStandardMaterial 
          color='#fff8eb'
          polygonOffset
          polygonOffsetFactor={-0.5}
          flatShading
        />
        <Decal 
          depthTest
          scale={status.solved ? SOLVED_BALL_DECAL_SCALE : 1}
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
  for (var rowIdx = 0; rowIdx < BALL_SIDE_ROWS; rowIdx++) {  
    const rowY = rowIdx - midPointY
    for (var ballIdx = 0; ballIdx < sideRowBallCount; ballIdx++) {
      const ballX = ballIdx - midPointX
      ballPositions[rowIdx * sideRowBallCount + ballIdx] = getPosition(ballX, rowY)
    }
  }
  //Middle
  const leftoverMidpointX = (middleRowBallCount - 1) * 0.5
  for (var ballIdx = 0; ballIdx < middleRowBallCount; ballIdx++) {
    ballPositions[BALL_SIDE_ROWS * sideRowBallCount + ballIdx] = getPosition(ballIdx - leftoverMidpointX, 0)
  }
  //Bottom
  for (var rowIdx = BALL_SIDE_ROWS; rowIdx < sideRowCount; rowIdx++) {  
    const rowY = rowIdx + 1 - midPointY
    for (var ballIdx = 0; ballIdx < sideRowBallCount; ballIdx++) {
      const ballX = ballIdx - midPointX
      ballPositions[middleRowBallCount + rowIdx * sideRowBallCount + ballIdx] = getPosition(ballX, rowY)
    }
  }
  return ballPositions
}

const getDecalRotationYForBallAtPosition = (ballPosition: Vector3) => {
  const target = new Vector3(0, 0, -CAMERA_TARGET_DISTANCE);

  const dir = new Vector3()
    .subVectors(ballPosition, target)
    .normalize();

  return Math.atan2(dir.x, dir.z) + Math.PI;
};

const BallCanvas = ({ technologies, getOnClick } : {technologies : TechnologyNode[], getOnClick : (index : number) => (() => (void))}) => {
  const [ballPositions, setBallPositions] = useState<Vector3[]>(getBallPositions(technologies.length))
  const maxCameraAngleX = Math.round(ballPositions.length / (2 * BALL_SIDE_ROWS + 1)) * BALL_ANGLE_STEP * 0.5
  const maxCameraAngleY = BALL_SIDE_ROWS * BALL_ANGLE_STEP
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
          mouseButtons={{RIGHT: MOUSE.ROTATE}}
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

export default BallCanvas