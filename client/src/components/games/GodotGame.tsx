import { useEffect, useRef, useState, type ReactElement } from "react";
import type { GameEventLinkers } from "../../../types/exhibits/games";

export type GodotGameProps = {
  gamePath: string;
  className?: string;
  gameEventLinkers?: GameEventLinkers;
};

export default function GodotGame({
  gamePath,
  className,
  gameEventLinkers = [],
}: GodotGameProps): [ReactElement, () => void] {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const gameEventLinkersRef =
    useRef<GameEventLinkers>(gameEventLinkers);

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);


  const injectGodotEvents = () => {
    const iframeWindow =
      iframeRef.current?.contentWindow;

    if (!iframeWindow) {
      return;
    }

    gameEventLinkersRef.current.forEach(
      ({ gameEventName, handler }) => {

        const fn = (arg: unknown) => {
          handler(arg);
        };

        // @ts-expect-error dynamic
        iframeWindow[gameEventName] = fn;

        // @ts-expect-error dynamic
        iframeWindow.globalThis[gameEventName] = fn;

        // @ts-expect-error dynamic
        iframeWindow.self[gameEventName] = fn;
      }
    );
  };


  const watchGodotReady = () => {
    const iframeWindow = iframeRef.current?.contentWindow;

    if (!iframeWindow) {
      return;
    }
    
    const interval = window.setInterval(() => {

      try {
        // @ts-expect-error 
        const bridge = iframeWindow.JavaScriptBridge;

        if (bridge) {
          injectGodotEvents();
          clearInterval(interval);
        }

      } catch {
        // Ignore until Godot initializes
      }

    }, 250);

    setTimeout(() => {
      clearInterval(interval);
    }, 15000);
  };



  useEffect(() => {
    gameEventLinkersRef.current = gameEventLinkers;

    injectGodotEvents();

  }, [gameEventLinkers]);



  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!event.data) {
        return;
      }
        
      if (event.data.type === "godot-progress") {

        const value = Math.max(
          0,
          Math.min(
            1,
            event.data.progress
          )
        );

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



  const handleIframeLoad = () => {
    injectGodotEvents();
    watchGodotReady();
  };



  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return [
    (
      <div className={className}>
        <div
          ref={containerRef}
          className="relative overflow-hidden bg-zinc-700 rounded-md w-full aspect-video"
        >

          <iframe
            ref={iframeRef}
            src={gamePath}
            onLoad={handleIframeLoad}
            className="w-full h-full block"
            allow="fullscreen"
            title="godot-game"
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
      </div>
    ),
    toggleFullscreen,
  ];
}