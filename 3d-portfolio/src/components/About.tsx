
import { motion } from 'framer-motion'
import { styles } from '../style'
import { preTitle, title, SubDescription, type Service } from '../constants/about'
import { CoreSocialLinks as SocialLinks } from '../constants/contact'
import "../index.css"
import { SectionWrapper } from '../hoc'

const TITLE_TRANSITION_DELAY = 0.35

const About = () => {
  return (
    <>
      <motion.div
        variants={{hidden: {y: -50, opacity: 0, }, show: { y: 0, opacity: 1, transition: { type: "spring", duration: 1.25, delay: TITLE_TRANSITION_DELAY}}}}
      >
        <p className={styles.sectionSubText}>
          {preTitle}
        </p>
        <h2 className={styles.sectionHeadText}>
          {title}
        </h2>
      </motion.div>
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
              duration: 0.75,
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
          <a
            key={index}
            className="flex flex-col items-center justify-center gap-2 group"
            href={link.url}
            target='_blank' 
          >
            <div
              className="w-[50px] h-[50px] flex items-center justify-center bg-black rounded-lg relative overflow-hidden border-2 border-white/50"
            >
              <img
                src={link.linkIcon}
                className="w-3/4 relative aspect-square"
              />

              {/* ripple layer */}
              <div className=" w-full h-full absolute flex items-center justify-center z-1">
                <div
                  className="
                    w-[0%] h-[0%]
                    rounded-full
                    backdrop-invert
                    group-hover:w-[200%]
                    group-hover:h-[200%]
                    transition-all
                    duration-[0.5s]
                    ease-in-out
                  "
                />
              </div>
            </div>
            {/* LABEL */}
            <span className="text-white/75 text-xs text-center"> 
              <b>{link.platform}</b>
            </span>
          </a>
        ))}
      </motion.div>
    </>
  )
}

export default SectionWrapper(About, "about")