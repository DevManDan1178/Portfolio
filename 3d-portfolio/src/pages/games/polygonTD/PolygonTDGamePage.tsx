import { type ReactElement } from "react";
import UnityGamePage, { type FileInfo } from "../UnityGamePage";


const GAME_PATH = "/games/PolygonTD";
const BUILD_NAME = "WebBuild_1.2.5";


const containerId = "PolygonTD_UnityCanvas";
const canvasDimensions = {
  x : 1280,
  y : 720,
}

 // @ts-ignore
const config = {
    dataUrl: `${GAME_PATH}/Build/${BUILD_NAME}.data`,
    frameworkUrl: `${GAME_PATH}/Build/${BUILD_NAME}.framework.js`,
    codeUrl: `${GAME_PATH}/Build/${BUILD_NAME}.wasm`,
    streamingAssetsUrl: `${GAME_PATH}/StreamingAssets`,
    companyName: "DevManDan",
    productName: BUILD_NAME,
    productVersion: "1.2.5",
};

const fileInfo : FileInfo = {
  buildName: BUILD_NAME,
  gamePath: GAME_PATH
}

const descriptionList : ReactElement[] = [
  <span className="text-[18px] text-left w-[85%] tracking-wide leading-loose">Polygon TD is a simple tower defense game where towers and enemies are just basic shapes.<br/></span>,
  <span className="text-[15px] text-left w-[85%] tracking-wide leading-loose mt-5">
    Place turrets on <span style={{color: "#d7bbfd"}}> tiles</span> to defend the <span style={{color: "#ecf170", opacity: 0.85}}>endpoint</span>. 
    Tailor your own tower upgrades and optimize your defenses.<br/> 
    Extensions to the <span style={{color: "#ffffff", opacity: 0.85}}>path</span> only apply when connected adjacent to the <span style={{color: "#ecf170", opacity: 0.85}}>endpoint</span>
  </span>,
  <span className="text-[13px] font-pixeloid">
    <br/>
    Number keys can select the corresponding items in your hotbar. Pressing Q will cancel placement.
    <br/>
    Camera can be moved with WASD or arrow keys.
    Toggle camera controls with the space bar (or press the button).
    <br/>
    <span className="text-[10px] font-pixeloid">
      I have you hostage. You cannot quit the game. {">:)"} <br/><br/>
    </span>
    <span className="text-[14px] text-white/35">
      Soundtracks by me {":)"} <br/>
      <span className="text-[10px]">(They aren't published)</span>
    </span>
  </span>
]

export default UnityGamePage({
  descriptionList : descriptionList,
  canvasDimensions : canvasDimensions,
  config : config,
  fileInfo : fileInfo,
  containerId : containerId,
})

/*
export default function PolygonTDGamePage() {
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
    canvas.id = CONTAINER_ID;
    canvas.width = CANVAS_DIMENSIONS.x;
    canvas.height = CANVAS_DIMENSIONS.y;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = "none";
    canvas.style.borderRadius = "12px"
    canvasRef.current = canvas;
    containerRef.current.appendChild(canvas);

    // Load Unity script
    const script = document.createElement("script");
    script.src = `${GAME_PATH}/Build/${BUILD_NAME}.loader.js`;
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
  */