import { useRef, useState, useEffect } from 'react'
import useSound from 'use-sound'
import { TechGrid } from '../canvas'
import { SectionWrapper } from '../../hoc'
import { preTitle, techStack, title, subDescription, type Technology, solvedButtonText, abortedButtonText, abortingButtonText, technologies } from '../../constants/components/page/technologies'
import { motion } from 'framer-motion'
import { styles } from '../../style'
import AnimatedTextAppearance from '../effects/AnimatedTextAppearance'
import { Leaderboard } from '../globalLists/Leaderboard'
import { formatTime } from '../../../../shared/constants/util'
import { postQueryNetworkErrorCode, postQueryRefusedErrorCode } from '../../constants/components/globalLists'
import type { SubmitResult } from '../../../types/api/globalBoards'

export type NodeStatus = {
  solved : boolean,
  selected : boolean,
}
export type TechnologyNode = {
  technology : Technology,
  status : NodeStatus
}

const TECHNOLOGY_CATEGORY_APPEARANCE_DURATION = .75
const SECOND_TECHNOLOGY_CATEGORY_APPEARANCE_DELAY = 0.25
const PAIR_SELECTED_HIDE_DELAY : number = 1 * 1000
const SOLVED_DISPLAY_DELAY : number = 0.5 * 1000

const SCORE_STORAGE_FACTOR : number = 0.1

const SUBMIT_BUTTON_COOLDOWN : number = 500
const TIMER_DIGITS_AFTER_ZERO : number = 2

