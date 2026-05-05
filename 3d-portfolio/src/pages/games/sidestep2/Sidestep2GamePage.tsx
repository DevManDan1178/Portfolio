import { type ReactElement } from "react";
import UnityGamePage, { type FileInfo } from "../UnityGamePage";


const GAME_PATH = "/games/Sidestep2";
const BUILD_NAME = "WebBuild_1.1";


const containerId = "Sidestep2_UnityCanvas";
const canvasDimensions = {
  x : 1280,
  y : 720,
}

 // @ts-ignore
const config = {
    dataUrl: `${GAME_PATH}/Build/${BUILD_NAME}.data`,
    frameworkUrl: `${GAME_PATH}/Build/${BUILD_NAME}.framework.js`,
    codeUrl: `${GAME_PATH}/Build/${BUILD_NAME}.wasm`,
    companyName: "DevManDan",
    productName: BUILD_NAME,
    productVersion: "1.1",
};

const fileInfo : FileInfo = {
  buildName: BUILD_NAME,
  gamePath: GAME_PATH,
}

const titleElement = <p className="pb-5 text-center font-bold">
            SIDESTEP²
          </p>

const descriptionList : ReactElement[] = [
  <span className="text-[18px] text-left w-[85%] tracking-wide leading-loose">
    Sidestep² is a bullet hell inspired by <span style={{color: "#abf8ff"}}> JSAB </span> and <span style={{color: "#d4b85d"}}> LoL Dodge Game</span>.<br/>
  </span>,
  <span className="text-[18px] text-left w-[85%] tracking-wide leading-loose">
    It is also my <span className="text-amber-200/90">first ever project</span>. I hope you like it. <span className="text-blue-200/90">:D</span><br/>
</span>,
  <span className="text-[15px] text-left w-[85%] tracking-wide leading-loose mt-5">
    Avoid the <span style={{color: "#ff9991"}}> red </span> and <span style={{color: "#fff49e"}}> yellow </span> projectiles. <br/>
 </span>,
  <span className="text-[13px] font-pixeloid">
    <br/>
    Movement controls can be toggled between keyboard (WASD) and mouse (RMB)
    <br/>
    <span className="text-[10px] font-pixeloid">
    <br/>
      I have you hostage. You cannot quit the game. {">:)"} <br/><br/>
    </span>
    <span className="text-[14px] text-white/35">
      Soundtracks: <br/>
      Level 1: Stayin' Alive - 8 Bit Universe <br/>
      Level 2: Don't Stay Still - by me :) <br/>
      Level 3: Samurai - Jim Yosef <br/>
      Level 4: At the Speed of Light - Dimrain47 <br/>
      Level 5: Skystrike - Hinkik <br/>
      Endless Level : Endless - by me :) <br/>
    </span>
  </span>
]

export default UnityGamePage({
    titleElement : titleElement,
    descriptionList : descriptionList,
    canvasDimensions : canvasDimensions,
    config : config,
    fileInfo : fileInfo,
    containerId : containerId,
})
