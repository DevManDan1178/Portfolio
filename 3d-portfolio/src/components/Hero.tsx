import React, { useEffect, useRef, useState, type RefObject } from 'react'
import { motion } from 'framer-motion'
import { styles } from '../style' 
import ComputerCanvas from './canvas/Computers'
import { headerIntro, description, TerminalTexts } from '../constants/hero'
import { portfolioHeroName } from '../constants'
import { MENU_SCENES, type GameEventHandlers } from './canvas/PolygonTD'
type GameState = "Idle" | "Menu" | "LevelSelect" | "Playing" | "Lost" | "Cleared"


const Hero = () => {
  const [levelProgress, setLevelProgress] = useState<number>(0)
  const [terminalText, setTerminalText] = useState<string>(TerminalTexts.TerminalIntroduction)
  const gameEventHandlers : RefObject<GameEventHandlers> = useRef({
    OnLevelCleared(levelNumber) {
      setTerminalText(levelNumber >= 5 ? TerminalTexts.LastLevelClear : TerminalTexts.LevelCleared)
    },
    OnLevelLost(levelNumber) {
      setTerminalText(TerminalTexts.LevelLost)
    },
    OnLevelStarted(levelNumber) {
      setTerminalText(TerminalTexts.LevelStarted)
    },
    OnPauseToggled(paused) {
      setTerminalText(paused ? TerminalTexts.Paused : TerminalTexts.Unpaused)
    },
    OnLevelProgressChanged(levelNumber) {
      setLevelProgress(levelNumber)
    },
    OnSceneChanged(sceneName) {
      if (sceneName === MENU_SCENES.levelSelect) {
        setTerminalText(TerminalTexts.LevelSelect)
      } else if (sceneName === MENU_SCENES.mainMenu) {
        setTerminalText(TerminalTexts.Menu)
      }
    },
  })

  return (
    <div className='relative w-full h-screen mx-auto z-10 overflow-hidden items-center'>
      <div className={`${styles.paddingX} absolute inset-0 py-2 top-[40px] max-w-7xl mx-auto flex flex-row items-start gap-5`}>
         <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-[#915eff]'/>
          <div className='w-1 sm:h-80 h-40 violet-gradient'/>
        </div>
        <div>
          <h2 className={`${styles.heroHeadText} text-white`}>
            {headerIntro} <span className='text-[#915eff]'>{portfolioHeroName}</span>
          </h2>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            {description}
          </p>
        </div>
      </div>
      
      <ComputerCanvas gameEventHandlers={gameEventHandlers}/>
        <div className='absolute h-[calc(5%+25px)] bottom-[5px] w-[calc(40%+45px)] justify-between items-center flex left-1/2 -translate-x-1/2'>
           <a href='#about' className='w-[100%] items-center justify-center flex  bg-gray-950/50 rounded-3xl'>
              <div className='h-full w-[100%] rounded-2xl border-4 border-secondary flex justify-center p-2 items-center overflow-hidden'>
                <motion.div
                  animate={{  
                    y: ["-300%", "0%"]
                  }}
                  transition={{
                    duration: 2.5,
                    ease: "backInOut",
                  }}
                  className='w-full h-full rounded-full items-center flex justify-center'
                >
                  <p className='text-center w-auto text-[20px]'>
                    {terminalText}
                  </p>
                </motion.div>
              </div>
            </a> 
      </div>

    </div>
  )
}

export default Hero