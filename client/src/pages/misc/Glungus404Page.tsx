import {   useState, type ReactNode } from "react";
import SEO from "../../components/misc/SEO";
import { styles } from "../../style";
import { glungus } from "../../assets";



export default function Glungus404Page() {
  return (<>
    <SEO title="404 Not Found" description="GLUNGUS CLICKER?"/>
    
    <div className={`items-center justify-center text-center ${styles.sectionHeadText} mt-10`}>
        <span className={"text-white md:text-[24px] sm:text-[20px] text-[16px] leading-tight md:pb-8 sm:pb-6 pb-4"}> 
          404 NOT FOUND
        </span>
        <br/>
        <span className={styles.sectionSubText}> 
          but we found this instead
        </span>
    </div>

    <div className="items-center justify-center flex pt-2">
        <GlungusClicker/>
    </div>
  
  </>);
};

function GlungusClicker(): ReactNode {
  const [clickCount, setClickCount] = useState(0);
  const [clicks, setClicks] = useState<{ id: number }[]>([]);

  const handleClick = () => {
    setClickCount((count) => count + 1);

    const id = Date.now();

    setClicks((prev) => [...prev, { id }]);

    setTimeout(() => {
      setClicks((prev) => prev.filter((click) => click.id !== id));
    }, 800);
  };

  return (
    <div className="items-center justify-center text-center mt-2">
      <h1 className="font-pixeloid text-xl">GLUNGUS CLICKER!1!!1</h1>

      <div className="relative flex items-center justify-center w-full">
        <button
          onClick={handleClick}
          className="w-[calc(40%+50px)] hover:w-[calc(40%+75px)] transition-[width] flex items-center justify-center duration-300 hover:animate-shake-y"
        >
          <img
            className="w-[95%] active:w-[calc(95%+5px)] aspect-1 border-white/5 hover:border-white/15 active:border-white/25 border-4 rounded-lg"
            src={glungus}
          />
        </button>
      </div>

      <h1 className="font-pixeloid text-xl">
        {clickCount} 
         {/* Floating +1s */}
        {clicks.map((click) => (
          <span
            key={click.id}
            className="text-[10px] absolute text-white font-pixeloid animate-float-up pointer-events-none"
          >
            +1
          </span>
        ))}

      </h1>
    </div>
  );
}