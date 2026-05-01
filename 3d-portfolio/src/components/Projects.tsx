import React, { useState } from 'react'
import Tilt from 'react-parallax-tilt'
import { motion } from 'framer-motion'
import { getDefaultLinkElement, type BulletPoint, type Project, MINIMUM_SUBTAG_TEXT_SIZE, SUBTAG_TEXT_SIZE_REDUCTION_BY_LAYER, BASE_TAG_SIZE, PROJECTS_TITLE_TEXT_SIZE, PROJECTS_DESCRIPTION_TEXT_SIZE, PROJECTS_BULLET_POINTS_TEXT_SIZE, defaultTagSymbol } from '../constants/projects'
import { styles } from '../style'
import { SectionWrapper } from '../hoc'
import { preTitle, title, subDescription, projects, type Tag } from '../constants/projects'

const TITLE_TRANSITION_DELAY = 0.35
const PROJECTS_APPEARANCE_ANIMATION_Y = 200

const ProjectCard = ({project , index} : {project : Project, index : number}) => {
  const [showingBulletPoints, setShowingBulletPoints] = useState<boolean>(false)
  const {name, display, description, tags, link, visuals, bulletPoints} = project
  const [showingSubtagIds, setShowingSubtagsIds] = useState<Record<string, boolean | undefined>>({}) //Bitmask

  const getToggleSubTagsCall : (subTag : string) => () => void = (subTag : string) => () => {
        setShowingSubtagsIds({...showingSubtagIds, [subTag] : !!!showingSubtagIds[subTag]})
      }
  const Display = display
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
            className={`${hasSubTags ? "hover:bg-black/15" : ""} rounded-2xl text-[${textSize}px] ${tag.color} whitespace-nowrap inline-block`}
          >
            &nbsp;{tag.overrideTagSymbol ? tag.overrideTagSymbol(tag.name) : defaultTagSymbol(tag.name)}
          </span>
        
          {
            showingSubTags && <span>
              {getSubTagsDisplay(tag.subTags, key, Math.max(MINIMUM_SUBTAG_TEXT_SIZE, textSize - SUBTAG_TEXT_SIZE_REDUCTION_BY_LAYER))}
            </span>
          }
        </span> 
    })
  }
  const [showing, setShowing] = useState<boolean>(false)
  
  return <motion.div 
     variants={{
      hidden: {
        x: 0,
        y:PROJECTS_APPEARANCE_ANIMATION_Y,
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
        className='sm:w-[340px] w-[100%]'
        onClick={(e => {
            console.log("clicked project ", project.name)
          })}
        onAnimationComplete={() => {
          setShowing(true)
        }}
      >
       <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      transitionSpeed={1000}
      className={`bg-slate-700/50 hover:bg-slate-400/50 rounded-2xl w-full h-full relative -top-[${-PROJECTS_APPEARANCE_ANIMATION_Y}] items-center justify-center flex pointer-events-${showing ? "auto" : "none"}  border-[4px] rounded-b-lg rounded-t-lg border-blue-400/15`}
      >
        <div className='w-[calc(100%-30px)] pt-[10px] pb-[10px] group'>
          <div className='relative w-full h-full'>
            <Display 
            LinkElement={!!link ? getDefaultLinkElement(() => window.open(link, "_blank")) : <></>
            } 
            />
            
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
            <div className='rounded-2xl mt-3 items-center justify-center flex cursor-default' onClick={() => {setShowingBulletPoints(!showingBulletPoints)}}>
              {(bulletPoints && !showingBulletPoints) && 
                  <div className='text-center hover:bg-white/5 bg-white/15 rounded-2xl w-[20px] text-[14px] text-teal-100 '>+</div>
              }
              <div>
                {showingBulletPoints && bulletPoints?.map((bulletPoint : BulletPoint, index : number) => (
                  <p 
                  key={`${index}`}
                  className={`${bulletPoint.color ?? "text-teal-100"} text-[${PROJECTS_BULLET_POINTS_TEXT_SIZE}px] mt-[10px]`}
                  style={{color : bulletPoint.color}}
                  > 
                    &nbsp;&nbsp;{"• "}{bulletPoint.text}
                  </p>
                ))}
              </div>
            </div>
            <div className='mt-3 h-full gap-2'>
              {tags.map((tag : Tag, index : number) => { 
                const showingSubTags = showingSubtagIds[tag.name]
                const hasSubTags = tag.subTags.length > 0
                return <span key={tag.name}
                  className={`${tag.color} cursor-default`}
                  style={{ color: tag.color }}
                >
                  <span 
                    onClick={tag.subTags.length > 0 ? getToggleSubTagsCall(tag.name) : () => {}}
                    className={`${hasSubTags ? "hover:bg-white/5 bg-black/15" : ""} rounded-lg text-[${tag.baseTextSize ?? BASE_TAG_SIZE}px] whitespace-nowrap`}
    
                  >
                    {tag.overrideTagSymbol ? tag.overrideTagSymbol(tag.name) : defaultTagSymbol(tag.name)}
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
      
      <div className='flex flex-wrap gap-7 items-start justify-center pt-[50px] w-[100%]'>
        {projects.map((project, index) => (
          <div key={`project-${index}`}>
            <ProjectCard 
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