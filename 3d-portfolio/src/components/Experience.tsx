import React from 'react'
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component"
import { motion } from 'framer-motion'
import 'react-vertical-timeline-component/style.min.css'
import {styles} from '../style'
import { experiences, preTitle, title, subDescription, type Experience } from '../constants/experiences'
import { SectionWrapper } from '../hoc'

const TITLE_TRANSITION_DELAY = 0.35

const ExperienceCard = ({experience} : {experience : Experience}) => {
  const iconInfo = experience.iconInfo
  return (
    <VerticalTimelineElement
      contentStyle = {{background : '#1d1836', color: '#fff'}}
      contentArrowStyle = {{borderRight : '7px solid #232631'}}
      date = {experience.date}
      iconStyle = {{background: iconInfo.background, overflow : "hidden"}}
      icon = {
        <div className='flex justify-center items-center w-full h-full'>
          <img
            src = {iconInfo.icon}
            alt = {experience.companyName}
            className={`w-[${100 * (iconInfo.iconScale ?? 1)}%] h-[${100 * (iconInfo.iconScale ?? 1)}%] object-contain items-center overflow-hidden`}
          />
        </div>  
      }
      >
      <div>
        <h3 className='text-white text-[24px] font-bold'>
          {experience.title}
        </h3>
        <p className='text-secondary text-[16px] font-semibold' style={{margin: 0}}>
          {experience.companyName}
        </p>
      </div>
      <ul className='mt-5 list-disc ml-5 space-y-2'>
        {experience.points.map((point, index) => (
          <li 
            key={`experience-point-${index}`}
            className='text-white-100 text-[14px] pl-1 tracking-wider'
          >
            {point}  
          </li>

        ))}
      </ul>

    </VerticalTimelineElement>
  )
}

const Experience = () => {
  return (
    <>
      <motion.div 
        initial="hidden" 
        animate="show" 
        variants={{hidden: {y: -50, opacity: 0, }, show: { y: 0, opacity: 1, transition: { type: "spring", duration: 1.25, delay: TITLE_TRANSITION_DELAY}}}}
      >
        <p className={styles.sectionSubText}>
          {preTitle}
        </p>
        <h2 className={styles.sectionHeadText}>
          {title}
        </h2>   
      </motion.div>
        <div className='w-full flex'>
          <motion.p
            initial="hidden" 
            animate="show"
            variants={{hidden: {y: -50, opacity: 0, }, show: { y: 0, opacity: 1, transition: { type: "spring", duration: 1.25, delay: TITLE_TRANSITION_DELAY * 0.35}}}}
            className={styles.subDescriptionText}
          >
            {subDescription}
          </motion.p> 
        </div>
      <div className="mt-20 flex-col">
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard key = {index} experience = {experience}>

            </ExperienceCard>
          )) }
        </VerticalTimeline>
      </div>
    </>
  )
}

export default SectionWrapper(Experience, "work")