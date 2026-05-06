import { useState } from 'react'
import Tilt from 'react-parallax-tilt'
import { motion } from 'framer-motion'
import { getDefaultLinkElement, type BulletPoint, type Project, SUBTAG_TEXT_SIZE_REDUCTION_BY_LAYER, defaultTagSymbol } from '../constants/projects'
import { styles } from '../style'
import { SectionWrapper } from '../hoc'
import { preTitle, title, subDescription, projects, type Tag } from '../constants/projects'
import AnimatedTextAppearance from './effects/AnimatedTextAppearance'

const PROJECTS_APPEARANCE_ANIMATION_Y = 75
const PROJECT_APPEARANCE_DURATION = 0.45

const PARENT_TAG_STYLE = "hover:bg-white/5 bg-white/10 cursor-pointer"

const ProjectCard = ({project , index} : {project : Project, index : number}) => {
  const [showingBulletPoints, setShowingBulletPoints] = useState<boolean>(false)
  const {name, display, description, tags, link, visuals, bulletPoints} = project
  const [toggledSubtagIds, setShowingSubtagsIds] = useState<Record<string, boolean | undefined>>({}) //Bitmask

  const getToggleSubTagsCall : (subTag : string) => () => void = (subTag : string) => () => {
        setShowingSubtagsIds({...toggledSubtagIds, [subTag] : !!!toggledSubtagIds[subTag]})
      }
  const Display = display
  //@ts-ignore
  function getSubTagsDisplay(tagList : Tag[], parentKey : string, textSizeReduction : number) {
    //@ts-ignore
    return tagList.map((tag : Tag, index : number) => { 
      const key = `${parentKey}${tag.name}`
      const hasSubTags = tag.subTags && tag.subTags.length > 0
      const showingSubTags = !toggledSubtagIds[key] == !tag.hideSubTagsByDefault
      const textSizeStyle = styles.getProjectTagTextSizeStyle((tag.baseTextSizeModifier ?? 0) - textSizeReduction) 
      return <span key={key}
          className="cursor-default"
        >
          <span 
            onClick={hasSubTags? getToggleSubTagsCall(key) : () => {}}
            className={`${hasSubTags && PARENT_TAG_STYLE} rounded-2xl ${textSizeStyle} ${tag.color} whitespace-nowrap inline-block`}
            style={{color : tag.color}}
          >
            &nbsp;{tag.overrideTagSymbol ? tag.overrideTagSymbol(tag.name) : defaultTagSymbol(tag.name)}
          </span>
        
          {
            (showingSubTags && tag.subTags) && <span>
              {getSubTagsDisplay(tag.subTags, key, textSizeReduction + SUBTAG_TEXT_SIZE_REDUCTION_BY_LAYER)}
            </span>
          }
        </span> 
    })
  }
  const [showing, setShowing] = useState<boolean>(false)
  
  return <motion.div 
      key={index}
      
      initial="hidden"
      animate="show"
      variants={{
                hidden: {y: PROJECTS_APPEARANCE_ANIMATION_Y, opacity: 0, },
                show: {y: 0, opacity: 1, transition: { type: "spring", duration: PROJECT_APPEARANCE_DURATION, delay: index * PROJECT_APPEARANCE_DURATION}},
              }}
        className='sm:w-[320px] w-[200px]'
        onClick={(_e => {
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
      className={`bg-slate-700/50 hover:bg-slate-400/35 rounded-2xl w-full h-full relative -top-[${-PROJECTS_APPEARANCE_ANIMATION_Y}] items-center justify-center flex pointer-events-${showing ? "auto" : "none"}  border-[4px] rounded-b-lg rounded-t-lg border-blue-400/15`}
      >
        <div className='w-[c  alc(100%-30px)] pt-[10px] pb-[10px] group'>
          <div className='relative w-full h-full'>
            <Display 
            LinkElement={!!link ? 
               getDefaultLinkElement(link.url, link.linkImage) : <></>
            } 
            />
            
          </div>
          <div className='mt-5'>
            <h3 className={`font-bold ${styles.projectHeadTextSizeStyle} ${visuals?.nameColor ?? ""}`}
             style={{ color: visuals?.nameColor ?? "white" }}
            >
              {name}
            </h3>
            <p className={`mt-2 ${styles.projectDescriptionTextStyle} ${visuals?.descriptionColor ?? ""}`}
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
                  className={`${bulletPoint.color ?? "text-blue-100/90"}${styles.projectBulletPointsTextStyle} mt-[10px]`}
                  style={{color : bulletPoint.color}}
                  > 
                    {"• "}{bulletPoint.text}
                  </p>
                ))}
              </div>
            </div>
            <div className='mt-3 h-full gap-2'>
              {tags.map((tag : Tag) => {  
                const showingSubTags = !toggledSubtagIds[tag.name] == !tag.hideSubTagsByDefault
                const hasSubTags = tag.subTags && tag.subTags.length > 0
                const textSizeStyle = styles.getProjectTagTextSizeStyle(tag.baseTextSizeModifier) 
                return <span key={tag.name}
                  className={`${tag.color} cursor-default`}
                  style={{ color: tag.color }}
                >
                  <span 
                    onClick={hasSubTags ? getToggleSubTagsCall(tag.name) : () => {}}
                    className={`${hasSubTags && PARENT_TAG_STYLE} rounded-lg ${textSizeStyle} whitespace-nowrap`}
    
                  >
                    {tag.overrideTagSymbol ? tag.overrideTagSymbol(tag.name) : defaultTagSymbol(tag.name)}
                    <br/>
                  </span>
                  {
                    (showingSubTags && tag.subTags) && <span>
                      {getSubTagsDisplay(tag.subTags, tag.name, SUBTAG_TEXT_SIZE_REDUCTION_BY_LAYER)}
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
    <div>
        <div> 
          {/*
          variants={{hidden: {y: -50, opacity: 0, }, show: { y: 0, opacity: 1, transition: { type: "spring", duration: 1.25, delay: TITLE_TRANSITION_DELAY}}}}
          viewport={{ once: true }}
          layout
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
          variants={{show: {y: 0, opacity: 1, transition : {delay: 0.1, duration: 1}},}} 
          className={styles.subDescriptionText}
          layout
        >
          {subDescription}
        </motion.p>
      </div>
      
      <div className='flex flex-wrap gap-16 items-start justify-center pt-[50px] w-[100%]'>
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
    </div>
  )
}

export default SectionWrapper(Projects, "")