// PolygonTD.tsx
declare global {
  interface Window {
    __unityCanvas: HTMLCanvasElement;
    __unityInstance: any;
  }
}

const CONTAINER_ID = "unity-canvas";
const GAME_PATH = "/unity/PolygonTD";
const BUILD_NAME = "WebBuildMinimal";

// Pure function that creates Unity canvas and returns a lambda to get it
export default function PolygonTD(width: number, height: number): () => HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.id = CONTAINER_ID;
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.visibility = "visible";
  canvas.style.pointerEvents = "auto";

  window.__unityCanvas = canvas;

  // Load Unity
  const script = document.createElement("script");
  script.src = `${GAME_PATH}/Build/${BUILD_NAME}.loader.js`;
  script.async = true;

  script.onload = () => {
    // @ts-ignore
    createUnityInstance(canvas, {
      dataUrl: `${GAME_PATH}/Build/${BUILD_NAME}.data`,
      frameworkUrl: `${GAME_PATH}/Build/${BUILD_NAME}.framework.js`,
      codeUrl: `${GAME_PATH}/Build/${BUILD_NAME}.wasm`,
    }).then((unityInstance: any) => {
      window.__unityInstance = unityInstance;
      // Mute audio
      unityInstance.SendMessage("AudioManager", "SetMuteAllSounds", "true");
    });
  };

  document.body.appendChild(script);

  return () => canvas;
}