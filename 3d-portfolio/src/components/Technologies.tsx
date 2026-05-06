import { useRef, useState } from 'react'
import { BallCanvas } from './canvas'
import { SectionWrapper } from '../hoc'
import { preTitle, technologies, title, subDescription, type Technology, solvedtitle, solvedButtonText, abortedButtonText, abortingButtonText } from '../constants/technologies'
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
      console.log(aborted)
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

  const onPairSelected = (index1 : number, index2 : number) => {
    if (technologyNodes[index1].technology.name == technologyNodes[index2].technology.name) {
      onCorrectPairSelected(index1, index2)
      return
    }
    onWrongPairSelected(index1, index2)
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
      onPairSelected(otherSelectedIndex, index)
    }

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
    
  }
  
  const abort = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setAborted(true)
    setInputDisabled(true)
    const newTechnologyNodes = technologyNodes.map((technologyNode) => ({technology:technologyNode.technology, status: {solved : false, selected: true}})) //Array.from(new Map(technologyNodes.map((technologyNode : TechnologyNode) => 
        //[technologyNode.technology.name, {technology:technologyNode.technology, status: {solved : false, selected: true}}])).values())
    console.log(newTechnologyNodes)
    setTechnologyNodes(newTechnologyNodes)
  }

  const groupedTechnologies = technologies.reduce((accumulator, technology) => {
    if (!accumulator[technology.category]){ 
      accumulator[technology.category] = []
    }
    accumulator[technology.category].push(technology);
    return accumulator;
  }, {} as Record<string, Technology[]>);

  return (
    <div>
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
            {solved ? solvedtitle : title}
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
              <h3 className="text-white/70 text-xl mb-4 tracking-wider">
                <b>{category}</b>
              </h3>

              {/* Items */}
              <div className="flex flex-wrap justify-left gap-6">
                {items.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex flex-col items-center gap-2 w-[90px]
                     bg-white/25 group hover:bg-white/50 border-[5px] border-white/10 hover:border-black/50 rounded-lg 
                     transition-all duration-300 ease-out"
                  >
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="w-12 h-12 object-contain pt-2"
                    />
                    <p className="text-sm text-white/90 text-center group-hover:text-black/70 transition-all duration-300 ease-out">
                      {tech.name}
                    </p>
                  </div>
                ))}
              </div>
              
            </motion.div>
          ))}
        </div>
        <span>
          <span className="text-white/80 text-[25px] text-center w-full flex items-center justify-center mt-[75px]"> <b> Match my stack </b>  <br/> </span>
          <span className="text-green-100/80 text-[15px] text-center w-full flex items-center justify-center"> Click to play! </span>
        </span>
        <div className='flex flex-row flex-wrap justify-center gap-10 w-full aspect-[3/1] mt-[10px] mb-[20px] border-2 border-white/40 rounded-2xl'>
            <BallCanvas technologies={technologyNodes} getOnClick={getOnClick} />
        </div>
        <div className='w-full flex items-center justify-center'>
          <button className={`gap-10 h-[60px] w-[calc(15%+50px)] "cursor-pointer" bg-white/15 rounded-lg border-2 border-white/10 items-center justify-center`} onClick={solved ? reset : (aborted ? reset : abort)} >
            <p className="text-[25px] text-secondary tracking-wider text-center">
              {solved ? solvedButtonText : (aborted ? abortedButtonText : abortingButtonText)}
            </p>
          </button>
        </div> 
      </div>  
    </div>
  )
}

export default SectionWrapper(Technologies, "Technologies")