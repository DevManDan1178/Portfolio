import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component"
import { motion } from 'framer-motion'
import 'react-vertical-timeline-component/style.min.css'
import {styles} from '../style'
import { experiences, preTitle, title, subDescription, type Experience } from '../constants/experience'
import { SectionWrapper } from '../hoc'
import AnimatedTextAppearance from './effects/AnimatedTextAppearance'

const DESCRIPTION_TRANSITION_DELAY = 0.25

const ExperienceCard = ({experience} : {experience : Experience}) => {
  const iconInfo = experience.iconInfo
  return (
    <VerticalTimelineElement
      contentStyle = {{ background: '#ffffff1a', color: '#fff', boxShadow: 'none', borderRadius: "8px", border: '4px solid rgba(255,255,255,0.15)' }}
      contentArrowStyle = {{borderRight : '0px'}}
      date = {experience.date}
      iconStyle = {{background: iconInfo.background, overflow : "clip"}}
      icon = {
        <div className='flex justify-center items-center w-full h-full'>
          <img
            src = {iconInfo.icon}
            alt = {experience.subTitle}
            className={`w-full h-full scale-[${iconInfo.iconScale ?? 1}] items-center overflow-hidden`}
          />
        </div>  
      }
      >
      <div>
        <h3 className={`text-white ${styles.experienceCardStyles.titleTextSizeStyle} font-bold`}>
          {experience.title}
        </h3>
        <p className={`text-secondary ${styles.experienceCardStyles.subTitleSizeStyle} font-semibold m-0`}>
          {experience.subTitle}
        </p>
      </div>
      <ul className='mt-5 list-disc ml-5 space-y-2'>
        {experience.points.map((point, index) => (
          <li 
            key={`experience-point-${index}`}
            className={`text-white-100 ${styles.experienceCardStyles.bulletPointsSizeStyle} pl-1 tracking-wider`}
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
      <div> 
        {/*
        initial="hidden" 
        animate="show" 
        variants={{hidden: {y: -50, opacity: 0, }, show: { y: 0, opacity: 1, transition: { type: "spring", duration: 1.25, delay: TITLE_TRANSITION_DELAY}}}}
        viewport={{ once: true }}
        */}
        <p className={styles.sectionSubText}>
          <AnimatedTextAppearance text={preTitle} startingState={{translateY: 5}}/>
        </p>
        <h2 className={styles.sectionHeadText}>
          {title}
        </h2>   
      </div>
        <div className='w-full flex'>
          <motion.p
            initial="hidden" 
            animate="show"
            variants={{hidden: {y: -50, opacity: 0, }, show: { y: 0, opacity: 1, transition: { type: "spring", duration: 1.25, delay: DESCRIPTION_TRANSITION_DELAY}}}}
            viewport={{ once: false }}
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