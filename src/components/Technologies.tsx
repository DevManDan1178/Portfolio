import { useRef, useState} from 'react'
import useSound from 'use-sound'
import { BallCanvas } from './canvas'
import { SectionWrapper } from '../hoc'
import { preTitle, technologies, title, subDescription, type Technology, solvedButtonText, abortedButtonText, abortingButtonText } from '../constants/technologies'
import { motion } from 'framer-motion'
import { styles } from '../style'
import AnimatedTextAppearance from './effects/AnimatedTextAppearance'

export type NodeStatus = {
  solved : boolean,
  selected : boolean,
}
export type TechnologyNode = {
  technology : Technology,
  status : NodeStatus
}

const TECHNOLOGY_CATEGORY_APPEARANCE_DURATION = 1.25
const TECHNOLOGY_CATEGORY_APPEARANCE_DELAY = 0.5
const PAIR_SELECTED_HIDE_DELAY : number = 1 * 1000
const SOLVED_DISPLAY_DELAY : number = 0.5 * 1000

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
      timeoutRef.current = setTimeout(() => {
        setSolved(true), SOLVED_DISPLAY_DELAY
      })
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

  const reset = () => {
    setSolved(false)
    setAborted(false)
    setInputDisabled(false)
    setTechnologyNodes(getRandomizedTechnologyNodes())
    playGameFlipSound()
  }
  
  const abort = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setAborted(true)
    setInputDisabled(true)
    const newTechnologyNodes = technologyNodes.map((technologyNode) => ({technology:technologyNode.technology, status: {solved : false, selected: true}})) //Array.from(new Map(technologyNodes.map((technologyNode : TechnologyNode) => 
        //[technologyNode.technology.name, {technology:technologyNode.technology, status: {solved : false, selected: true}}])).values())
    setTechnologyNodes(newTechnologyNodes)
    playGameFlipSound()
  }

  const groupedTechnologies = technologies.reduce((accumulator, technology) => {
    if (!accumulator[technology.category]){ 
      accumulator[technology.category] = []
    }
    accumulator[technology.category].push(technology);
    return accumulator;
  }, {} as Record<string, Technology[]>);

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
        <div className="mt-10 w-full flex flex-col gap-10">
          {Object.entries(groupedTechnologies).map(([category, items], index) => (
            <motion.div 
              variants={{
                hidden: {x: -50, opacity: 0, },
                show: {x: 0, opacity: 1, transition: { type: "spring", duration: TECHNOLOGY_CATEGORY_APPEARANCE_DURATION, delay: index * TECHNOLOGY_CATEGORY_APPEARANCE_DELAY}},
              }}
              key={category} 
              className="w-full"
            >
              
              {/* Category title */}
              <h3 className={`text-white/70 ${styles.techStackCategoryTextStyle} mb-4 tracking-wider`}>
                <b>{category}</b>
              </h3>

              {/* Items */}
              <div className="flex flex-wrap justify-left gap-6">
                {items.map((tech) => (
                  <div
                    key={tech.name}
                    className={`flex flex-col items-center gap-2 ${styles.techStackElementStyles.boxWidthStyle} py-2
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
            <BallCanvas technologies={technologyNodes} getOnClick={getOnClick} />
        </div>
        <div className='w-full flex items-center justify-center'>
          <button className={`gap-10 ${styles.techStackMatchStyle.buttonSizeStyle} "cursor-pointer" bg-white/15 rounded-lg border-2 border-white/10 items-center justify-center`} onClick={solved ? reset : (aborted ? reset : abort)} >
            <p className={`${styles.techStackMatchStyle.buttonTextSizeStyle} text-secondary tracking-wider text-center`}>
              {solved ? solvedButtonText : (aborted ? abortedButtonText : abortingButtonText)}
            </p>
          </button>
        </div> 
      </div>  
    </div>
  )
}

export default SectionWrapper(Technologies, "Technologies")