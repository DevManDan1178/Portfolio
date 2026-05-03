import { useRef, useState } from 'react'
import { BallCanvas } from './canvas'
import { SectionWrapper } from '../hoc'
import { preTitle, technologies, title, subDescription, type Technology, solvedtitle, solvedSubDescription, abortedSubDescription, solvedButtonText, abortedButtonText, abortingButtonText } from '../constants/technologies'
import { motion } from 'framer-motion'
import { styles } from '../style'

export type NodeStatus = {
  solved : boolean,
  selected : boolean,
}
export type TechnologyNode = {
  technology : Technology,
  status : NodeStatus
}

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
    setInputDisabled(false)
    setTechnologyNodes(getRandomizedTechnologyNodes())
  }
  
  const abort = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setAborted(true)
    setInputDisabled(true)
    const newTechnologyNodes = Array.from(new Map(technologyNodes.map((technologyNode : TechnologyNode) => 
        [technologyNode.technology.name, {technology:technologyNode.technology, status: {solved : false, selected: true}}])).values())
    console.log(newTechnologyNodes)
    setTechnologyNodes(newTechnologyNodes)
  }

  return (
    <div>
      <motion.div variants={{
          hidden: {y: -50, opacity: 0, },
          show: {y: 0, opacity: 1, },
        }}
        >
          <p className={styles.sectionSubText}>
            {preTitle}
          </p>
          <h2 className={styles.sectionHeadText + " text-start"}>
            {solved ? solvedtitle : title}
          </h2>  
          <p className={styles.subDescriptionText + " text-start"}>
            {solved ? solvedSubDescription : (aborted ? abortedSubDescription : subDescription)}
          </p> 
      </motion.div>
      <motion.div layout>
        <div className='flex flex-row flex-wrap justify-center gap-10 h-[350px]'>
            <BallCanvas technologies={technologyNodes} getOnClick={getOnClick} />
        </div>
        <div className='w-full flex items-center justify-center'>
          <button className={`gap-10 mt-5 h-[80px] w-[calc(30%+100px)] ${aborted ? "cursor-default" : "cursor-pointer"}  bg-white/15 rounded-lg border-2 border-white/10 items-center justify-center`} onClick={solved ? reset : (aborted ? () => {} : abort)} >
            <p className="text-[25px] text-secondary tracking-wider text-center">
              {solved ? solvedButtonText : (aborted ? abortedButtonText : abortingButtonText)}
            </p>
          </button>
        </div> 
      </motion.div>  
    </div>
  )
}

export default SectionWrapper(Technologies, "Technologies")