import { useEffect, useRef, useState, type ReactElement } from "react";
import type { GameEventLinkers } from "../../../types/exhibits/games";

declare global {
  interface Window {
    createUnityInstance?: (
      canvas: HTMLCanvasElement,
      config: UnityLoaderConfig,
      onProgress?: (progress: number) => void
    ) => Promise<unknown>;
  }
}

export {};

export {};

type UnityGameProps = {
  config: UnityLoaderConfig;
  canvasDimensions: { x: number; y: number };
  containerId: string;
  fileInfo: FileInfo;
  gameEventLinkers?: GameEventLinkers;
  className?: string;
  showFullscreenButton?: boolean;
  loadingText? : string | ReactElement;
};

export default function UnityGame({
  config,
  canvasDimensions,
  containerId,
  fileInfo,
  gameEventLinkers = [],
  className,
  loadingText = "LOADING...",
}: UnityGameProps) : [ReactElement, () => void] {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const unityInstanceRef = useRef<UnityInstance | null>(null);
  const isQuittingRef = useRef(false);
  const gameEventLinkersRef = useRef<GameEventLinkers>(gameEventLinkers);

  useEffect(() => {
    gameEventLinkersRef.current = gameEventLinkers;
  }, [gameEventLinkers]);

  const onLoadingProgress = (progress: number) => {
    setProgress(progress);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    if (unityInstanceRef.current) return;

    let cancelled = false;

    const canvas = document.createElement("canvas");
    canvas.id = containerId;
    canvas.width = canvasDimensions.x;
    canvas.height = canvasDimensions.y;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = "none";
    canvas.style.borderRadius = "12px";

    canvasRef.current = canvas;
    containerRef.current.appendChild(canvas);

    const loaderSrc = `${fileInfo.gamePath}/Build/${fileInfo.buildName}.loader.js`;

    let script = document.querySelector(
      `script[src="${loaderSrc}"]`
    ) as HTMLScriptElement | null;

    const listeners: Array<{
      name: string;
      handler: EventListener;
    }> = [];

    const startUnity = () => {
      // @ts-expect-error createUnityInstance exists but is not detected
      createUnityInstance(canvas, config, onLoadingProgress).then(
        (unityInstance: UnityInstance) => {
          if (cancelled) {
            unityInstance.Quit?.();
            return;
          }

          unityInstanceRef.current = unityInstance;
          isQuittingRef.current = false;

          canvas.focus();

          unityInstance.SendMessage(
            "InputBridge",
            "SetRealInputReaderDisabled",
            "false"
          );
          unityInstance.SendMessage(
            "InputBridge",
            "SetCanQuit",
            "false"
          );

          gameEventLinkersRef.current.forEach(({ gameEventName, handler }) => {
            const listener: EventListener = (e) => {
               // @ts-expect-error detail should exist
              handler((e as CustomEvent).detail);
            };

            window.addEventListener(gameEventName, listener);

            listeners.push({
              name: gameEventName,
              handler: listener,
            });
          });

          setLoading(false);
        }
      );
    };

    if (!script) {
      script = document.createElement("script");
      script.src = loaderSrc;
      script.async = true;
      script.addEventListener("load", startUnity);
      document.body.appendChild(script);
    } else {
      if (window.createUnityInstance) {
        startUnity();
      } else {
        script.addEventListener("load", startUnity);
      }
    }

    return () => {
      cancelled = true;

      if (script) {
        script.removeEventListener("load", startUnity);
      }

      listeners.forEach(({ name, handler }) => {
        window.removeEventListener(name, handler);
      });

      const unity = unityInstanceRef.current;

      if (unity && !isQuittingRef.current) {
        isQuittingRef.current = true;

        const quit = unity.Quit?.();

        if (quit instanceof Promise) {
          quit.then(() => {
            unityInstanceRef.current = null;
            isQuittingRef.current = false;

            if (canvasRef.current) {
              canvasRef.current.remove();
              canvasRef.current = null;
            }
          });
        } else {
          unityInstanceRef.current = null;
          isQuittingRef.current = false;

          if (canvasRef.current) {
            canvasRef.current.remove();
            canvasRef.current = null;
          }
        }
      } else if (canvasRef.current) {
        canvasRef.current.remove();
        canvasRef.current = null;
      }
    };
  }, [
    config,
    containerId,
    canvasDimensions,
    fileInfo,
  ]);

  const toggleFullscreen = () => {
    const unity = unityInstanceRef.current;

    if (unity?.SetFullscreen) {
      unity.SetFullscreen(1);
      return;
    }

    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return [(
    <div className={className}>
      <div
        ref={containerRef}
        className="relative w-full aspect-video border-4 border-zinc-700 rounded-2xl flex items-center justify-center"
      >
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/80 z-10 gap-4">
            <div className="font-pixeloid text-[30px] text-white text-center whitespace-pre-wrap">
              {loadingText}
            </div>

            <div className="w-[60%] h-4 bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
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
  toggleFullscreen
  ]
}

export type UnityLoaderConfig = {
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
  streamingAssetsUrl?: string;

  companyName?: string;
  productName?: string;
  productVersion?: string;

  webglContextAttributes?: Record<string, WebGLContextAttributes>;
  matchWebGLToCanvasSize?: boolean;
  devicePixelRatio?: number;
};

export type UnityInstance = {
  SendMessage: (
    gameObjectName: string,
    methodName: string,
    value?: string | number | boolean
  ) => void;

  Quit?: () => Promise<void> | void;
  RemoveFocus?: () => void;

  SetFullscreen?: (enabled: 0 | 1) => void;

  Module?: {
    canvas?: HTMLCanvasElement;
    WebGL?: WebGLRenderingContext;
    requestFullscreen?: () => void;
    exitFullscreen?: () => void;
  };

  SendInternalMessage?: (
    target: string,
    method: string,
    value?: string
  ) => void;

  SetProfilerEnabled?: (enabled: boolean) => void;

  loaderUrl?: string;
  dataUrl?: string;
  frameworkUrl?: string;
  codeUrl?: string;
};

export type FileInfo = {gamePath: string; buildName: string };