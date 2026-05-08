import { useRef, useState, type RefObject } from 'react'
import { styles } from '../style' 
import ComputerCanvas, { type UnityController } from './canvas/Computers'
import { headerIntroElement, descriptionElement, COMPUTER_CANVAS_APPEARANCE_DELAY, COMPUTER_CANVAS_APPEARANCE_DURATION, TerminalTexts, TERMINAL_TEXT_APPEARANCE_DELAY, TERMINAL_TEXT_APPEARANCE_DURATION, TERMINAL_APPEARANCE_DELAY, TERMINAL_APPEARANCE_DURATION } from '../constants/hero'
import { MENU_SCENES, type GameEventHandlers } from './canvas/PolygonTD'
import AnimatedTextAppearance from './effects/AnimatedTextAppearance'
import { motion } from 'framer-motion'
import { ScrollToNavId } from './Navbar'


const Hero = () => {
  const [_levelProgress, setLevelProgress] = useState<number>(0)
  const [terminalText, setTerminalText] = useState<string>(TerminalTexts.TerminalIntroduction)
  const unityControllerRef = useRef<UnityController>(null) 
  const gameEventHandlers : RefObject<GameEventHandlers> = useRef({
    OnLevelCleared(levelNumber) {
      setTerminalText(levelNumber >= 5 ? TerminalTexts.LastLevelClear : TerminalTexts.LevelCleared)
    },
    OnLevelLost(_levelNumber) {
      setTerminalText(TerminalTexts.LevelLost)
    },
    OnLevelStarted(_levelNumber) {
      setTerminalText(TerminalTexts.LevelStarted)
    },
    OnPauseToggled(paused) {
      setTerminalText(paused ? TerminalTexts.Paused : TerminalTexts.Unpaused)
    },
    OnLevelProgressChanged(levelNumber) {
      setLevelProgress(levelNumber)
    },
    OnSceneChanged(sceneName) {
      console.log(sceneName, MENU_SCENES.levelSelect)
      if (sceneName === MENU_SCENES.levelSelect) {
        setTerminalText(TerminalTexts.LevelSelect)
      } else if (sceneName === MENU_SCENES.mainMenu) {
        setTerminalText(TerminalTexts.Menu)
      }
    },
  })
  /*
  function startUnity() {
      const controller = unityControllerRef.current
      if (!controller) {
        console.log("no controller - delaying Unity start")
        setTimeout(startUnity, 100)
        return
      }
      controller.start()
      controller.started = true
    }*/

  //setTimeout(startUnity, 500) //Avoid starting initially due to lag spike
  return (
    <div className='relative w-full min-h-[100svh] mx-auto z-10 overflow-hidden flex flex-col items-center justify-start'>
      <div className={`${styles.paddingX} absolute inset-0 py-2 top-[40px] max-w-7xl mx-auto flex flex-row items-start gap-5`}>
         <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-[#915eff]'/>
          <div className='w-1 sm:h-80 h-40 violet-gradient'/>
        </div>
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
        <div className='relative h-[80svh] aspect-[12/9] flex justify-start items-center overflow-hidden'>
          {/* Left border */}
          <div className=' absolute left-0 top-0 w-[2px] h-full bg-gradient-to-t from-white/30 to-transparent z-10' />

          {/* Right border */}
          <div className='absolute right-0 top-0 w-[2px] h-full bg-gradient-to-t from-white/30 to-transparent z-10' />

          {/* Bottom border */}
          <div className='absolute bottom-0 left-0 h-[2px] w-[calc(100%-4px)] ml-[2px] mr-[2px] bg-white/30 z-10' />  
          
          { 
            <ComputerCanvas gameEventHandlers={gameEventHandlers} unityControllerRef={unityControllerRef}/>
          }      
        </div>
      </motion.div>
      <motion.div 
        className='absolute h-[calc(5svh+25px)] bottom-[calc(2.5svh+15px)] sm:w-[calc(50% + 50px)] w-[calc(40svh+50px+10%)] max-w-xl justify-between items-center flex -translate-x-1/2'
        initial="hidden"
        animate="show"
        variants={{
          hidden: {x : 0, y: 100, opacity: 0 },
          show: {x: 0, y: 0, opacity: 1, transition: { delay: TERMINAL_APPEARANCE_DELAY, duration: TERMINAL_APPEARANCE_DURATION } },
        }}
        layout
        >
        <button 
          className='w-[100%] h-[calc(5svh+15px)] items-center justify-center flex  bg-gray-950/50 rounded-3xl'
          onClick={() => ScrollToNavId("about")}
        >
          <div className='h-full w-[100%] rounded-2xl border-4 border-secondary flex justify-center p-2 items-center overflow-hidden'>
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