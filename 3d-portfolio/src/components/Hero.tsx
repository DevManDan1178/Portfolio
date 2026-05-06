import React, { useEffect, useRef, useState, type RefObject } from 'react'
import { motion, transform } from 'framer-motion'
import { styles } from '../style' 
import ComputerCanvas from './canvas/Computers'
import { headerIntroElement, descriptionElement, TerminalTexts, TERMINAL_TEXT_APPEARANCE_DELAY, TERMINAL_TEXT_APPEARANCE_DURATION } from '../constants/hero'
import { portfolioHeroName } from '../constants'
import { MENU_SCENES, type GameEventHandlers } from './canvas/PolygonTD'
import AnimatedTextAppearance from './effects/AnimatedTextAppearance'


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
      console.log(sceneName, MENU_SCENES.levelSelect)
      if (sceneName === MENU_SCENES.levelSelect) {
        setTerminalText(TerminalTexts.LevelSelect)
      } else if (sceneName === MENU_SCENES.mainMenu) {
        setTerminalText(TerminalTexts.Menu)
      }
    },
  })

  return (
    <div className='relative w-full h-screen mx-auto z-10 overflow-hidden items-center justify-center flex'>
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
      
      <div className='h-full w-full items-center flex justify-center relative border-2 border-white/20'>
        <ComputerCanvas gameEventHandlers={gameEventHandlers}/>
      </div>
        <div className='absolute h-[calc(5%+35px)] bottom-[5px] w-[calc(30%+250px)] justify-between items-center flex left-1/2 -translate-x-1/2'>
           <a href='#about' className='w-[100%] items-center justify-center flex  bg-gray-950/50 rounded-3xl'>
              <div className='h-full w-[100%] rounded-2xl border-4 border-secondary flex justify-center p-2 items-center overflow-hidden'>
                <p className='text-[20px]'>
                  <AnimatedTextAppearance appearOnlyOnce text={terminalText} timeBetweenLetters={TERMINAL_TEXT_APPEARANCE_DURATION/terminalText.length} delay={TERMINAL_TEXT_APPEARANCE_DELAY} startingState={{translateY: 10}}/>             
                </p>
              </div>
            </a> 
      </div>

    </div>
  )
}

export default Hero