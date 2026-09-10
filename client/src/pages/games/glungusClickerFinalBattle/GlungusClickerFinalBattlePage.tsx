import { type ReactElement } from "react";
import { styles } from "../../../style";
import SEO, { type SEOInfo } from "../../../components/misc/SEO";
import GodotGame from "../../../components/games/GodotGame";
import { glungusClickerFinalBattle } from "../../../assets";

const FILE_PATH = "/games/GlungusClickerFinalBattle/index.html";

const titleElement = <p className="pb-5 text-center font-pixeloid"> Glungus Clicker: Final Battle </p>

const descriptionElement: ReactElement = (
  <span className={styles.subDescriptionText}>
    <span className="text-[18px] text-left w-[85%] tracking-wide leading-loose">
        A five minute intense incremental-clicker-defense game.
      <br />
    </span>

    <span className="text-[20px] text-left w-[85%] tracking-wide leading-loose mt-5">
      Glungus wants to steal your treasure! 
      <br />
      Protect it at all costs by clicking on the invaders.
      <br />
      Upgrade your clicking to match his firepower!
      <br />
        
    </span>

    <span className="text-[13px] font-pixeloid">
      <br />
      Escape key to open the pause menu.
      <br />
      Your clicks have a cooldown of 0.2s.
      <br />
      <span className="text-[14px] text-white/35">
        <br />
        <br />
        Music: &nbsp;
        <a href="https://www.youtube.com/watch?v=Q-_4Rd2wMRc" className="font-semibold">WHAT THE CAT!? </a> 
        and 
        <a href="https://www.youtube.com/watch?v=YjVyuQaUfaQ" className="font-semibold"> Final Battle - 8-Bit/Chiptune Cover</a>
        <br />
      </span>
    </span>
  </span>
);

const seoInfo : SEOInfo = {
  title:"Glungus Clicker: Final Battle",
    image: glungusClickerFinalBattle,
    description:
      `Playable on PC in browser! ` +
      `Fast paced survival clicker incremental. ` +
      `Defend your treasure and survive against Glungus and his army. `
}

export default function GlungusClickerFinalBattleGamePage() {
 
  const [glungusClickerGame, toggleFullscreen] = GodotGame({
    gamePath:FILE_PATH,
    className:"w-[calc(50%+125px)]",
    enableLoadingScreenOverlay: false
  })

  return (
    <>
      <SEO
        title={seoInfo.title}
        description={seoInfo.description}
        image={seoInfo.image}
        url={seoInfo.url}
      />
      <div className="w-full h-full flex flex-col bg-zinc-950 text-white">
        <div className="shrink-0 text-3xl font-semibold py-5 text-center font-pixeloid">
          {titleElement}
        </div>

        <div className="flex-1 flex flex-col justify-center items-center">
        {glungusClickerGame}
        </div>
        <div className="w-full flex justify-center items-start gap-20 pt-5 pb-10">
          <div className="w-[calc(15%+50px)] flex justify-center">
            <button
              onClick={toggleFullscreen}
              className="mt-4 px-6 py-2 bg-white text-black font-pixeloid text-sm rounded-sm hover:bg-zinc-300 transition"
            >
              FULLSCREEN
            </button>
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