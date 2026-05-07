import type { ReactElement } from "react"
import AnimatedTextAppearance from "../components/effects/AnimatedTextAppearance"
import { portfolioHeroName } from "."

export const ANIMATED_HEADER_APPEARANCE_DURATION : number = .75
export const DESCRIPTION_APPEARANCE_DELAY : number = ANIMATED_HEADER_APPEARANCE_DURATION + 0.35
export const ANIMATED_DESCRIPTION_APPEARANCE_DURATION : number = 0.75
export const TERMINAL_TEXT_APPEARANCE_DELAY : number = DESCRIPTION_APPEARANCE_DELAY + ANIMATED_DESCRIPTION_APPEARANCE_DURATION + 0.75
export const TERMINAL_TEXT_APPEARANCE_DURATION : number = 0.75

const headerIntro = "Hi, I'm "
const description : string = "I build interactive experiences."

const headerTimeBetweenLetters = ANIMATED_HEADER_APPEARANCE_DURATION/(headerIntro.length + portfolioHeroName.length)
const descriptionTimeBetweenLetters = ANIMATED_DESCRIPTION_APPEARANCE_DURATION/(description.length)

export const headerIntroElement : ReactElement = <>
    <span>
        <AnimatedTextAppearance appearOnlyOnce text={headerIntro} timeBetweenLetters={headerTimeBetweenLetters} startingState={{translateY: 100, translateX : 10}} /> 
    </span>
    <span className='text-[#915eff] inline-block'>     
        <AnimatedTextAppearance appearOnlyOnce text={"Daniel"} timeBetweenLetters={headerTimeBetweenLetters} delay={headerTimeBetweenLetters * headerIntro.length} startingState={{translateY: -100, translateX: -10}} style={{whiteSpace: "nowrap"}} fromLast/> 
    </span>
</>

export const descriptionElement : ReactElement = <AnimatedTextAppearance appearOnlyOnce text={description} timeBetweenLetters={descriptionTimeBetweenLetters} delay={DESCRIPTION_APPEARANCE_DELAY} startingState={{translateY: -20, translateX: -10}} style={{whiteSpace: "normal"}}/> 

export const TerminalTexts = {
    TerminalIntroduction : "Clicking me will scroll you down.",
    LevelSelect : "Have fun!",
    LevelStarted : "You got this.",
    LevelLost : "Don't give up! I believe in you.",
    LevelCleared : "GG",
    Menu : "Just chillin?",
    LastLevelClear : "WOW! Congrats. You beat the game!",
    Paused : "Taking a break?",
    Unpaused : "Let's do this"
}
