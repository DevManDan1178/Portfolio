import { useEffect, useState } from 'react'
import { BallCanvas } from './canvas'
import { SectionWrapper } from '../hoc'
import { technologies, title, subDescription, type Technology, solvedtitle, solvedSubDescription } from '../constants/technologies'
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

const PAIR_SELECTED_HIDE_DELAY : number = 1 * 1000;

const Technologies = () => {
  const [solved, setSolved] = useState(false)
  const [inputDisabled, setInputDisabled] = useState(false)
  const [technologyNodes, setTechnologyNodes] = useState<TechnologyNode[]>([...technologies, ...technologies].map((technology : Technology) => (
    {technology : technology, status : {solved : false, selected : false}}
  )).sort(() => Math.random() - 0.5))


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
      setSolved(true)
    }
  }

  const onWrongPairSelected = (index1 : number, index2 : number) => {
    setInputDisabled(true)
    console.log("wrong pair")
    const onTimeout = () => {
      setTechnologyNodes(technologyNodes.map((technologyNode : TechnologyNode, _index : number) => {
        if (_index == index1 || _index == index2) {
          return  {technology: technologyNode.technology, status: {solved: false, selected: false}} 
        }
          return technologyNode
      }))
      setInputDisabled(false)
      console.log("timeout")
    }

    setTimeout(onTimeout, PAIR_SELECTED_HIDE_DELAY)
    
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

  return (
    <div>
      <motion.div variants={{
        hidden: {y: -50, opacity: 0, },
        show: {y: 0, opacity: 1, },
        }}>
          <h2 className={styles.sectionHeadText + " text-center"}>
            {solved ? solvedtitle : title}
          </h2>  
          <p className={styles.subDescriptionText + " text-center"}>
            {solved ? solvedSubDescription : subDescription}
          </p> 
      </motion.div>
      
      <div className='flex flex-row flex-wrap justify-center gap-10 h-[350px]'>
          <BallCanvas technologies={technologyNodes} getOnClick={getOnClick} />
      </div>
    </div>
  )
}

export default SectionWrapper(Technologies, "Technologies")