import type { UnityInstance } from "../games/UnityGame";
import type { GameEventLinkers } from "../../../types/exhibits/games"

const CONTAINER_ID = "unity-canvas";
const GAME_PATH = "/games/PolygonTD";
const BUILD_NAME = "WebBuild_1.2.6";

export const RESOLUTION = {
  width : 1280,
  height: 720,
}
export const RESOLUTION_SCALE  = 0.5 //Keep as a a multiple of 2 or of 1/2

export const MENU_SCENES = {
  mainMenu : "Main Menu",
  levelSelect : "Level Select"
} 
let _unityCanvas : HTMLCanvasElement
let _unityInstance : UnityInstance

// Pure function that creates Unity canvas and returns a lambda to get it
export default function PolygonTD(width: number, height: number, gameEventLinkers : GameEventLinkers, onUnityInstanceCreated : (unityInstance : UnityInstance) => void): () => HTMLCanvasElement {
  if (_unityCanvas) {
    return () => _unityCanvas
  }
  const canvas = document.createElement("canvas");
  canvas.id = CONTAINER_ID;
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.style.pointerEvents = "auto";
  canvas.style.position = "absolute";
  canvas.style.left = "-10000px";
  canvas.style.visibility = "hidden";
  canvas.tabIndex = -1;

  _unityCanvas = canvas
  

  //TODO add in Unity functions for losing focus, make game pause on focus loss
  // Load Unity
  const script = document.createElement("script");
  script.src = `${GAME_PATH}/Build/${BUILD_NAME}.loader.js`;
  script.async = true;

  script.onload = () => {

    /*
    function onLoadingProgress(progress : number) {
      
    }*/

    // @ts-expect-error createUnityInstance exists but not detected
    createUnityInstance(canvas, {
      dataUrl: `${GAME_PATH}/Build/${BUILD_NAME}.data`,
      frameworkUrl: `${GAME_PATH}/Build/${BUILD_NAME}.framework.js`,
      codeUrl: `${GAME_PATH}/Build/${BUILD_NAME}.wasm`,
    }, /*onLoadingProgress*/).then((unityInstance: UnityInstance) => {
      _unityInstance = unityInstance
      onUnityInstanceCreated(unityInstance)
      // Mute audio
      unityInstance.SendMessage("AudioManager", "SetMuteAllSounds", "true") 
      unityInstance.SendMessage("InputBridge", "SetRealInputReaderDisabled", "true")
      unityInstance.SendMessage("InputBridge", "SetCanQuit", "false")
      
      gameEventLinkers.forEach((gameEventLinker) => {
        const {gameEventName, handler} = gameEventLinker;
        
        // @ts-expect-error Custom Unity event uses CustomEvent instead of DOM Event
        window.addEventListener(gameEventName, (e : CustomEvent) => {
            const detail = e.detail
             // @ts-expect-error detail should exist
            handler(detail)
        })
      })
      window.addEventListener("beforeunload", () => {
        unityInstance?.Quit?.();
      });
    });
  };

  document.body.appendChild(script);

  return () => canvas;
}

export const GetUnityInstance : () => UnityInstance = () => _unityInstance

export type GameEventHandlers = {
  OnLevelLost: (levelNumber : number) => void,
  OnLevelCleared: (levelNumber : number) => void,
  OnLevelStarted : (levelNumber : number) => void,
  OnPauseToggled : (paused : boolean) => void,
  OnSceneChanged : (sceneName : string) => void,
  OnLevelProgressChanged : (levelNumber : number) => void,
}
