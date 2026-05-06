
import { motion } from 'framer-motion'
import { styles } from '../style'
import { preTitle, title, SubDescription, type Service } from '../constants/about'
import { GetSocialLinkElement, CoreSocialLinks as SocialLinks } from '../constants/contact'
import "../index.css"
import { SectionWrapper } from '../hoc'
import AnimatedTextAppearance from './effects/AnimatedTextAppearance'

const TITLE_TRANSITION_DELAY = 0.35
const DESCRIPTION_TRANSITION_DELAY = 0.75

const About = () => {
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
        className={styles.subDescriptionText}
      >
        <SubDescription/>
      </motion.p>
      <motion.div 
        className='flex items-center justify-center gap-10 mt-[25px]'
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
        {Object.entries(SocialLinks).map(([platform, link], index : number) =>  (
          GetSocialLinkElement(link, index.toString())
        ))}
      </motion.div>
    </>
  )
}

export default SectionWrapper(About, "about")