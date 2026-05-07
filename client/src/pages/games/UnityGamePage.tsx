import { useEffect, useRef, useState, type ReactElement } from "react";
import SEO from "../../components/effects/SEO";

export type FileInfo = {gamePath: string; buildName: string };
export type SEOInfo = {title : string, description : string}

export default function UnityGamePage({
  titleElement,
  descriptionElement,
  config,
  canvasDimensions,
  containerId,
  fileInfo,
  seoInfo,
}: {
  titleElement : ReactElement,
  descriptionElement: ReactElement,
  config: UnityLoaderConfig,
  canvasDimensions: { x: number, y: number },
  containerId: string,
  fileInfo: FileInfo,
  seoInfo : SEOInfo
}): () => ReactElement {
  return () => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState<number>(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const unityInstanceRef = useRef<UnityInstance | null>(null);
    const isQuittingRef = useRef(false);

    function onLoadingProgress(progress: number) {
      setProgress(progress);
    }

    useEffect(() => {
      if (!containerRef.current) return;
      if (unityInstanceRef.current) return; 

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

      const startUnity = () => {
        // @ts-ignore
        createUnityInstance(canvas, config, onLoadingProgress).then(
          (unityInstance: UnityInstance) => {
            unityInstanceRef.current = unityInstance;

            canvas.focus();

            unityInstance.SendMessage(
              "InputBridge",
              "SetRealInputReaderDisabled",
              "false"
            );
            unityInstance.SendMessage("InputBridge", "SetCanQuit", "false");

            setLoading(false);
          }
        );
      };

      if (!script) {
        script = document.createElement("script");
        script.src = loaderSrc;
        script.async = true;
        script.onload = startUnity;
        document.body.appendChild(script);
      } else {
        // script already exists
        if ((window as any).createUnityInstance) {
          startUnity();
        } else {
          script.onload = startUnity;
        }
      }

      return () => {
        const unity = unityInstanceRef.current;

        if (unity && !isQuittingRef.current) {
          isQuittingRef.current = true;

          //@ts-ignore
          unity.Quit?.().then(() => {
            unityInstanceRef.current = null;

            if (canvasRef.current) {
              canvasRef.current.remove();
              canvasRef.current = null;
            }
          });
        } else {
          if (canvasRef.current) {
            canvasRef.current.remove();
            canvasRef.current = null;
          }
        }
      };
    }, []);

    const handleFullscreen = () => {
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

    return (<>
      <SEO title={seoInfo.title} description={seoInfo.description} />
      <div className="w-[100%] h-screen flex flex-col items-center justify-normal p-10 bg-zinc-950 text-white">
        <div className="text-3xl font-semibold">
          {titleElement}
        </div>

        <div className="w-full flex flex-col items-center">
          <div
            className="w-[calc(50%+125px)] aspect-video border-4 border-zinc-700 rounded-2xl flex items-center justify-center relative"
            ref={containerRef}
          >
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/80 z-10 gap-4">
                <div className="font-pixeloid text-[30px] text-white">
                  LOADING...
                </div>

                <div className="w-[60%] h-4 bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-[0.1s]"
                    style={{ width: `${Math.floor(progress * 100)}%` }}
                  />
                </div>

                <div className="text-[25px] text-zinc-400 font-pixeloid">
                  {Math.floor(progress * 100)}%
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleFullscreen}
            className="mt-4 px-6 py-2 bg-white text-black font-pixeloid text-sm rounded hover:bg-zinc-300 transition"
          >
            Fullscreen
          </button>
        </div>

        <div className="relative w-full flex justify-center text-sm text-zinc-400 pt-5">
          <div className="w-full max-w-[80%] text-center">
            {descriptionElement}
          </div>
        </div>
      </div>
    </>);
  };
}

export type UnityLoaderConfig = {
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
  streamingAssetsUrl?: string;

  companyName?: string;
  productName?: string;
  productVersion?: string;

  webglContextAttributes?: Record<string, any>;
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