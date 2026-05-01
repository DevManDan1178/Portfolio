
const CONTAINER_ID = "unity-canvas";
const GAME_PATH = "/unity/PolygonTD";
const BUILD_NAME = "WebBuild_1.2.5";

export const RESOLUTION = {
  width : 1280,
  height: 720,
}
export const RESOLUTION_SCALE  = 0.5 //Keep as a a multiple of 2 or of 1/2

export const MENU_SCENES = {
  mainMenu : "Main Menu",
  levelSelect : "Level Select"
} 
var _unityCanvas : HTMLCanvasElement
var _unityInstance : any 

// Pure function that creates Unity canvas and returns a lambda to get it
export default function PolygonTD(width: number, height: number, gameEventHandlers : GameEventHandlers, onUnityInstanceCreated : (unityInstance : any) => void): () => HTMLCanvasElement {
  if (_unityCanvas) {
    return () => _unityCanvas
  }
  const canvas = document.createElement("canvas");
  canvas.id = CONTAINER_ID;
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.style.visibility = "visible";
  canvas.style.pointerEvents = "auto";
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
  _unityCanvas = canvas
  

  //TODO add in Unity functions for losing focus, make game pause on focus loss
  // Load Unity
  const script = document.createElement("script");
  script.src = `${GAME_PATH}/Build/${BUILD_NAME}.loader.js`;
  script.async = true;

  script.onload = () => {

    function onLoadingProgress(progress : number) {
      
    }

    // @ts-ignore
    createUnityInstance(canvas, {
      dataUrl: `${GAME_PATH}/Build/${BUILD_NAME}.data`,
      frameworkUrl: `${GAME_PATH}/Build/${BUILD_NAME}.framework.js`,
      codeUrl: `${GAME_PATH}/Build/${BUILD_NAME}.wasm`,
    }, onLoadingProgress).then((unityInstance: any) => {
      _unityInstance = unityInstance
      onUnityInstanceCreated(unityInstance)
      // Mute audio
      unityInstance.SendMessage("AudioManager", "SetMuteAllSounds", "true") 
      unityInstance.SendMessage("InputBridge", "SetRealInputReaderDisabled", "true")
      unityInstance.SendMessage("InputBridge", "SetCanQuit", "false")
      
      window.addEventListener("PolygonTD-pause-toggled", (e : any) => {
        const paused = e.detail
        gameEventHandlers.OnPauseToggled(paused)
      })
      window.addEventListener("PolygonTD-level-starting", (e : any) => {
        const levelNumber = e.detail
        gameEventHandlers.OnLevelStarted(levelNumber)
      })
      window.addEventListener("PolygonTD-level-lost", (e : any) => {
        const levelNumber = e.detail
        gameEventHandlers.OnLevelLost(levelNumber)
      })
      window.addEventListener("PolygonTD-level-cleared", (e : any) => {
        const levelNumber = e.detail
        gameEventHandlers.OnLevelCleared(levelNumber)
      })
      window.addEventListener("PolygonTD-player-level-progression", (e : any) => {
        const levelNumber = e.detail
        gameEventHandlers.OnLevelProgressChanged(levelNumber)
      })
      window.addEventListener("PolygonTD-scene-change", (e : any) => {
        const sceneName = e.detail
        gameEventHandlers.OnSceneChanged(sceneName)
      })
      window.addEventListener("beforeunload", () => {
        unityInstance?.Quit?.();
      });
    });
  };

  document.body.appendChild(script);

  return () => canvas;
}

export type GameEventHandlers = {
  OnLevelLost: (levelNumber : number) => void,
  OnLevelCleared: (levelNumber : number) => void,
  OnLevelStarted : (levelNumber : number) => void,
  OnPauseToggled : (paused : boolean) => void,
  OnSceneChanged : (sceneName : string) => void,
  OnLevelProgressChanged : (levelNumber : number) => void,
}
