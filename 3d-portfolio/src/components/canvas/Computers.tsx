import { CanvasTexture, LinearFilter, Object3D, Mesh, MeshBasicMaterial, Raycaster, Vector2 } from "three";
import { Suspense, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { MOUSE, SRGBColorSpace } from "three";
import CanvasLoader from "../Loader";
import PolygonTD, {RESOLUTION, RESOLUTION_SCALE, type GameEventHandlers, type UnityInstance} from './PolygonTD'

const SCREEN_MESH_NAME = "MY_SCREEN_MY_SCREEN_0";
//const SCREEN_MESH_SIZE = { x: 4.7397, y: 2.6041 };

const FOCUS_DROPPING_UI_EVENTS : (keyof DocumentEventMap)[] = ["mousedown", "scroll"]


const UnityClickForwarder = ({ screenMeshName, unityCanvas, unityInstanceRef, onBlur, onFocus }: { screenMeshName: string; unityCanvas: HTMLCanvasElement | null, unityInstanceRef : RefObject<UnityInstance | null>, onBlur : () => void, onFocus : () => void}) => {
  const { camera, scene, gl } = useThree();
    
  useEffect(() => {
    const handleUIEvent = (event: Event) => {
      const canvasEl = gl.domElement;

      // If click is NOT inside the Three.js canvas
      if (!canvasEl.contains(event.target as Node)) { 
        onBlur()
      }
    };
    FOCUS_DROPPING_UI_EVENTS.forEach((mouseEvent : string) =>  document.addEventListener(mouseEvent, handleUIEvent))

    return () => {
      FOCUS_DROPPING_UI_EVENTS.forEach((mouseEvent : string) =>  document.removeEventListener(mouseEvent, handleUIEvent))
    };
  }, []);

  useEffect(() => {
    if (!unityCanvas) return;

    const raycaster = new Raycaster();
    const unityInstance = unityInstanceRef.current
    const getInputFunction = (messageFunction: string, affectsFocus : boolean) => (event: MouseEvent) => {
      if (!unityCanvas || event.button !== 0) return;
      
      if (affectsFocus) {
        onFocus()
      }
      
      const rect = gl.domElement.getBoundingClientRect();

      const mouse = new Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);

      if (!intersects.length) { 
        if (affectsFocus) {
            unityInstance?.SendMessage("GameMaster", "SetPaused")
        }
        return;
      }
      
      const hit = intersects.find(
        (i) => i.object.name === screenMeshName && i.uv
      );

      if (!hit || !hit.uv) {
        return;
      }

      const uv = hit.uv;
      unityInstance?.SendMessage("InputBridge", messageFunction,`${uv.x},${uv.y}`
      );
    };
  
    //TODO add keybinds for towers in the game, add a static parameter to prevent quitting like for muting audio
    const pointerDownLambda = getInputFunction("OnPointerDown", true)
    const mouseMoveLambda = getInputFunction("OnMouseMove", false)
    gl.domElement.addEventListener("mousemove", mouseMoveLambda);
    gl.domElement.addEventListener("mousedown", pointerDownLambda); 
    return () => { 
      gl.domElement.removeEventListener("mousemove", mouseMoveLambda);
      gl.domElement.removeEventListener("mousedown", pointerDownLambda);
    }
  }, [camera, scene, gl, screenMeshName, unityCanvas]);
  return null;

};

const Computer = ({ isMobile, unityCanvas, updateFrames }: { isMobile: boolean; unityCanvas: HTMLCanvasElement | null, updateFrames : boolean }) => {
  const computer = useGLTF("/desktop_pc/scene.gltf");
  const [unityTexture, setUnityTexture] = useState<CanvasTexture | null>(null);

  useEffect(() => {
    if (!unityCanvas) return;
    const texture = new CanvasTexture(unityCanvas);
    texture.colorSpace = SRGBColorSpace
    texture.generateMipmaps = false
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.needsUpdate = true;
    setUnityTexture(texture);
  }, [unityCanvas]);

  useLayoutEffect(() => {
    if (!unityTexture) return;
    computer.scene.traverse((child: Object3D) => {
      if (child instanceof Mesh && child.name === SCREEN_MESH_NAME) {
        child.material = new MeshBasicMaterial({ map: unityTexture });
      }
    });
  }, [unityTexture, computer]);

  

  useFrame(() => {
    if (updateFrames && unityTexture) unityTexture.needsUpdate = true;
  });

  return <primitive 
    object={computer.scene} 
    scale={isMobile ? 0.65 : 0.75} 
    position={[0, -2.55, -2.25]} 
    rotation={[0, -0.185, 0]}
  />;
};


const ComputerCanvas = ({gameEventHandlers} : {gameEventHandlers : RefObject<GameEventHandlers>}) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const unityInstanceRef = useRef<UnityInstance | null>(null)
  const [unityCanvas, setUnityCanvas] = useState<HTMLCanvasElement | null>(null);
  const [updateFrames, setUpdateFrames] = useState<boolean>(true)
  
  useEffect(() => {
    const onUnityInstanceCreated = (unityInstance : any) => {
      unityInstanceRef.current = unityInstance
    }

    const getCanvas = PolygonTD(RESOLUTION.width * RESOLUTION_SCALE, RESOLUTION.height * RESOLUTION_SCALE, gameEventHandlers.current, onUnityInstanceCreated);
    const canvas = getCanvas();
    document.body.appendChild(canvas);
    setUnityCanvas(canvas);
  }, []);

  const onUnityFocus = () => {
    console.log("focus")
    unityInstanceRef.current?.SendMessage("InputBridge", "SetKeyboardInputDisabled", "false") //TODO make unity block keys by adding a static bool and checking it on every input detection
    unityCanvas?.focus()
    setUpdateFrames(true)
  }

  const onUnityBlur = () => {
    unityInstanceRef.current?.SendMessage("GameMaster", "SetPaused");
    unityInstanceRef.current?.SendMessage("InputBridge", "SetKeyboardInputDisabled", "true")
    unityCanvas?.blur()
    setUpdateFrames(false)
  }

  return (
    <Canvas 
      shadows 
      camera={{ position: [25, 0, 5], fov: 25}} gl={{ preserveDrawingBuffer: true }}
      onFocus={() => {
        onUnityFocus()
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          mouseButtons={{ RIGHT: MOUSE.ROTATE, LEFT: undefined, MIDDLE: MOUSE.DOLLY }}
          enableZoom
          enablePan={false}
          maxDistance={15}
          minDistance={7.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computer isMobile={isMobile} unityCanvas={unityCanvas} updateFrames={updateFrames}/>
        <UnityClickForwarder screenMeshName={SCREEN_MESH_NAME} unityCanvas={unityCanvas} unityInstanceRef={unityInstanceRef} onBlur={onUnityBlur} onFocus={onUnityFocus}/>
      </Suspense>
      <ambientLight intensity={0.5} />

      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
      />

      <pointLight
        position={[2.5, 2.5, 0]}
        intensity={15}
        distance={50}
      />
      <Preload all />
    </Canvas>
  )
};

export default ComputerCanvas;