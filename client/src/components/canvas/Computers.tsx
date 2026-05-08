import {
  CanvasTexture,
  LinearFilter,
  Object3D,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  Vector2,
} from "three";
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { MOUSE, SRGBColorSpace } from "three";
import CanvasLoader from "../Loader";
import PolygonTD, {
  RESOLUTION,
  RESOLUTION_SCALE,
  type GameEventHandlers,
} from "./PolygonTD";
import { type UnityInstance } from "../../pages/games/UnityGamePage";

const SCREEN_MESH_NAME = "MY_SCREEN_MY_SCREEN_0";

const FOCUS_DROPPING_UI_EVENTS: (keyof DocumentEventMap)[] = [
  "mousedown",
  "scroll",
];

export type UnityController = {
  start: () => void;
  started? : boolean,
};


const UnityClickForwarder = ({screenMeshName, unityCanvas, unityInstanceRef, onBlur, onFocus, unityControllerRef}: {screenMeshName: string; unityCanvas: HTMLCanvasElement | null; unityInstanceRef: RefObject<UnityInstance | null>; onBlur: () => void; onFocus: () => void; unityControllerRef : RefObject<UnityController | null>}) => {
  const { camera, scene, gl } = useThree();

  useEffect(() => {
    const handleUIEvent = (event: Event) => {
      const canvasEl = gl.domElement;

      if (!canvasEl.contains(event.target as Node)) {
        onBlur();
      }
    };

    FOCUS_DROPPING_UI_EVENTS.forEach((ev) =>
      document.addEventListener(ev, handleUIEvent)
    );

    return () => {
      FOCUS_DROPPING_UI_EVENTS.forEach((ev) =>
        document.removeEventListener(ev, handleUIEvent)
      );
    };
  }, []);

  useEffect(() => {
    const raycaster = new Raycaster();
    
    const getInputFunction =
      (messageFunction: string, affectsFocus: boolean) => (event: MouseEvent) => {
        if (!unityCanvas && !!unityControllerRef.current && !unityControllerRef.current.started && affectsFocus) {
          unityControllerRef.current.start()
          unityControllerRef.current.started = true
          return
        }
        if (!unityCanvas || event.button !== 0) {
          return
        };

        if (affectsFocus) onFocus();

        const rect = gl.domElement.getBoundingClientRect();

        const mouse = new Vector2(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -((event.clientY - rect.top) / rect.height) * 2 + 1
        );

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);

        const unityInstance = unityInstanceRef.current;

        if (!intersects.length) {
          if (affectsFocus) {
            unityInstance?.SendMessage("GameMaster", "SetPaused");
          }
          return;
        }

        const hit = intersects.find(
          (i) => i.object.name === screenMeshName && i.uv
        );

        if (!hit?.uv) return;

        const uv = hit.uv;
        
        unityInstance?.SendMessage(
          "InputBridge",
          messageFunction,
          `${uv.x},${uv.y}`
        );
      };

    const pointerDown = getInputFunction("OnPointerDown", true);
    const mouseMove = getInputFunction("OnMouseMove", false);

    gl.domElement.addEventListener("mousemove", mouseMove);
    gl.domElement.addEventListener("mousedown", pointerDown);

    return () => {
      gl.domElement.removeEventListener("mousemove", mouseMove);
      gl.domElement.removeEventListener("mousedown", pointerDown);
    };
  }, [camera, scene, gl, screenMeshName, unityCanvas]);

  return null;
};


function waitForUnityFirstFrame( canvas: HTMLCanvasElement, cb: () => void) {
  const check = () => {
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

    if (!gl) return requestAnimationFrame(check);

    const pixels = new Uint8Array(4);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    if (pixels.some((v) => v !== 0)) cb();
    else requestAnimationFrame(check);
  };

  requestAnimationFrame(check);
}


