import type { ReactElement } from "react";
import { styles } from "../../../style";
import SEO from "../../../components/misc/SEO";
import GodotGame from "../../../components/games/GodotGame";
import { echoArena } from "../../../assets";
import type { GameEventLinkers } from "../../../../types/exhibits/games";

const FILE_PATH = "/games/EchoArena/index.html";

const descriptionElement: ReactElement = (
  <span className={styles.subDescriptionText}>
    <span className="text-[18px] text-left w-[85%] tracking-wide leading-loose">
      Echo Arena is a simple survival arena shooter where you must plan your
      movement carefully.
      <br />
    </span>

    <span className="text-[15px] text-left w-[85%] tracking-wide leading-loose mt-5">
      Every 15 seconds, a new{" "}
      <span className="text-gray-400/80">shadow</span> starts repeating your
      past actions.
      <br />
      How long can you survive while avoiding past versions of yourself?
    </span>

    <span className="text-[13px] font-pixeloid">
      <br />
      <br />
      Pressing space will initiate a dash.
      <br />
      <span className="text-[14px] text-white/35">
        <br />
        <br />
        Music - Retro Platforming by David Feslyan
        <br />
      </span>
    </span>
  </span>
);

export default function EchoArenaGamePage() {


  const gameEventLinkers : GameEventLinkers = [
    {
      gameEventName: "onHighscoreChanged",
      handler: (score : number) => {
        console.log("Echo Arena highscore: ", score)
      }
    }
  ];
  return (
    <>
      <SEO
        title="Echo Arena"
        image={echoArena}
        description="Survival arena shooter where you must plan your movement carefully"
      />

      <div className="w-full h-screen flex flex-col bg-zinc-950 text-white">
        <div className="shrink-0 text-3xl font-semibold py-5 text-center font-pixeloid">
          ECHO ARENA
        </div>

        <div className="flex-1 flex flex-col justify-center items-center">
          <GodotGame
            className="w-[calc(50%+125px)]"
            gamePath={FILE_PATH}
            gameEventLinkers={gameEventLinkers}
          />
        </div>

        <div className="shrink-0 w-full flex justify-center text-sm text-zinc-400 py-5">
          <div className="w-full max-w-[80%] text-center">
            {descriptionElement}
          </div>
        </div>
      </div>
    </>
  );
}