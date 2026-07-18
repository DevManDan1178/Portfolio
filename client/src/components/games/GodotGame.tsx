import { useEffect, useRef, useState } from "react";
import type { GameEventLinkers } from "../../../types/exhibits/games";

export type GodotGameProps = {
  gamePath: string;
  className?: string;
  showFullscreenButton?: boolean;
  gameEventLinkers? : GameEventLinkers;
};


export default function GodotGame({
  gamePath,
  className,
  showFullscreenButton = true,
  gameEventLinkers = [],
}: GodotGameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!event.data) return;

      if (event.data.type === "godot-progress") {
        const value = Math.max(0, Math.min(1, event.data.progress));

        setProgress(value);

        if (value >= 1) {
          setTimeout(() => {
            setLoading(false);
          }, 300);
        }
      }
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);

  useEffect(() => {  
    gameEventLinkers.forEach(({ gameEventName, handler }) => {
      // @ts-expect-error - Godot injects dynamic window callbacks
      window[gameEventName] = handler;
    });

    return () => {
      gameEventLinkers.forEach(({ gameEventName, handler }) => {
        // @ts-expect-error - Godot injects dynamic window callbacks
        delete window[gameEventName]
      });
    }
  })

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative overflow-hidden bg-zinc-700 rounded-md w-full aspect-video"
      >
        <iframe
          ref={iframeRef}
          src={gamePath}
          className="w-full h-full block"
          allow="fullscreen"
        />

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 gap-4">
            <div className="font-pixeloid text-[30px] text-white">
              LOADING...
            </div>

            <div className="w-[60%] h-4 bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-[0.1s]"
                style={{
                  width: `${Math.floor(progress * 100)}%`,
                }}
              />
            </div>

            <div className="text-[25px] text-zinc-400 font-pixeloid">
              {Math.floor(progress * 100)}%
            </div>
          </div>
        )}
      </div>

      {showFullscreenButton && (
        <button
          onClick={handleFullscreen}
          className="mt-4 px-6 py-2 bg-white text-black font-pixeloid text-sm rounded hover:bg-zinc-300 transition"
        >
          FULLSCREEN
        </button>
      )}
    </div>
  );
}