const Technologies = () => {
  const [playSelectSound] = useSound('/sounds/match2Minigame/BallFlip.wav', {volume: 0.3})
  const [playMatchSound] = useSound('/sounds/match2Minigame/BallMatch.wav', {volume: .6})
  const [playMatchFailSound] = useSound('/sounds/match2Minigame/BallMatchFail.wav', {volume: 0.3})
  const [playGameFlipSound] = useSound('/sounds/match2Minigame/BallMatchFail.wav', {volume: 0.25, playbackRate: 1.2})

  const getRandomizedTechnologyNodes = () => ([...technologies, ...technologies].map((technology : Technology) => (
    {technology : technology, status : {solved : false, selected : false}}
  )).sort(() => Math.random() - 0.5))

  const [solved, setSolved] = useState(false)
  const [aborted, setAborted] = useState(false)
  const [inputDisabled, setInputDisabled] = useState(false)
  const [technologyNodes, setTechnologyNodes] = useState<TechnologyNode[]>(getRandomizedTechnologyNodes())
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  const [timer, setTimer] = useState(0); // milliseconds
  const [timerRunning, setTimerRunning] = useState(false)

  const [bestTimerScore, setbestTimerScore] = useState(-1)
  const [leaderboardToggled, setleaderboardToggled] = useState(false)
  const [submitName, setSubmitName] = useState("")
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
  const [bestSubmittedScore, setBestSubmittedScore] = useState(-1)
  const [submitResult, setSubmitResult] = useState<SubmitResult>({
    message: "",
    isError: false
  })

  useEffect(() => {
    if (!submitButtonDisabled) return;

      const timeout = setTimeout(() => {
          setSubmitButtonDisabled(false)
      }, SUBMIT_BUTTON_COOLDOWN); // disappears after 3 seconds

      return () => clearTimeout(timeout);
  }, [submitButtonDisabled]);

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev + 10); // update every 10ms
    }, 10);

    return () => clearInterval(interval);
  }, [timerRunning]);

  function onSolved() {
    if (bestTimerScore < 0 || bestTimerScore > timer) {
      setbestTimerScore(timer)
    }
    setTimerRunning(false)
    timeoutRef.current = setTimeout(() => {
      setSolved(true), SOLVED_DISPLAY_DELAY
    })
  }

  const onCorrectPairSelected = (index1 : number, index2 : number) => {
    var solved = true;
    setTechnologyNodes(technologyNodes.map((technologyNode : TechnologyNode, _index : number) => {
      if (_index == index1 || _index == index2) {
        return  {technology: technologyNode.technology, status: {solved: true, selected: false}} 
      }
      if (!technologyNode.status.solved) {
        solved = false
      }
      return technologyNode
    }))
    playMatchSound()
    if (solved) {
      onSolved()
    }
  }

  const onWrongPairSelected = (index1 : number, index2 : number) => {
    setInputDisabled(true)
    const onTimeout = () => {
      if (aborted) {
        return
      }
      playMatchFailSound()
      setTechnologyNodes(technologyNodes.map((technologyNode : TechnologyNode, _index : number) => {
        if (_index == index1 || _index == index2) {
          return  {technology: technologyNode.technology, status: {solved: false, selected: false}} 
        }
          return technologyNode
      }))
      setInputDisabled(false)
    }

    timeoutRef.current = setTimeout(onTimeout, PAIR_SELECTED_HIDE_DELAY)
  }

  function onPairSelected(index1 : number, index2 : number) : boolean {
    if (technologyNodes[index1].technology.name == technologyNodes[index2].technology.name) {
      onCorrectPairSelected(index1, index2)
      return true
    }
    onWrongPairSelected(index1, index2)
    return false
  }

  const onSelected = (index : number) => {
    if (!timerRunning) {
      setTimerRunning(true)
    }
    var otherSelectedIndex : number = -1

    setTechnologyNodes(technologyNodes.map((technologyNode : TechnologyNode, _index : number) => {
      if (index != _index) {
        if (technologyNode.status.selected) {
          otherSelectedIndex = _index
        }
        return technologyNode
      }
      const selected = !technologyNode.status.selected
      return  {technology: technologyNode.technology, status: {solved : false, selected: selected}}
    }))
    if (otherSelectedIndex != -1) {
      if (!onPairSelected(otherSelectedIndex, index)) {
        playSelectSound()
      }
      return
    }
    playSelectSound()
  }

  const getOnClick = (index : number) => () => {
    if (inputDisabled) {
      return
    }
    const nodeStatus = technologyNodes[index].status
    if (nodeStatus.solved) {
      return
    }
    onSelected(index)
  }

  function resetTimer() {
    setTimer(0)
    setTimerRunning(false)
  }

  const reset = () => {
    setSolved(false)
    setAborted(false)
    setInputDisabled(false)
    setTechnologyNodes(getRandomizedTechnologyNodes())
    playGameFlipSound()
    resetTimer()
  }
  
  const abort = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setAborted(true)
    setInputDisabled(true)
    resetTimer()
    const newTechnologyNodes = technologyNodes.map((technologyNode) => ({technology:technologyNode.technology, status: {solved : false, selected: true}})) //Array.from(new Map(technologyNodes.map((technologyNode : TechnologyNode) => 
    setTechnologyNodes(newTechnologyNodes)
    playGameFlipSound()
  }
  
  function submitBlocked() {
    return bestSubmittedScore > 0 && bestSubmittedScore >= bestTimerScore
  }

  function canSubmit() {
    return bestTimerScore > 0 && !submitButtonDisabled && submitName.trim() && !submitBlocked()
  }



  const onSubmitScorePressed = async () => {
    if (bestTimerScore < 0 || !submitName.trim()) {
      return
    }
    const result = await submitScore(bestTimerScore * SCORE_STORAGE_FACTOR, submitName)

    const submitResult : SubmitResult= (() => {
      if (result >= 0) {
        setBestSubmittedScore(bestTimerScore.valueOf())

        return {
          message: `You (${submitName}) are now top ${result + 1} with a time of ${formatTime(bestTimerScore.valueOf(), TIMER_DIGITS_AFTER_ZERO)}!`,
          isError: false,
        };
      }
      switch(result) {
        case postQueryNetworkErrorCode:
          return {
            message: "Could not send to leaderboard",
            isError: true,
          }
        case postQueryRefusedErrorCode:
          return {
            message: "Your name already has at least this score!",
            isError: true
          }
        default:
          return {
            message: "Failed to submit to leaderboard",
            isError: true
          }
      }
    })();
    setSubmitResult(submitResult) 
  }

  const scoreFilterFactor = 0.001 / SCORE_STORAGE_FACTOR;

  const [leaderboard, submitScore] = Leaderboard({
    title:"Fastest times",
    category:"Stack Matching",
    count:20,
    scoreFilterFunction(score) {
      return `${(score * scoreFilterFactor).toFixed(2)}s` // Milliseconds to seconds
    },
  })


  
  return (
    <div className='mb-[75px]'>
      <div> {/*
        variants={{
          hidden: {y: -50, opacity: 0, },
          show: {y: 0, opacity: 1, },
        }}
        */}
          <p className={styles.sectionSubText}>
            <AnimatedTextAppearance text={preTitle} startingState={{translateY: 5}}/>
          </p>
          <h2 className={styles.sectionHeadText + " text-start"}>
            {title}
          </h2>  
          <p className={styles.subDescriptionText + " text-start"}>
            {subDescription}
          </p> 
      </div>
      <div>
        <div className="mt-4 w-full flex flex-col gap-5">
          {Object.entries(techStack).map(([category, items], index) => (
            <motion.div 
              variants={{
                hidden: {x: -50, opacity: 0, },
                show: {x: 0, opacity: 1, transition: { type: "spring", duration: TECHNOLOGY_CATEGORY_APPEARANCE_DURATION, delay: index * SECOND_TECHNOLOGY_CATEGORY_APPEARANCE_DELAY}},
              }}
              key={category} 
              className="w-full"
            >
              
              {/* Category title */}
              <h3 className={`text-white/70 ${styles.techStackCategoryTextStyle} mb-2 tracking-wider`}>
                <b>{category}</b>
              </h3>

              {/* Items */}
              <div className="flex flex-wrap justify-left gap-6">
                {items.map((tech) => (
                  <div
                    key={tech.name}
                    className={`flex flex-col items-center gap-1 ${styles.techStackElementStyles.boxWidthStyle} 
                     bg-white/25 group hover:bg-white/50 border-[5px] border-white/10 hover:border-black/50 rounded-lg 
                     transition-all duration-300 ease-out`}
                  >
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className={`${styles.techStackElementStyles.imageSizeStyle} aspect-square object-contain pt-2`}
                    />
                    <p className={`${styles.techStackElementStyles.nameSizeSyle} text-white/90 text-center group-hover:text-black/70 transition-all duration-300 ease-out`}>
                      {tech.name}
                    </p>
                  </div>
                ))}
              </div>
              
            </motion.div>
          ))}
        </div>
        <span>
          <span className={`text-white/80 ${styles.techStackMatchStyle.titleTextSizeStyle} text-center w-full flex items-center justify-center mt-[75px]`}> 
            <b> Match my stack </b>  <br/> 
          </span>
          <span className={`text-green-100/80 ${styles.techStackMatchStyle.subTitleTextSizeStyle} text-center w-full flex items-center justify-center`}> 
            Click to play! 
          </span>
        </span>
        <div className='flex flex-row flex-wrap justify-center gap-10 w-full aspect-[3/1] mt-[10px] mb-[20px] border-2 border-white/40 rounded-2xl'>
            <TechGrid technologies={technologyNodes} getOnClick={getOnClick} />
        </div>
        <div className='w-full flex items-center justify-center pt-5 pb-10'>
          {/* Middle */}
          <div className="absolute left-1/2 -translate-x-1/2 w-[calc(15%+75px)] items-center justify-center flex">
            <button
              className={`cursor-pointer ${styles.techStackMatchStyle.buttonHeightStyle} w-full bg-white/15 rounded-lg border-2 border-white/10 flex items-center justify-center`}
              onClick={solved ? reset : (aborted ? reset : abort)}
            >
              <p
                className={`${styles.techStackMatchStyle.buttonTextSizeStyle} text-secondary tracking-wider text-center`}
              >
                {solved ? solvedButtonText : aborted ? abortedButtonText : abortingButtonText}
              </p>
            </button>
          </div>
          {/* Right*/}
          <div className="absolute left-0 translate-x-1/4 w-[calc(15%+75px)] items-center justify-center flex">
            <div
              className={`${styles.techStackMatchStyle.buttonHeightStyle} w-full bg-white/15 rounded-lg border-2 border-white/10 flex items-center justify-center`}
            >
              <p
                className={`${styles.techStackMatchStyle.buttonTextSizeStyle} text-secondary tracking-wider text-center`}
                style={{fontVariantNumeric: "tabular-nums"}}
              >
                {`${formatTime(timer, TIMER_DIGITS_AFTER_ZERO)}`}
              </p>
            </div>
          </div>
          {/* Right*/}
          <div className="absolute right-0 -translate-x-1/4 w-[calc(15%+75px)] items-center justify-center flex">
            <button
              className={`cursor-pointer ${styles.techStackMatchStyle.buttonHeightStyle} w-full bg-white/15 rounded-lg border-2 border-white/10 flex items-center justify-center`}
              onClick={() => {setleaderboardToggled(!leaderboardToggled)}}
            >
              <p
                className={`${styles.techStackMatchStyle.buttonTextSizeStyle} text-secondary tracking-wider text-center`}
              >
                Leaderboard
              </p>
            </button>
          </div>
        </div>
        {leaderboardToggled && (<div className="flex">
          <div className="w-[calc(15%_+_50px)] flex flex-col items-center justify-center">
            <p className="text-white/80 text-center text-md sm:text-xl">
              Best Score
            </p>

            <p
              className={`${styles.techStackMatchStyle.buttonTextSizeStyle} text-secondary text-center tracking-wider text-xs sm:text-lg pt-5 pb-5`}
            >
              {bestTimerScore > 0 ? formatTime(bestTimerScore, TIMER_DIGITS_AFTER_ZERO) : "-"}
            </p>
            
            <input
              type="text"
              value={submitName}
              disabled={submitBlocked()}
              onChange={(e) => setSubmitName(e.target.value)}
              placeholder="[Name]"
              maxLength={20}
              className="w-full mb-5 mt-5 px-2 py-2 rounded-lg border-2 border-white/10 bg-white/10 text-white placeholder-white/40 text-center focus:outline-none focus:border-secondary"
            />
            <button 
              className={`${canSubmit() ? "cursor-pointer bg-white/15" : "cursor-default bg-white/10"} ${styles.techStackMatchStyle.buttonHeightStyle}  rounded-lg border-2 border-white/10 flex items-center justify-center`}
              onClick={onSubmitScorePressed}
            >
              <p
                className={`text-xs sm:text-xl ${styles.techStackMatchStyle.buttonTextSizeStyle} ${canSubmit() ? "text-secondary" : "text-secondary/50"}  tracking-wider text-center pl-1 pr-1`}
              >
                Submit score
              </p>
            </button>
            {submitResult.message && 
             <div className="px-5 py-6 text-center bg-neutral-950/40">
                <p className={`${submitResult.isError ? "text-red-400/80" : "text-white/80"} text-sm mb-3`}>
                    {submitResult.message}
                </p>
            </div>
              
            }
          </div>
          {leaderboard}
        </div>
        )}
      </div>  
    </div>
  )
}

export default SectionWrapper(Technologies, "Technologies")