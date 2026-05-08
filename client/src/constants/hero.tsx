import type { ReactElement } from "react"
import AnimatedTextAppearance from "../components/effects/AnimatedTextAppearance"
import { portfolioHeroName } from "."

export const ANIMATED_HEADER_APPEARANCE_DURATION : number = .5
export const DESCRIPTION_APPEARANCE_DELAY : number = ANIMATED_HEADER_APPEARANCE_DURATION - 0.1
export const ANIMATED_DESCRIPTION_APPEARANCE_DURATION : number = 0.35
export const TERMINAL_APPEARANCE_DURATION = 0.25
export const TERMINAL_APPEARANCE_DELAY = DESCRIPTION_APPEARANCE_DELAY + ANIMATED_DESCRIPTION_APPEARANCE_DURATION - TERMINAL_APPEARANCE_DURATION
export const TERMINAL_TEXT_APPEARANCE_DELAY : number = TERMINAL_APPEARANCE_DELAY + TERMINAL_APPEARANCE_DURATION - 0.1
export const TERMINAL_TEXT_APPEARANCE_DURATION : number = 0.45
export const COMPUTER_CANVAS_APPEARANCE_DURATION : number = 1
export const COMPUTER_CANVAS_APPEARANCE_DELAY : number = TERMINAL_APPEARANCE_DELAY 


const headerIntro = "Hi, I'm "
const description : string = "I build interactive experiences."

const headerTimeBetweenLetters = ANIMATED_HEADER_APPEARANCE_DURATION/(headerIntro.length + portfolioHeroName.length)
const descriptionTimeBetweenLetters = ANIMATED_DESCRIPTION_APPEARANCE_DURATION/(description.length)

export const headerIntroElement : ReactElement = <>
    <span>
        <AnimatedTextAppearance appearOnlyOnce text={headerIntro} timeBetweenLetters={headerTimeBetweenLetters} startingState={{translateY: 100, translateX : 10}} /> 
    </span>
    <span className='text-[#915eff] inline-block'>     
        <AnimatedTextAppearance appearOnlyOnce text={"Daniel"} timeBetweenLetters={headerTimeBetweenLetters} startingState={{translateY: -100, translateX: -10}} style={{whiteSpace: "nowrap"}} fromLast/> 
    </span>
</>

export const descriptionElement : ReactElement = <AnimatedTextAppearance appearOnlyOnce text={description} timeBetweenLetters={descriptionTimeBetweenLetters} delay={DESCRIPTION_APPEARANCE_DELAY} startingState={{translateY: -20, translateX: -10}} style={{whiteSpace: "normal"}}/> 

export const TerminalTexts = {
    TerminalIntroduction : "Click This to Scroll Down.",
    LevelSelect : "Click This to Scroll Down.", //"Have fun!",
    LevelStarted : "Click This to Scroll Down.", //"You got this.",
    LevelLost : "Click This to Scroll Down.", //"Don't give up! I believe in you.",
    LevelCleared : "Click This to Scroll Down.", //"GG",
    Menu : "Click This to Scroll Down.", //"Just chillin?",
    LastLevelClear : "Click This to Scroll Down.", //"WOW! Congrats. You beat the game!",
    Paused : "Click This to Scroll Down.", //"Taking a break?",
    Unpaused : "Click This to Scroll Down.", //"Let's do this"
}
