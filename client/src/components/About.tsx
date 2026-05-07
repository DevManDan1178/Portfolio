
import { motion } from 'framer-motion'
import { styles, GetScreenSizeType, type ScreenSizeType } from '../style'
import { preTitle, title, SubDescription} from '../constants/about'
import { GetSocialLinkElement, CoreSocialLinks as SocialLinks } from '../constants/contact'
import "../index.css"
import { SectionWrapper } from '../hoc'
import AnimatedTextAppearance from './effects/AnimatedTextAppearance'
import { useEffect, useState } from 'react'

const DESCRIPTION_TRANSITION_DELAY = 0.75

const About = () => {
  const [screenSizeType, setScreenSizeType] = useState<ScreenSizeType>(GetScreenSizeType())

   useEffect(() => {
    const checkScreenSize = () => {
      setScreenSizeType(GetScreenSizeType())
    }
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  return (
    <>
      <div> {/*  
        variants={{hidden: {y: -50, opacity: 0, }, show: { y: 0, opacity: 1, transition: { type: "spring", duration: 1.25, delay: TITLE_TRANSITION_DELAY}}}}
        viewport={{ once: true }}
        */}
        <p className={styles.sectionSubText}>
          <AnimatedTextAppearance text={preTitle} startingState={{translateY: 5} }/>
        </p>
        <h2 className={styles.sectionHeadText}>
          {title}
        </h2>
      </div>
      <motion.p
        variants={{
          hidden: {
            x: 0,
            y: 100,
            opacity: 0,
          },
          show: {
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
              type: "spring",
              delay: .5,
              duration: DESCRIPTION_TRANSITION_DELAY,
              ease: "easeOut",
            },}}}
        className={`${styles.subDescriptionText}`}
      >
        <span className={styles.aboutDescriptionTextSizeStyle}>
          <SubDescription/>
        </span>
        
      </motion.p>
      <motion.div 
        className='flex items-center justify-center gap-10 mt-[25px]  mb-[50px]'
        variants={{
          hidden: {
            x: 0,
            y: -50,
            opacity: 0,
          },
          show: {
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
              type: "spring",
              delay: 1,
              duration: 0.75,
              ease: "easeOut",
            },}}}
      >
        {Object.entries(SocialLinks).map(([_platform, link], index : number) =>  (
          GetSocialLinkElement(link, index.toString(), true, styles.getLinkDisplayPixelSize(screenSizeType))
        ))}
      </motion.div>
    </>
  )
}

export default SectionWrapper(About, "about")