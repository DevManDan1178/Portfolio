import { useEffect, useRef, useState } from "react";

const FILE_PATH = "/games/EchoArena";

export default function EchoArenaGamePage() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-normal p-10 bg-zinc-950 text-white">
      <div className="text-3xl font-semibold">
        <p className="pb-5 text-center font-pixeloid">
          ECHO ARENA
        </p>
      </div>
      <div className="w-[calc(50%+125px)] aspect-video border-2 border-zinc-700 relative bg-black rounded-md overflow-hidden">

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 gap-4">

            <div className="font-pixeloid text-[30px] text-white">
              LOADING...
            </div>
            {/* PROGRESS BAR BACKGROUND */}
            <div className="w-[60%] h-4 bg-zinc-800 rounded-sm overflow-hidden">
            
            {/* PROGRESS BAR FILL */}
            <div
                className="h-full bg-white transition-all duration-200"
                style={{ width: `${Math.floor(progress * 100)}%` }}
            />
            </div>

            {/* PERCENT TEXT */}
            <div className="text-[25px] text-zinc-400 font-pixeloid">
            {Math.floor(progress * 100)}%
            </div>

          </div>
        )}

        <iframe
          ref={iframeRef}
          src={`${FILE_PATH}/index.html`}
          className="w-full h-full border-0 block"
          style={{ backgroundColor: "black", visibility: loading ? "hidden" : "visible"}}
          onLoad={() => {
            setProgress(1);
            setTimeout(() => setLoading(false), 800);
          }}
        />
      </div>
    </div>
  );
}