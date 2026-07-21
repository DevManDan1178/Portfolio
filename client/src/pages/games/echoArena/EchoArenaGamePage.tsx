import { type ReactElement, useState } from "react";
import { styles } from "../../../style";
import SEO, { type SEOInfo } from "../../../components/misc/SEO";
import GodotGame from "../../../components/games/GodotGame";
import { echoArena } from "../../../assets";
import type { GameEventLinkers } from "../../../../types/exhibits/games";
import SubmittableLeaderboard from "../../../components/globalLists/SubmittableLeaderboard";
import { formatTime } from "../../../../../shared/constants/util";
import { maxNameLength } from "../../../../../shared/constants/api/globalBoards";

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

const seoInfo : SEOInfo = {
  title:"Echo Arena",
    image:echoArena,
    description:
      `Playable on PC in browser! ` +
      `Survival arena shooter where you must plan your movement carefully. ` +
      `Every 15 seconds, a new clone of yourself repeats your past movements, damaging anything it touches. `
}

export default function EchoArenaGamePage() {
  const [highscoreLeaderboard, highscoreAttemptSumbit] = SubmittableLeaderboard({
    category:"Echo Arena Highscore",
    title: "Highest scores",
    count: 20,
    theme: {
      font: "font-pixeloid"
    },
    submitSectionTitle: "BEST SCORE",
    placeholderName: "Name",
    submitButtonText: "SUBMIT",
    maxNameLength,
  })

  const [pacifistLeaderboard, pacifistAttemptSubmit] = SubmittableLeaderboard({
    category:"Echo Arena Pacifist",
    title: "LONGEST TIME WITHOUT KILLS",
    count: 20,
    theme: {
      font: "font-pixeloid",
    },
    submitSectionTitle: "BEST TIME",
    placeholderName: "Name",
    submitButtonText: "SUBMIT",
    scoreFormatFunction: (score : number | undefined) => score == undefined ? "-" : `${formatTime(score * 1000, 2)}s`,
    scoreStorageFactor: 1000,
    maxNameLength,
  })

  const [selectedLeaderboard, setSelectedLeaderboard] = useState<"highscore" | "pacifist">("highscore");

  const gameEventLinkers : GameEventLinkers = [
    {
      gameEventName: "onHighscoreChanged",
      handler(score : number) {
        console.log("new godot highscore", score);
        highscoreAttemptSumbit(score);
      },
    }, {
      gameEventName: "onZeroKillsDeath",
      handler(timeSurvived : number) {
        console.log("survived on zero kills for: ", timeSurvived);
        pacifistAttemptSubmit(timeSurvived);
      }
    }
  ];

  const [leaderboardsToggled, setLeaderboardsToggled] = useState(false)

  const [echoArenaGame, toggleFullscreen] = GodotGame({
    gamePath:FILE_PATH,
    gameEventLinkers:gameEventLinkers,
    className:"w-[calc(50%+125px)]"
  })

  return (
    <>
      <SEO
        title={seoInfo.title}
        description={seoInfo.description}
        image={seoInfo.image}
        url={seoInfo.url}
      />
      <div className="w-full h-screen flex flex-col bg-zinc-950 text-white">
        <div className="shrink-0 text-3xl font-semibold py-5 text-center font-pixeloid">
          ECHO ARENA
        </div>

        <div className="flex-1 flex flex-col justify-center items-center">
        {echoArenaGame}
        </div>
        <div className="w-full flex justify-center items-start gap-20 pt-5 pb-10">
          <div className="w-[calc(15%+50px)] flex justify-center">
            <button
              onClick={toggleFullscreen}
              className="mt-4 px-6 py-2 bg-white text-black font-pixeloid text-sm rounded hover:bg-zinc-300 transition"
            >
              FULLSCREEN
            </button>
          </div>

          <div className="w-[calc(15%+50px)] flex justify-center">
            <button
              className={`${leaderboardsToggled && "border-black/40 border-2"}  mt-4 px-6 py-2 bg-white text-black font-pixeloid text-sm rounded transition`}
              onClick={() => setLeaderboardsToggled(!leaderboardsToggled)}
            >
              {`LEADERBOARDS`}
            </button>
          </div>
        </div>

        <div 
          className={leaderboardsToggled ? "block" : "hidden"}
          aria-hidden={!leaderboardsToggled}
        >
          <div className="flex flex-col items-center w-full">
            <div className="w-full items-center justify-center flex gap-10">
              <button
                onClick={() => setSelectedLeaderboard("highscore")}
                className={`mt-4 px-2 py-1 ${selectedLeaderboard == "highscore" ? "cursor-default border-black/40 border-2" : "hover:bg-white/80"} bg-white  text-black font-pixeloid text-sm rounded  transition`}
              >
                HIGHSCORE
              </button>

              <button
                className={`mt-4 px-2 py-1 ${selectedLeaderboard == "pacifist" ? "cursor-default border-black/40 border-2" : "hover:bg-white/80"} bg-white  text-black font-pixeloid text-sm rounded  transition`}
                onClick={() => setSelectedLeaderboard("pacifist")}
              >
                PACIFIST
              </button>
            </div>
           
            
            <div className="w-full flex justify-center pb-10 font-pixeloid pt-10">
              {selectedLeaderboard == "highscore" ? highscoreLeaderboard : pacifistLeaderboard}
            </div>
          </div>
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