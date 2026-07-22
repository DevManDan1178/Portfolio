import type { ReactElement } from "react";
import SEO from "../../components/misc/SEO";
import UnityGame, {
  type FileInfo,
  type UnityLoaderConfig,
} from "../../components/games/UnityGame";
import type { GameEventLinkers } from "../../../types/exhibits/games";
import { type SEOInfo } from "../../components/misc/SEO";

export type UnityGamePageProps = {
  titleElement: ReactElement;
  descriptionElement: ReactElement;
  config: UnityLoaderConfig;
  canvasDimensions: { x: number; y: number };
  containerId: string;
  fileInfo: FileInfo;
  seoInfo: SEOInfo;
  gameEventLinkers?: GameEventLinkers;
};


export default function UnityGamePage({
  titleElement,
  descriptionElement,
  config,
  canvasDimensions,
  containerId,
  fileInfo,
  seoInfo,
  gameEventLinkers = [],
}: UnityGamePageProps) {
  return function UnityGamePageComponent() {

    const [game, toggleFullscreen] = UnityGame({
      className:"w-[calc(50%+125px)]",
      config,
      canvasDimensions,
      containerId,
      fileInfo,
      gameEventLinkers,
    })

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
            {game}
          </div>
          <button
            onClick={toggleFullscreen}
            className="mt-4 px-6 py-2 bg-white text-black font-pixeloid text-sm rounded-sm hover:bg-zinc-300 transition"
          >
            Fullscreen
          </button>
          <div className="relative w-full flex justify-center text-sm text-zinc-400 pt-5">
            <div className="w-full max-w-[80%] text-center">
              {descriptionElement}
            </div>
          </div>
        </div>
      </>
    );
  };
}