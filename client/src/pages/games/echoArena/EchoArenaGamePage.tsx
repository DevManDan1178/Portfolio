import { type ReactElement, useState } from "react";
import { styles } from "../../../style";
import SEO from "../../../components/misc/SEO";
import GodotGame from "../../../components/games/GodotGame";
import { echoArena } from "../../../assets";
import type { GameEventLinkers } from "../../../../types/exhibits/games";
import SubmittableLeaderboard from "../../../components/globalLists/SubmittableLeaderboard";

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
  const [leaderboard, attemptSumbitScore] = SubmittableLeaderboard({
    category:"Echo Arena",
    title: "Highest scores",
    count: 20,
    theme: {
      font: "font-pixeloid"
    },
    bestScoreTitle: "BEST SCORE",
    placeholderName: "Name",
    submitButtonText: "SUBMIT"
  })

  const gameEventLinkers : GameEventLinkers = [
    {
      gameEventName: "onHighscoreChanged",
      handler(score : number) {
        console.log("new godot highscore", score);
        attemptSumbitScore(score);
      },
    }
  ];

  const [leaderboardToggled, setleaderboardToggled] = useState(false)

  const [echoArenaGame, handleFullscreen] = GodotGame({
    gamePath:FILE_PATH,
    gameEventLinkers:gameEventLinkers,
    className:"w-[calc(50%+125px)]"
  })

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
        {echoArenaGame}
        </div>
        <div className="w-full flex justify-center items-start gap-20 pt-5 pb-10">
          <div className="w-[calc(15%+50px)] flex justify-center">
            <button
              onClick={handleFullscreen}
              className="mt-4 px-6 py-2 bg-white text-black font-pixeloid text-sm rounded hover:bg-zinc-300 transition"
            >
              FULLSCREEN
            </button>
          </div>

          <div className="w-[calc(15%+50px)] flex justify-center">
            <button
              className="mt-4 px-6 py-2 bg-white text-black font-pixeloid text-sm rounded hover:bg-zinc-300 transition"
              onClick={() => setleaderboardToggled(!leaderboardToggled)}
            >
              LEADERBOARD
            </button>
          </div>
        </div>

        {leaderboardToggled && (
          <div className="w-full flex justify-center pb-10 font-pixeloid">
            {leaderboard}
          </div>
        )}
                
        <div className="shrink-0 w-full flex justify-center text-sm text-zinc-400 py-5">
          <div className="w-full max-w-[80%] text-center">
            {descriptionElement}
          </div>
        </div>
      </div>
    </>
  );
}