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
    <span className="text-white/95">
        <AnimatedTextAppearance appearOnlyOnce text={headerIntro} timeBetweenLetters={headerTimeBetweenLetters} startingState={{translateY: 100, translateX : 10}} /> 
    </span>
    <span className='text-[#c2d4ff] inline-block'>     
        <AnimatedTextAppearance appearOnlyOnce text={"Daniel"} timeBetweenLetters={headerTimeBetweenLetters} startingState={{translateY: -100, translateX: -10}} style={{whiteSpace: "nowrap",}} fromLast/> 
    </span>
</>

export const descriptionElement : ReactElement = <AnimatedTextAppearance appearOnlyOnce text={description} timeBetweenLetters={descriptionTimeBetweenLetters} delay={DESCRIPTION_APPEARANCE_DELAY} startingState={{translateY: -20, translateX: -10}} style={{whiteSpace: "normal"}}/> 

const TerminalText = "↓ More About Me ↓"

export const TerminalTexts = {
    TerminalIntroduction : TerminalText,
    LevelSelect : TerminalText, //"Have fun!",
    LevelStarted : TerminalText, //"You got this.",
    LevelLost : TerminalText, //"Don't give up! I believe in you.",
    LevelCleared : TerminalText, //"GG",
    Menu : TerminalText, //"Just chillin?",
    LastLevelClear : TerminalText, //"WOW! Congrats. You beat the game!",
    Paused : "↓ (Game Paused) ↓", //"Taking a break?",
    Unpaused : TerminalText, //"Let's do this"
}
