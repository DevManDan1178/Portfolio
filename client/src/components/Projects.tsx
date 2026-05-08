
import { useState } from 'react' 
import { styles } from '../style';
import { getDefaultLinkElement, type BulletPoint, type Project, SUBTAG_TEXT_SIZE_REDUCTION_BY_LAYER, defaultTagSymbol } from '../constants/projects';
import { type Tag } from '../constants/tags';
import Tilt from 'react-parallax-tilt'
import { motion } from 'framer-motion'
import { SectionWrapper } from '../hoc'
import { preTitle, title, subDescription, projects} from '../constants/projects'
import AnimatedTextAppearance from './effects/AnimatedTextAppearance'
import { GetLinkDisplay } from './Pages';
import { pages } from '../constants/pages/pages';

const PROJECTS_APPEARANCE_ANIMATION_Y = 50
const PROJECT_APPEARANCE_DURATION = 0.5

export const ProjectCard = ({project, disableMouseEvents = false} : {project : Project, disableMouseEvents? : boolean}) => {
  const [toggledBulletPoints, setToggledBulletPoints] = useState<boolean>(!!project.featured)
  const {name, display, description, tags, link, visuals, bulletPoints} = project
  const [toggledSubtagIds, setShowingSubtagsIds] = useState<Record<string, boolean | undefined>>({}) //Bitmask

  const getToggleSubTagsCall : (subTag : string) => () => void = (subTag : string) => () => {
        setShowingSubtagsIds({...toggledSubtagIds, [subTag] : !!!toggledSubtagIds[subTag]})
      }
  const Display = display
  //@ts-ignore
  function getSubTagsDisplay(tagList : Tag[], parentKey : string, depth : number = 0) {
    //@ts-ignore
    return tagList.map((tag : Tag, index : number) => { 
      const key = `${parentKey}${tag.name}`
      const hasSubTags = tag.subTags && tag.subTags.length > 0
      const showingSubTags = !toggledSubtagIds[key] == !tag.hideSubTagsByDefault
      const textSizeStyle = styles.getProjectTagTextSizeStyle((tag.baseTextSizeModifier ?? 0) - depth * SUBTAG_TEXT_SIZE_REDUCTION_BY_LAYER) 
      console.log((tag.baseTextSizeModifier ?? 0)  - depth * SUBTAG_TEXT_SIZE_REDUCTION_BY_LAYER, tag.name, textSizeStyle)
      return <span key={key}
          className="cursor-default"
        >
          <span 
            onClick={hasSubTags? getToggleSubTagsCall(key) : () => {}}
            className={`${hasSubTags && styles.parentTagTextStyle} rounded-2xl ${textSizeStyle} ${tag.color} whitespace-nowrap inline-block`}
            style={{color : tag.color}}
          >
            &nbsp;{tag.overrideTagSymbol ? tag.overrideTagSymbol(tag.name) : defaultTagSymbol(tag.name)}
          </span>
        
          {
            (showingSubTags && tag.subTags) && <span>
              {getSubTagsDisplay(tag.subTags, key, depth + 1)}
            </span>
          }
        </span> 
    })
  }
  
  return <div className='sm:w-[320px] w-[200px]'>
      <Tilt
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
        transitionSpeed={1000}
        className={`bg-slate-700/50 hover:bg-slate-400/35 rounded-2xl w-full h-full relative items-center justify-center flex pointer-events-${disableMouseEvents ? "none" : "auto"}  border-[4px] rounded-b-lg rounded-t-lg border-blue-400/15`}
      >
        <div className='w-[c  alc(100%-30px)] pt-[10px] pb-[10px] pl-[10px] pr-[10px] group'>
          <a 
            className='relative w-full h-full'
            href={link?.url}
            target='_blank'
            >
            <Display 
            LinkElement={!!link ? 
               getDefaultLinkElement(link.url, link.linkImage) : <></>
            } 
            />
            
          </a>
          <div className='mt-5'>
            <h3 className={`font-bold ${styles.projectTextStyles.headTextSizeStyle} ${visuals?.nameColor ?? ""}`}
             style={{ color: visuals?.nameColor ?? "white" }}
            >
              {name}
            </h3>
            <p className={`mt-2 ${styles.projectTextStyles.descriptionTextSizeStyle} ${visuals?.descriptionColor ?? ""}`}
              style={{ color: visuals?.descriptionColor ?? "white" }}
            >
              {description}
            </p>
            <div className='rounded-2xl mt-3 items-center justify-center flex cursor-default' onClick={() => {setToggledBulletPoints(!toggledBulletPoints)}}>
              {(bulletPoints && !toggledBulletPoints) && 
                  <div className='text-center hover:bg-white/5 bg-white/15 rounded-2xl w-[20px] text-[14px] text-teal-100 '>+</div>
              }
              <div>
                {toggledBulletPoints && bulletPoints?.map((bulletPoint : BulletPoint, index : number) => (
                  <p 
                  key={`${index}`}
                  className={`${bulletPoint.color ?? "text-blue-100/90"}${styles.projectTextStyles.bulletPointsTextSizeStyle} mt-[10px]`}
                  style={{color : bulletPoint.color}}
                  > 
                    {"• "}{bulletPoint.text}
                  </p>
                ))}
              </div>
            </div>
            <div className='mt-3 h-full gap-2'>
              {tags.map((tag : Tag) => {  
                console.log(tag.name, tag.hideSubTagsByDefault)
                const showingSubTags = !toggledSubtagIds[tag.name] == !tag.hideSubTagsByDefault
                const hasSubTags = tag.subTags && tag.subTags.length > 0
                const textSizeStyle = styles.getProjectTagTextSizeStyle(tag.baseTextSizeModifier ?? 0) 
                return <span key={tag.name}
                  className={`${hasSubTags ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div className={`${hasSubTags && styles.parentTagTextStyle} h-min w-min rounded-lg`}>
                    <span 
                      onClick={hasSubTags ? getToggleSubTagsCall(tag.name) : () => {}}
                      className={`${textSizeStyle} whitespace-nowrap ${tag.color} `}
                      style={{color : tag.color}}
      
                    >
                      {tag.overrideTagSymbol ? tag.overrideTagSymbol(tag.name) : defaultTagSymbol(tag.name)}
                      <br/>
                    </span>
                  </div>
                  {
                    (showingSubTags && tag.subTags) && <span>
                      {getSubTagsDisplay(tag.subTags, tag.name)}
                      <br/>
                    </span>
                  }
                </span>
              })}
            </div>
          </div>
        </div> 
      </Tilt>
  </div>
}


const Projects = () => {
  const shownProjects = Object.values(projects).filter((project) => !!project.featured)
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
      
      <div className='flex flex-wrap gap-16 items-start justify-center pt-[30px] w-[100%] -z-10'>
        {shownProjects.map((project, index) => {
          const [showing, setShowing] = useState(false)
          return <motion.div 
            key={`project-${index}`}
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
            <ProjectCard project={project} disableMouseEvents={!showing}/>
          </motion.div>
        })}
      </div>
      <div className='items-center w-full justify-center flex flex-col pt-5'>
        <button 
          className='text-center justify-center bg-white/25 rounded-xl w-[calc(15%+100px)] h-[30px] border-2 border-white/20 cursor-pointer hover:bg-white/15 transition-all transition-duration-[0.5s] hover:scale-[1.05]'
          onClick={() => {
            window.open(pages.projects.url, "_blank")
          }}
        >
          View All Projects
        </button>
      </div>
    </div>
  )
}

export default SectionWrapper(Projects, "")