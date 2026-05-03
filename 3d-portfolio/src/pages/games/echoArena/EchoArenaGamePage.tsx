import { useEffect, useRef, useState, type ReactElement } from "react";

const FILE_PATH = "/games/EchoArena";

const descriptionList : ReactElement[] = [
    <span className="text-[18px] text-left w-[85%] tracking-wide leading-loose">
    Echo Arena is a simple survival arena shooter where you must plan your movement carefully.<br/>
    </span>,
    <span className="text-[15px] text-left w-[85%] tracking-wide leading-loose mt-5">
    Every 15 seconds, a new shadow starts repeating your past actions. <br/>
    How long can you survive while avoiding past versions of yourself? </span>,
    <span className="text-[13px] font-pixeloid">
    <br/>
    Pressing space will initiate a dash.
    <br/>
    <span className="text-[14px] text-white/35">
    <br/><br/>
    Music - Retro Platforming by David Feslyan<br/>
    </span>
  </span>
]

export default function EchoArenaGamePage() {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (!event.data) return;

            if (event.data.type === "godot-progress") {
                const value = Math.max(0, Math.min(1, event.data.progress));
                console.log(value)
                setProgress(value);

                if (value >= 1) {
                    setTimeout(() => setLoading(false), 300);
                }
            }
        };

        window.addEventListener("message", handler);

        return () => window.removeEventListener("message", handler);
    }, []);

    return (
        <div className="w-full h-screen flex flex-col bg-zinc-950 text-white">
            {/* TITLE */}
            <div className="shrink-0 text-3xl font-semibold py-5 text-center font-pixeloid">
                ECHO ARENA
            </div>

            {/* GAME AREA (THIS IS THE IMPORTANT FIX) */}
            <div className="flex-1 flex justify-center items-center">
                
                <div className="w-[calc(50%+125px)] aspect-video relative overflow-hidden bg-zinc-700 rounded-md">
                    <iframe
                        ref={iframeRef}
                        src={`${FILE_PATH}/index.html`}
                        className="w-full h-full block"
                    />

                {/* LOADING OVERLAY */}
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 gap-4">
                        
                        <div className="font-pixeloid text-[30px] text-white">
                            LOADING...
                        </div>

                    {/* PROGRESS BAR*/}
                    <div className="w-[60%] h-4 bg-zinc-800 overflow-hidden">          
                         {/* PROGRESS BAR FILL */}
                         <div
                            className="h-full bg-white transition-transform duration-200"
                            style={{ width: `${Math.floor(progress * 100)}%` }}
                        />
                        </div>
                        {/* PERCENT TEXT */}
                        <div className="text-[25px] text-zinc-400 font-pixeloid">
                            {Math.floor(progress * 100)}%
                        </div>
                    </div>
                )}
            </div>
                </div>

            {/* DESCRIPTION */}
            <div className="shrink-0 w-full flex justify-center text-sm text-zinc-400 py-5">
                <div className="w-full max-w-[80%] text-center">
                    {descriptionList.map((description, index) => (
                        <p key={index}>{description}<br/></p>
                    ))}
                </div>
            </div>
        </div>   
    );
}