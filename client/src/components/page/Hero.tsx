import { useRef, useState, type RefObject } from 'react'
import { styles } from '../../style' 
import ComputerCanvas, { type UnityController } from '../canvas/Computers'
import { headerIntroElement, descriptionElement, COMPUTER_CANVAS_APPEARANCE_DELAY, COMPUTER_CANVAS_APPEARANCE_DURATION, TerminalTexts, TERMINAL_TEXT_APPEARANCE_DELAY, TERMINAL_TEXT_APPEARANCE_DURATION, TERMINAL_APPEARANCE_DELAY, TERMINAL_APPEARANCE_DURATION } from '../../constants/components/page/hero'
import { MENU_SCENES } from '../canvas/PolygonTD'
import AnimatedTextAppearance from '../effects/AnimatedTextAppearance'
import { motion } from 'framer-motion'
import { ScrollToNavId } from './Navbar'
import type { GameEventLinkers } from '../../../types/exhibits/games'


const Hero = () => {
  const [, setLevelProgress] = useState<number>(0)
  const [terminalText, setTerminalText] = useState<string>(TerminalTexts.TerminalIntroduction)
  const unityControllerRef = useRef<UnityController>(null)

  function OnLevelCleared(levelNumber : number) {
    setTerminalText(levelNumber >= 5 ? TerminalTexts.LastLevelClear : TerminalTexts.LevelCleared)
  }
  
  function OnLevelLost(/*levelNumber : number*/) {
    
  }

  function OnLevelStarted(/*levelNumber : number*/) {
    setTerminalText(TerminalTexts.LevelStarted)
  }

  function OnPauseToggled(paused : boolean) {
    setTerminalText(paused ? TerminalTexts.Paused : TerminalTexts.Unpaused)
  }

  function OnLevelProgressChanged(levelNumber : number) {
    setLevelProgress(levelNumber)
  }

  function OnSceneChanged(sceneName : string) {
    if (sceneName === MENU_SCENES.levelSelect) {
      setTerminalText(TerminalTexts.LevelSelect)
    } else if (sceneName === MENU_SCENES.mainMenu) {
      setTerminalText(TerminalTexts.Menu)
    }
  }

  const gameEventLinkers : RefObject<GameEventLinkers> = useRef([
    {
      gameEventName: "PolygonTD-pause-toggled", 
      handler: OnPauseToggled
    }, {
      gameEventName: "PolygonTD-level-starting",
      handler: OnLevelStarted
    }, {
      gameEventName: "PolygonTD-level-lost",
      handler: OnLevelLost
    }, {
      gameEventName: "PolygonTD-level-cleared",
      handler: OnLevelCleared
    }, {
      gameEventName: "PolygonTD-player-level-progression",
      handler: OnLevelProgressChanged
    }, {
      gameEventName: "PolygonTD-scene-change",
      handler: OnSceneChanged
    }
  ])


  return (
    <div className='relative w-full min-h-svh mx-auto z-10 overflow-hidden flex flex-col items-center justify-start'>
      <div className={`${styles.paddingX} absolute inset-0 py-2 top-[40px] max-w-7xl mx-auto flex flex-row items-start gap-5`}>
        <div>
          <h2 className={`${styles.heroHeadText} text-white`}>
            {headerIntroElement}
          </h2>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            {descriptionElement}
          </p>
        </div>
      </div>  
      <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { y: -50, opacity: 0 },
            show: { y: 0, opacity: 1, transition: { delay: COMPUTER_CANVAS_APPEARANCE_DELAY, duration: COMPUTER_CANVAS_APPEARANCE_DURATION } },
          }}
          layout
        >
        <div className='relative h-[80svh] aspect-14/9 flex justify-start items-center overflow-hidden'>
          {/* Left border */}
          <div className=' absolute left-0 top-0 w-[2px] h-full bg-linear-to-t from-white/30 to-transparent z-10' />

          {/* Right border */}
          <div className='absolute right-0 top-0 w-[2px] h-full bg-linear-to-t from-white/30 to-transparent z-10' />

          {/* Bottom border */}
          <div className='absolute bottom-0 left-0 h-[2px] w-[calc(100%-4px)] ml-[2px] mr-[2px] bg-white/30 z-10' />       
          <ComputerCanvas gameEventLinkers={gameEventLinkers} unityControllerRef={unityControllerRef}/>
            
        </div>
      </motion.div>
      <motion.div 
        className="absolute left-1/2 h-[calc(5svh+25px)] bottom-[calc(7.5svh+15px)] sm:w-[calc(50% + 50px)] w-[calc(40svh+50px+10%)] max-w-xl justify-between items-center flex -translate-x-1/2"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {x : 0, y: 100, opacity: 0 },
          show: {x: 0, y: 0, opacity: 1, transition: { delay: TERMINAL_APPEARANCE_DELAY, duration: TERMINAL_APPEARANCE_DURATION } },
        }}
        layout
        >
        <button 
          className='w-full h-[calc(5svh+15px)] items-center justify-center flex  bg-gray-950/50 rounded-3xl cursor-pointer'
          onClick={() => ScrollToNavId("about")}
        >
          <div className='h-full w-full rounded-2xl border-4 border-secondary flex justify-center p-2 items-center overflow-hidden'>
            <p className={`${styles.terminalTextSizeStyle}`}>
              <AnimatedTextAppearance appearOnlyOnce text={terminalText} timeBetweenLetters={TERMINAL_TEXT_APPEARANCE_DURATION/terminalText.length} delay={TERMINAL_TEXT_APPEARANCE_DELAY} startingState={{translateY: 10}}/>             
            </p>
          </div>
        </button> 
      </motion.div>
    </div>
  )
}

export default Hero