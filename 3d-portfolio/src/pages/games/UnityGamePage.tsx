import { useEffect, useRef, useState, type ReactElement } from "react";

export type FileInfo = {gamePath : string, buildName : string}

export default function UnityGamePage({ descriptionList, config, canvasDimensions, containerId, fileInfo } : {descriptionList : ReactElement[], config : UnityLoaderConfig, canvasDimensions : {x : number, y : number}, containerId : string, fileInfo : FileInfo}) : () => ReactElement {
    return () => {
        const [loadingProgress, setLoadingProgress] = useState<number>(0)
        const containerRef = useRef<HTMLDivElement>(null);
        const canvasRef = useRef<HTMLCanvasElement | null>(null);
        const unityInstanceRef = useRef<any>(null);

        
        function onLoadingProgress(progress : number) {
            console.log("loading progress ", progress)
            setLoadingProgress(progress)
        }

        useEffect(() => {
            if (!containerRef.current || canvasRef.current) return;

            // Create canvas
            const canvas = document.createElement("canvas");
            canvas.id = containerId;
            canvas.width = canvasDimensions.x;
            canvas.height = canvasDimensions.y;
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.style.display = "block";
            canvas.style.touchAction = "none";
            canvas.style.borderRadius = "12px"
            canvasRef.current = canvas;
            containerRef.current.appendChild(canvas);

            // Load Unity script
            const script = document.createElement("script");
            script.src = `${fileInfo.gamePath}/Build/${fileInfo.buildName}.loader.js`;
            script.async = true;

            script.onload = () => {
            // @ts-ignore
            createUnityInstance(canvas, config, onLoadingProgress).then((unityInstance: UnityInstance) => {
                unityInstanceRef.current = unityInstance;
                canvas.focus()
                
                unityInstance.SendMessage("InputBridge", "SetRealInputReaderDisabled", "false");
                unityInstance.SendMessage("InputBridge", "SetCanQuit", "false")
                window.addEventListener("beforeunload", () => {
                unityInstance?.Quit?.();
                });
            });
            };

            document.body.appendChild(script);

            return () => {
            script.remove();
            canvas.remove();
            unityInstanceRef.current?.Quit?.();
            };
        }, []);

        return (
            <div className="w-[100%] h-screen flex flex-col items-center justify-normal p-10 bg-zinc-950 text-white">
            
            <div className="text-3xl font-semibold ">
                <p className="pb-5 text-center font-pixeloid">POLYGON TOWER DEFENSE</p> 
            </div>

            <div 
                className="w-[calc(50%+125px)] aspect-video border-2 border-zinc-700 rounded-2xl flex items-center justify-center relative"
                ref={containerRef}
            > 
                {loadingProgress < 0.99 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="font-pixeloid text-[40px] text-white">
                    LOADING - {Math.floor(loadingProgress * 100)}%
                    </div>
                </div>
                )}
            </div>
            
            <div className="relative w-full flex justify-center text-sm text-zinc-400 pt-5">
                <div className="w-full max-w-[80%] text-center">
                {descriptionList.map((description : ReactElement, index : number) => (
                    <p key={index}>
                    {description}
                    <br/>
                    </p>
                
                ))

                }
                </div>
            </div>
            </div>
        );
    }
}

export type UnityLoaderConfig = {
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
  streamingAssetsUrl?: string;

  companyName?: string;
  productName?: string;
  productVersion?: string;

  // optional advanced Unity WebGL fields (sometimes used)
  webglContextAttributes?: Record<string, any>;
  matchWebGLToCanvasSize?: boolean;
  devicePixelRatio?: number;
};


export type UnityInstance = {
  // Core messaging (MOST IMPORTANT)
  SendMessage: (
    gameObjectName: string,
    methodName: string,
    value?: string | number | boolean
  ) => void;

  // Lifecycle
  Quit?: () => Promise<void> | void;
  RemoveFocus?: () => void;

  // Fullscreen control (Unity WebGL template feature)
  SetFullscreen?: (enabled: 0 | 1) => void;

  // Loading / progress (depends on loader version)
  Module?: {
    canvas?: HTMLCanvasElement;
    WebGL?: WebGLRenderingContext;
    requestFullscreen?: () => void;
    exitFullscreen?: () => void;
  };

  // Memory / runtime hooks (sometimes exposed depending on build)
  SendInternalMessage?: (target: string, method: string, value?: string) => void;

  // Optional debug / stats (not always present)
  SetProfilerEnabled?: (enabled: boolean) => void;

  // Unity loader metadata (varies by template)
  loaderUrl?: string;
  dataUrl?: string;
  frameworkUrl?: string;
  codeUrl?: string;
};
