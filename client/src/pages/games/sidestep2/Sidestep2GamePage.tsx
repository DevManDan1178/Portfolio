import { type ReactElement } from "react";
import SEO from "../../../components/misc/SEO";
import UnityGame from "../../../components/games/UnityGame";
import { type FileInfo } from "../../../components/games/UnityGame";
import type { SEOInfo } from "../../../components/misc/SEO";
import type { GameEventLinkers } from "../../../../types/exhibits/games";

const GAME_PATH = "/games/Sidestep2";
const BUILD_NAME = "WebBuild_1.2";

const containerId = "Sidestep2_UnityCanvas";
const canvasDimensions = {
  x : 1280,
  y : 720,
}

 // @ts-ignore
const config = {
    dataUrl: `${GAME_PATH}/Build/${BUILD_NAME}.data.unityweb`,
    frameworkUrl: `${GAME_PATH}/Build/${BUILD_NAME}.framework.js.unityweb`,
    codeUrl: `${GAME_PATH}/Build/${BUILD_NAME}.wasm.unityweb`,
    streamingAssetsUrl: "StreamingAssets",
    companyName: "DevManDan",
    productName: BUILD_NAME,
    productVersion: "1.1",
};

const fileInfo : FileInfo = {
  buildName: BUILD_NAME,
  gamePath: GAME_PATH,
}


const titleElement = <p className="pb-5 text-center font-bold"> SIDESTEP² </p>

const descriptionElement : ReactElement = <span>
  <span className="text-[18px] text-left w-[85%] tracking-wide leading-loose">
    Sidestep² is a bullet hell inspired by <span style={{color: "#abf8ff"}}> JSAB </span> and <span style={{color: "#d4b85d"}}> LoL Dodge Game</span>.<br/>
  </span>
  <span className="text-[18px] text-left w-[85%] tracking-wide leading-loose">
    It is also my <span className="text-orange-200">first ever project</span>. I hope you like it. <span className="text-blue-200/90">:D</span><br/>
</span>
  <span className="text-[15px] text-left w-[85%] tracking-wide leading-loose mt-5">
    Avoid the <span style={{color: "#ff9991"}}> red </span> and <span style={{color: "#fff49e"}}> yellow </span> projectiles. 
    <br/>
    <span style={{color: "#fff49e"}}> yellow </span> projectiles stun you briefly. <br/>
    <span className="text-[14px] text-white/45">
      Except on Endless mode.
    </span>
  </span>
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
      Lobby : Girl from Petaluma · Cocktail Shakers <br/>
      Level 1: Stayin' Alive - 8 Bit Universe <br/>
      Level 2: Wonky Trip - by me <br/>
      Level 3: Samurai - Jim Yosef <br/>
      Level 4: At the Speed of Light - Dimrain47 <br/>
      Level 5: Skystrike - Hinkik <br/>
      Endless Level : Endless - by me <br/>
    </span>
  </span>
</span>

const seoInfo : SEOInfo = {
  title : "Sidestep²", 
  description : "Bullet hell game"
}

export default function() {


  const gameEventLinkers : GameEventLinkers = [
    {
      gameEventName: "Sidestep2-highscore",
      handler: (score : number) => {
        console.log("Sidestep2 highscore:", score);
      }
    }
  ];

  return (
    <>
      <SEO
        title={seoInfo.title}
        description={seoInfo.description}
        image={seoInfo.image}
        url={seoInfo.url}
      />

      <div className="w-full h-screen flex flex-col items-center p-10 bg-zinc-950 text-white">
        <div className="text-3xl font-semibold">
          {titleElement}
        </div>

        <div className="w-full flex flex-col items-center">
          <UnityGame
            className="w-[calc(50%+125px)]"
            config={config}
            canvasDimensions={canvasDimensions}
            containerId={containerId}
            fileInfo={fileInfo}
            gameEventLinkers={gameEventLinkers}
            showFullscreenButton
          />
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
