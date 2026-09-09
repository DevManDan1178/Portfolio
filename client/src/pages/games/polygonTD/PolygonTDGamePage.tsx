import { useState, type ReactElement } from "react";
import UnityGame, { type UnityLoaderConfig } from "../../../components/games/UnityGame";
import SEO, {type SEOInfo } from "../../../components/misc/SEO";
import { type FileInfo } from "../../../components/games/UnityGame";
import { styles } from "../../../style";
import { maxNameLength } from "../../../../../shared/constants/api/globalBoards";
import useSubmittableNameboard from "../../../components/globalLists/SubmittableNameboard";
import useSubmittableScoreStreamBoard from "../../../components/globalLists/SubmittableScoreStreamBoard";

const GAME_PATH = "/games/PolygonTD";
const BUILD_NAME = "WebBuild_1.2.6";


const containerId = "PolygonTD_UnityCanvas";
const canvasDimensions = {
  x : 1280,
  y : 720,
}

const config : UnityLoaderConfig = {
    dataUrl: `${GAME_PATH}/Build/${BUILD_NAME}.data`,
    frameworkUrl: `${GAME_PATH}/Build/${BUILD_NAME}.framework.js`,
    codeUrl: `${GAME_PATH}/Build/${BUILD_NAME}.wasm`,
    streamingAssetsUrl: `${GAME_PATH}/StreamingAssets`,
    companyName: "DevManDan",
    productName: BUILD_NAME,
    productVersion: "1.2.6",
};

const fileInfo : FileInfo = {
  buildName: BUILD_NAME,
  gamePath: GAME_PATH
}

const titleElement = <p className="pb-5 text-center font-pixeloid"> POLYGON TOWER DEFENSE </p>

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

const seoInfo : SEOInfo = {
  title: "Polygon Tower Defense", 
  description: 
  `Playable on browser! ` +
  `A tower defense game where you customize your own upgrades by choosing the stat boosts. ` +
  `Defend waves of enemies by placing towers and platforms, or even by extending the track. `
}

export default function PolygonTDGamePage() {

  const [globalBoardsToggled, setGlobalBoardsToggled] = useState(false)
  const [completionistNameboard, clearersSetSubmittable] = useSubmittableNameboard({
    category: "PolygonTD-completionist",
    title: "Completionists - Level 4 Victors",
    count: 20,
    submitSectionTexts: {
      submitButtonText: "Submit",
    },
    theme: {
      font: "font-pixeloid"
    },
    maxNameLength
  })

  const [clearsScoreStreamBoard, clearsSetSubmittable] = useSubmittableScoreStreamBoard({
    category: "PolygonTD-clear",
    title: "Recent Level Clears",
    count: 20,
    submitSectionTexts: {
      submitButtonText: "Submit",
      submitSectionTitle: "Cleared Level"
    },
    boardSubTitles: {
      score: "Cleared Level",
    },
    theme: {
      font: "font-pixeloid"
    },
    maxNameLength
  })
  
  const [selectedGlobalBoard, setSelectedGlobalBoard] = useState<"clear" | "completion">("clear");

  function onLevelCleared(levelNumber : number) {
    clearsSetSubmittable(levelNumber);
    if (levelNumber >= 4) {
      clearersSetSubmittable(true);
    }
  }

  
  const [polygonTDGame, toggleFullscreen] = UnityGame({
    className:"w-[calc(50%+125px)]",
    config,
    canvasDimensions,
    containerId,
    fileInfo,
    gameEventLinkers: [
      { 
        gameEventName: "PolygonTD-level-cleared",
        handler: onLevelCleared
      }
    ],
    loadingText : (
      <>
        <p className="font-pixeloid">LOADING...</p>
        <p className="text-sm font-pixeloid">This might take a while...</p>
      </>
    )
  })

  return (
    <>
      <SEO
        title={seoInfo.title}
        description={seoInfo.description}
        image={seoInfo.image}
        url={seoInfo.url}
      />

      <div className="w-full h-full flex flex-col items-center p-10 bg-zinc-950 text-white">
        <div className="text-3xl font-semibold">
          {titleElement}
        </div>

        <div className="w-full flex flex-col items-center">
          {polygonTDGame}
        </div>
        <div className="w-full flex justify-center items-start gap-20 pt-5 pb-10">
          <div className="w-[calc(15%+50px)] flex justify-center">
            <button
              onClick={toggleFullscreen}
              className="font-pixeloid mt-6 px-4 py-1 bg-white text-black/70 font-bold text-md rounded-sm hover:bg-zinc-300 transition"
            >
              FULLSCREEN
            </button>
          </div>

          <div className="w-[calc(15%+50px)] flex justify-center">
            <button
              className="font-pixeloid mt-6 px-4 py-1 bg-white text-black/70 font-bold text-md rounded-sm hover:bg-zinc-300 transition"
              onClick={() => setGlobalBoardsToggled(!globalBoardsToggled)}
            >
              GLOBAL VICTORS
            </button>
          </div>
        </div>
         <div 
          className={globalBoardsToggled ? "block" : "hidden"}
          aria-hidden={!globalBoardsToggled}
        >
          <div className="flex flex-col items-center w-full">
            <div className="w-full items-center justify-center flex gap-10">
              <button
                onClick={() => setSelectedGlobalBoard("clear")}
                className={`mt-4 px-2 py-1 ${selectedGlobalBoard == "clear" ? "cursor-default border-black/40 border-2" : "hover:bg-white/80"} bg-white  text-black font-pixeloid text-sm rounded-sm  transition`}
              >
                RECENT CLEARS
              </button>

              <button
                className={`mt-4 px-2 py-1 ${selectedGlobalBoard == "completion" ? "cursor-default border-black/40 border-2" : "hover:bg-white/80"} bg-white  text-black font-pixeloid text-sm rounded-sm  transition`}
                onClick={() => setSelectedGlobalBoard("completion")}
              >
                COMPLETIONISTS
              </button>
            </div>
          
            <div 
              className={selectedGlobalBoard == "clear" ? "block" : "hidden"}
              aria-hidden={selectedGlobalBoard != "clear"}
            >
              {clearsScoreStreamBoard}
            </div>
            <div 
              className={selectedGlobalBoard == "completion" ? "block" : "hidden"}
              aria-hidden={selectedGlobalBoard != "completion"}
            >
              {completionistNameboard}
            </div>
          </div>
        </div>
        <div className="relative w-full flex justify-center text-sm text-zinc-400 pt-5">
          <div className="w-full max-w-[80%] text-center">
            {descriptionElement}
          </div>
        </div>
      </div>
    </>
  );
}

