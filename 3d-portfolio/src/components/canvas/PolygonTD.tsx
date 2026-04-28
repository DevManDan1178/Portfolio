// PolygonTD.tsx
declare global {
  interface Window {
  __PolygonTD : {
      unityCanvas: HTMLCanvasElement;
    unityInstance: any;
    }
  }
}

const CONTAINER_ID = "unity-canvas";
const GAME_PATH = "/unity/PolygonTD";
const BUILD_NAME = "WebBuild_1.2.4_WebSignals";

export type GameEventHandlers = {
  OnLevelLost: (levelNumber : number) => void,
  OnLevelCleared: (levelNumber : number) => void,
  OnLevelStarted : (levelNumber : number) => void,
  OnPauseToggled : (paused : boolean) => void,
}

// Pure function that creates Unity canvas and returns a lambda to get it
export default function PolygonTD(width: number, height: number, gameEventHandlers : GameEventHandlers): () => HTMLCanvasElement {
  if (window.__PolygonTD) {
    return () => window.__PolygonTD.unityCanvas
  }
  const canvas = document.createElement("canvas");
  canvas.id = CONTAINER_ID;
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  console.log(width, height);
  canvas.style.visibility = "visible";
  canvas.style.pointerEvents = "none";
  canvas.style.position = "absolute";
  //canvas.style.display = "none"
  canvas.style.left = "-10000px";
  canvas.style.top = "0";
  canvas.style.opacity = "0"; // or visibility: hidden
  canvas.tabIndex = 1;
  canvas.addEventListener("pointerdown", (e) => {
    // Only left click
    if (e.button !== 0) return;

    // Get canvas-local coordinates
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  })
  window.__PolygonTD = {
    unityCanvas : canvas,
    unityInstance : undefined,
  }
  

  //TODO add in Unity functions for losing focus, make game pause on focus loss
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
      window.__PolygonTD = {
        unityCanvas : window.__PolygonTD.unityCanvas,
        unityInstance : unityInstance
      }
      // Mute audio
      unityInstance.SendMessage("AudioManager", "SetMuteAllSounds", "true") 
      unityInstance.SendMessage("InputBridge", "SetRealInputReaderDisabled", "true")
      unityInstance.SendMessage("InputBridge", "SetCanQuit", "false")
      window.addEventListener("unity-pause-toggled", (e : any) => {
        const paused = e.detail
        gameEventHandlers.OnPauseToggled(paused)
      })

      window.addEventListener("unity-level-starting", (e : any) => {
        const levelNumber = e.detail
        gameEventHandlers.OnLevelStarted(levelNumber)
      })
      window.addEventListener("unity-level-lost", (e : any) => {
        const levelNumber = e.detail
        gameEventHandlers.OnLevelLost(levelNumber)
      })
      window.addEventListener("unity-level-cleared", (e : any) => {
        const levelNumber = e.detail
        gameEventHandlers.OnLevelCleared(levelNumber)
      })
    });
  };

  document.body.appendChild(script);

  return () => canvas;
}