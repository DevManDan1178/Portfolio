import React from 'react'
import Tilt from 'react-parallax-tilt'
import { motion } from 'framer-motion'

import { styles } from '../style'
import { github } from '../assets'
import { SectionWrapper } from '../hoc'
import { preTitle, title, subDescription, projects, type Tag } from '../constants/projects'
import { fadeIn, textVariant } from '../utils/motion'

const TITLE_TRANSITION_DELAY = 0.35

const ProjectCard = ({name, description, tags, image, link, index} : {name : string, description : string, tags : Tag[], image : string, link: string, index : number}) => (
  <motion.div variants={{hidden: {y: 100,}, show: { transition: { type: "spring", delay: index * 0.5, duration: 0.75, },},
  }}> 
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      transitionSpeed={1000}
      className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
      >
        <div className='relative w-full h-[230px]'>
          <img
          src={image}
          alt={name}
          className='w-full h-full object-cover rounded-2xl'
          />
          <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
            <div
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
              onClick={() => window.open(link, "_blank")}
            >
              <img
              src={github}
              alt="github"
              className='w-1/2 h-1/2 object-contain'
              />
            </div>
          </div>
        </div>
        <div className='mt-5'>
          <h3 className='text-whitee font-bold text-[24px]'>
            {name}
          </h3>
          <p className='mt-2 text-secondary text-[14px]'>
            {description}
          </p>
        </div>
        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <p 
            key={tag.name}
            className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>


          ))}
        </div>

      </Tilt>
  </motion.div>
)


const Projects = () => {
  return (
    <>
    <motion.div variants={{hidden: {y: -50, opacity: 0, }, show: { y: 0, opacity: 1, transition: { type: "spring", duration: 1.25, delay: TITLE_TRANSITION_DELAY}}}}>
        <p className={styles.sectionSubText}>
          {preTitle}
        </p>
        <h2 className={styles.sectionHeadText}>
           {title}
        </h2>   
    </motion.div> 
    <div className='w-full flex'>
      <motion.p
        variants={{show: {y: 0, opacity: 1, transition : {delay: 0.1, duration: 1}},}} 
        className={styles.subDescriptionText}
      >
        {subDescription}
      </motion.p>
    </div>
    <div className='mt-20 flex flex-wrap gap-7'>
      {projects.map((project, index) => (
        <ProjectCard 
          key={`project-${index}`}
          index={index}
          {...project}
        />
      ))

      }
    </div>
    </>
  )
}

export default SectionWrapper(Projects, "")