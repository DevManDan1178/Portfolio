import React, { useState } from 'react'
import Tilt from 'react-parallax-tilt'
import { motion } from 'framer-motion'
import { type BulletPoint, type Project } from '../constants/projects'
import { styles } from '../style'
import { SectionWrapper } from '../hoc'
import { preTitle, title, subDescription, projects, type Tag } from '../constants/projects'

const TITLE_TRANSITION_DELAY = 0.35

const PROJECTS_TITLE_TEXT_SIZE = 24
const PROJECTS_DESCRIPTION_TEXT_SIZE = 20
const PROJECTS_BULLET_POINTS_TEXT_SIZE = 16

const PROJECTS_APPEARANCE_ANIMATION_Y = 200
const SUBTAG_TEXT_SIZE_REDUCTION_BY_LAYER = 2
const BASE_TAG_SIZE = 20
const MINIMUM_SUBTAG_TEXT_SIZE = 14

const ProjectCard = ({project , index} : {project : Project, index : number}) => {
  const {name, image, description, tags, link, visuals, bulletPoints, onClick} = project
  const [showingSubtagIds, setShowingSubtagsIds] = useState<Record<string, boolean | undefined>>({}) //Bitmask
  const getToggleSubTagsCall : (subTag : string) => () => void = (subTag : string) => () => {
        setShowingSubtagsIds({...showingSubtagIds, [subTag] : !!!showingSubtagIds[subTag]})
      }

  //@ts-ignore
  function getSubTagsDisplay(tagList : Tag[], parentKey : string, textSize : number) {
    //@ts-ignore
    return tagList.map((tag : Tag, index : number) => { 
      const key = `${parentKey}${tag.name}`
      const hasSubTags = tag.subTags.length > 0
      const showingSubTags = !!showingSubtagIds[key]
      return <span key={key}
          className="cursor-default"
        >
          <span 
            onClick={hasSubTags? getToggleSubTagsCall(key) : () => {}}
            className={`${hasSubTags ? "hover:bg-black/15" : ""} rounded-2xl text-[${textSize}px] ${tag.color}`}
          >
            {"<"}{tag.name}{"> "}
          </span>
        
          {
            showingSubTags && <span>
              <br/>
              {getSubTagsDisplay(tag.subTags, key, Math.max(MINIMUM_SUBTAG_TEXT_SIZE, textSize - SUBTAG_TEXT_SIZE_REDUCTION_BY_LAYER))}
              <br/>
            </span>
          }
        </span>
    })
  }

  return <motion.div 
     variants={{
      hidden: {
        x: 0,
        y:-PROJECTS_APPEARANCE_ANIMATION_Y,
        opacity: 0,
      },
      show: {
        x: 0,
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          delay: index * 0.5,
          duration: 0.75,
          ease: "easeOut",
        },}}}
        className='sm:w-[360px] w-[100%]'
        onClick={(e => {
            if (onClick) onClick()
            console.log("clicked project ", project.name)
          })}
      >
       <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      transitionSpeed={1000}
      className={`bg-slate-800 rounded-2xl w-full h-full relative -top-[${PROJECTS_APPEARANCE_ANIMATION_Y}] items-center justify-center flex`}
      >
        <div className='w-[calc(100%-20px)] pt-[10px] pb-[10px] group'>
          <div className='relative w-full h-full'>
            <img
            src={image}
            alt={name}
            className='w-full h-full object-cover rounded-2xl brightness-[75%] group-hover:brightness-[100%] transition-[filter] duration-300 ease-in-out'
            />
            <div className='absolute inset-0 flex justify-end m-3 card-img_hover pointer-events-none'>
              <div
                className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer pointer-events-auto'
                onClick={() => window.open(link, "_blank")}
              > 
                <h1 className='w-1/2 h-1/2 object-contain'> 🔗 </h1>
              </div>
            </div>
          </div>
          <div className='mt-5'>
            <h3 className={`font-bold text-[${PROJECTS_TITLE_TEXT_SIZE}px] ${visuals?.nameColor ?? ""}`}
             style={{ color: visuals?.nameColor ?? "white" }}
            >
              {name}
            </h3>
            <p className={`mt-2 text-[${PROJECTS_DESCRIPTION_TEXT_SIZE}px] ${visuals?.descriptionColor ?? ""}`}
              style={{ color: visuals?.descriptionColor ?? "white" }}
            >
              {description}
            </p>
            <div>
              {bulletPoints?.map((bulletPoint : BulletPoint, index : number) => (
                <p 
                className={`${bulletPoint.color ?? ""} text-[${PROJECTS_BULLET_POINTS_TEXT_SIZE}px] mt-[10px]`}
                style={{color : bulletPoint.color}}
                >
                  {"> "}{bulletPoint.text}
                </p>
              ))}
            </div>
            <div className='mt-4 h-full gap-2'>
              {tags.map((tag : Tag, index : number) => { 
                const showingSubTags = showingSubtagIds[tag.name]
                const hasSubTags = tag.subTags.length > 0
                return <span key={tag.name}
                  className={`${tag.color} cursor-default`}
                  style={{ color: tag.color }}
                >
                  <span 
                    onClick={tag.subTags.length > 0 ? getToggleSubTagsCall(tag.name) : () => {}}
                    className={`${hasSubTags ? "hover:bg-white/10  bg-black/20" : ""} rounded-lg text-[${tag.baseTextSize ?? BASE_TAG_SIZE}px]`}
                  >
                    {"<"}{tag.name}{">"}
                    <br/>
                  </span>
                  {
                    showingSubTags && <span>
                      {getSubTagsDisplay(tag.subTags, tag.name, BASE_TAG_SIZE - SUBTAG_TEXT_SIZE_REDUCTION_BY_LAYER)}
                      <br/>
                    </span>
                  }
                </span>
              })}
            </div>
          </div>
        </div> 
      </Tilt>
  </motion.div>
}


const Projects = () => {
  return (
    <>
        <motion.div 
          variants={{hidden: {y: -50, opacity: 0, }, show: { y: 0, opacity: 1, transition: { type: "spring", duration: 1.25, delay: TITLE_TRANSITION_DELAY}}}}
          layout
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
          variants={{show: {y: 0, opacity: 1, transition : {delay: 0.1, duration: 1}},}} 
          className={styles.subDescriptionText}
          layout
        >
          {subDescription}
        </motion.p>
      </div>
      
      <div className='flex flex-wrap gap-7 items-start justify-normal pt-[50px]'>
        {projects.map((project, index) => (
          <div>
            <ProjectCard 
              key={`project-${index}`}
              index={index}
              project={project}
            />
          </div>
        ))

      }
      </div>
    </>
  )
}

export default SectionWrapper(Projects, "")