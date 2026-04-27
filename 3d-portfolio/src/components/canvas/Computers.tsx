import { CanvasTexture, LinearFilter, Object3D, Mesh, MeshBasicMaterial, Box3, Vector3, Raycaster, Vector2 } from "three";
import { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { MOUSE, SRGBColorSpace } from "three";
import CanvasLoader from "../Loader";
import PolygonTD from "./PolygonTD";

const SCREEN_MESH_NAME = "MY_SCREEN_MY_SCREEN_0";
const SCREEN_MESH_SIZE = { x: 4.7397, y: 2.6041 };
const PIXELS_PER_UNIT = 1440;
const CANVAS_DIMENSIONS = {
  x: Math.min(Math.round(SCREEN_MESH_SIZE.x * PIXELS_PER_UNIT), 16384),
  y: Math.min(Math.round(SCREEN_MESH_SIZE.y * PIXELS_PER_UNIT), 16384),
};


const UnityClickForwarder = ({ screenMeshName, unityCanvas }: { screenMeshName: string; unityCanvas: HTMLCanvasElement | null }) => {
  const { camera, scene, gl } = useThree();

  useEffect(() => {
    if (!unityCanvas) return;

    const raycaster = new Raycaster();
    const mouse = new Vector2();

    const getInputFunction = (messageFunction: string) => (event: MouseEvent) => {
      if (!unityCanvas || event.button !== 0) return;

      const rect = gl.domElement.getBoundingClientRect();

      const mouse = new Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);

      if (!intersects.length) {
        return;
      }

      const hit = intersects.find(
        (i) => i.object.name === screenMeshName && i.uv
      );

      if (!hit || !hit.uv) {
        return;
      }

      const uv = hit.uv;

      const canvasXRelative = uv.x;
      const canvasYRelative = uv.y;
    
      window.__unityInstance?.SendMessage("InputBridge", messageFunction,`${canvasXRelative},${canvasYRelative}`
      );
    };
    //TODO add keybinds for towers in the game, add a static parameter to prevent quitting like for muting audio

    
    const pointerDownLambda = getInputFunction("OnPointerDown")
    const mouseMoveLambda = getInputFunction("OnMouseMove")
    gl.domElement.addEventListener("mousemove", mouseMoveLambda);
    gl.domElement.addEventListener("mousedown", pointerDownLambda); 
    return () => { 
      gl.domElement.removeEventListener("mousemove", mouseMoveLambda);
      gl.domElement.removeEventListener("mousedown", pointerDownLambda);
    }

    
  }, [camera, scene, gl, screenMeshName, unityCanvas]);

  return null;
};

const Computers = ({ isMobile, unityCanvas }: { isMobile: boolean; unityCanvas: HTMLCanvasElement | null }) => {
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

  useEffect(() => {
    if (!unityTexture) return;
    computer.scene.traverse((child: Object3D) => {
      if (child instanceof Mesh && child.name === SCREEN_MESH_NAME) {
        child.material = new MeshBasicMaterial({ map: unityTexture });
      }
    });
  }, [unityTexture, computer]);

  useFrame(() => {
    if (unityTexture) unityTexture.needsUpdate = true;
  });

  return <primitive object={computer.scene} scale={isMobile ? 0.65 : 0.75} position={[0, -2.75, -1.5]} />;
};

// ----------------------
// Main Canvas
// ----------------------
const ComputerCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [unityCanvas, setUnityCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const getCanvas = PolygonTD(CANVAS_DIMENSIONS.x, CANVAS_DIMENSIONS.y);
    const canvas = getCanvas();
    document.body.appendChild(canvas);
    setUnityCanvas(canvas);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <Canvas shadows camera={{ position: [20, 3, 5], fov: 25 }} gl={{ preserveDrawingBuffer: true }}>
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          mouseButtons={{ RIGHT: MOUSE.ROTATE, LEFT: undefined, MIDDLE: MOUSE.DOLLY }}
          enableZoom
          enablePan={false}
          maxDistance={25}
          minDistance={7.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} unityCanvas={unityCanvas} />
        <UnityClickForwarder screenMeshName={SCREEN_MESH_NAME} unityCanvas={unityCanvas} />
      </Suspense>
      <Preload all />
    </Canvas>
  )
};

export default ComputerCanvas;