import { type ReactElement } from "react";
import UnityGamePage, { type FileInfo } from "../UnityGamePage";
import { styles } from "../../../style";


const GAME_PATH = "/games/PolygonTD";
const BUILD_NAME = "WebBuild_1.2.6";


const containerId = "PolygonTD_UnityCanvas";
const canvasDimensions = {
  x : 1280,
  y : 720,
}

 // @ts-ignore
const config = {
    dataUrl: `${GAME_PATH}/Build/${BUILD_NAME}.data`,
    frameworkUrl: `${GAME_PATH}/Build/${BUILD_NAME}.framework.js`,
    codeUrl: `${GAME_PATH}/Build/${BUILD_NAME}.wasm`,
   // streamingAssetsUrl: `${GAME_PATH}/StreamingAssets`,
    companyName: "DevManDan",
    productName: BUILD_NAME,
    productVersion: "1.2.6",
};

const fileInfo : FileInfo = {
  buildName: BUILD_NAME,
  gamePath: GAME_PATH
}

const titleElement = <p className="pb-5 text-center font-pixeloid">
            POLYGON TOWER DEFENSE
          </p>

const descriptionElement : ReactElement = <span className={styles.sectionSubText}>
  <span className="text-[18px] text-left w-[85%] tracking-wide leading-loose">Polygon TD is a simple tower defense game where towers and enemies are just basic shapes.<br/></span>
  <span className="text-[15px] text-left w-[85%] tracking-wide leading-loose mt-5">
    Place turrets on <span style={{color: "#d7bbfd"}}> tiles</span> to defend the <span style={{color: "#ecf170", opacity: 0.85}}>endpoint</span>. <br/>
    Tailor your own tower upgrades and optimize your defenses.<br/> 
    Extensions to the <span style={{color: "#ffffff", opacity: 0.85}}>path</span> only apply when connected adjacent to the <span style={{color: "#ecf170", opacity: 0.85}}>endpoint</span>
  </span>
  <span className="text-[13px] font-pixeloid">
    <br/>
    Number keys can select the corresponding items in your hotbar. Pressing Q will cancel placement.
    <br/>
    Camera can be moved with WASD or arrow keys and zoomed in/out with E/Q.
    <br/>
    Toggle camera controls with the space bar (or press the button).
    <br/>
    <span className="text-[10px] font-pixeloid">
    <br/>
      I have you hostage. You cannot quit the game. {">:)"} <br/><br/>
    </span>
    <span className="text-[14px] text-white/35">
      Soundtracks by me {":)"} <br/>
      <span className="text-[10px]">(They aren't published)</span>
    </span>
  </span>
</span>

export default UnityGamePage({
  titleElement : titleElement,
  descriptionElement : descriptionElement,
  canvasDimensions : canvasDimensions,
  config : config,
  fileInfo : fileInfo,
  containerId : containerId,
})