const Computer = ({isMobile, unityCanvas, updateFrames}: {isMobile: boolean; unityCanvas: HTMLCanvasElement | null; updateFrames: boolean; }) => {
  const computer = useGLTF("/desktop_pc/scene.gltf");
  const [unityTexture, setUnityTexture] =
    useState<CanvasTexture | null>(null);

  useEffect(() => {
    if (!unityCanvas) return;

    waitForUnityFirstFrame(unityCanvas, () => {
      const texture = new CanvasTexture(unityCanvas);

      texture.colorSpace = SRGBColorSpace;
      texture.generateMipmaps = false;
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;

      setUnityTexture(texture);
    });
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
    if (!updateFrames || !unityTexture || !unityCanvas) return;
    unityTexture.needsUpdate = true;
  });

  return (
    <primitive
      object={computer.scene}
      scale={isMobile ? 0.65 : 0.75}
      position={[0, -2.5, isMobile ? -2 : -2.3]}
      rotation={[0, -0.185, 0]}
    />
  );
};


const ComputerCanvas = ({ gameEventHandlers, unityControllerRef }: {gameEventHandlers: RefObject<GameEventHandlers>; unityControllerRef: RefObject<UnityController | null>; }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [unityCanvas, setUnityCanvas] =
  useState<HTMLCanvasElement | null>(null);

  const unityInstanceRef = useRef<UnityInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [updateFrames, setUpdateFrames] = useState(false);
  const [unityReady, setUnityReady] = useState(!!unityControllerRef.current ? (unityControllerRef.current?.started) : false);
  const unityFocused = useRef(false);


  useEffect(() => {
    const mq = window.matchMedia("(max-width: 500px)");
    setIsMobile(mq.matches);

    const handler = (e: MediaQueryListEvent) =>
      setIsMobile(e.matches);

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!unityControllerRef) {
      return;
    }

    unityControllerRef.current = {
      start: () => 
        setUnityReady(true),
        started: false
    };
  }, []);


  useEffect(() => {
    if (!unityReady) return;

    let canvas: HTMLCanvasElement | null = null;

    const onUnityInstanceCreated = (instance: UnityInstance) => {
      unityInstanceRef.current = instance;
    };

    const getCanvas = PolygonTD(
      RESOLUTION.width * RESOLUTION_SCALE,
      RESOLUTION.height * RESOLUTION_SCALE,
      gameEventHandlers.current,
      onUnityInstanceCreated
    );

    canvas = getCanvas();

    containerRef.current?.appendChild(canvas);
    setUnityCanvas(canvas);

    return () => {
      canvas?.remove();
      unityInstanceRef.current = null;
    };
  }, [unityReady]);

  /* ---------------- FOCUS ---------------- */

  const onUnityFocus = () => {
    if (unityFocused.current) return;

    unityInstanceRef.current?.SendMessage(
      "InputBridge",
      "SetKeyboardInputDisabled",
      "false"
    );

    unityCanvas?.focus();
    setUpdateFrames(true);
    unityFocused.current = true;
  };

  const onUnityBlur = () => {
    if (!unityFocused.current) return;

    unityInstanceRef.current?.SendMessage(
      "GameMaster",
      "SetPaused"
    );

    unityInstanceRef.current?.SendMessage(
      "InputBridge",
      "SetKeyboardInputDisabled",
      "true"
    );

    unityCanvas?.blur();
    setUpdateFrames(false);
    unityFocused.current = false;
  };


  return (
    <div ref={containerRef} className="relative w-full h-full">
      <Canvas
        tabIndex={-1}
        shadows
        camera={{ position: [25, 0, 5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
        onFocus={() => {
          scrollTo(0, 0);
          onUnityFocus();
        }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            mouseButtons={{
              RIGHT: MOUSE.ROTATE,
              LEFT: undefined,
              MIDDLE: MOUSE.DOLLY,
            }}
            enableZoom
            enablePan={false}
            maxDistance={15}
            minDistance={7.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />

          <Computer
            isMobile={isMobile}
            unityCanvas={unityCanvas}
            updateFrames={updateFrames}
          />

          <UnityClickForwarder
            screenMeshName={SCREEN_MESH_NAME}
            unityCanvas={unityCanvas}
            unityInstanceRef={unityInstanceRef}
            onBlur={onUnityBlur}
            onFocus={onUnityFocus}
            unityControllerRef={unityControllerRef}
          />
        </Suspense>

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[2.5, 2.5, 0]} intensity={15} distance={50} />

        <Preload all />
      </Canvas>
    </div>
  );
};

export default ComputerCanvas;