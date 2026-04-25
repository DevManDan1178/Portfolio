import React from 'react'
import Tilt from 'react-parallax-tilt'
import { motion } from 'framer-motion'
import { styles } from '../style'
import { services } from '../constants'
import { fadeIn, textVariant } from '../utils/motion'
import { preTitle, title, subDescription } from '../constants/about'
import { SectionWrapper } from '../hoc'

const ServiceCard = ({ index, title, icon }) => {
  return (
    <Tilt 
      className='xs:w-[250px] w-full'
      tiltMaxAngleX={15}
      tiltMaxAngleY={15}
      transitionSpeed={1500}
      tiltReverse
      transitionEasing='cubic-bezier(0.22, 1, 0.36, 1)'
       >
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
      >
      <div
        className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
      >
        <img 
          src={icon} 
          alt={title}
          className='w-16 h-16 object-contain'
        />
        <h3 className='text-white text-[20px] font-bold text-center'>
          {title}
        </h3>
      </div>
      </motion.div>
    </Tilt>
  )
}

const About = () => {
  return (
    <>
    <motion.div>
      <p className={styles.sectionSubText}>
        {preTitle}
      </p>
      <h2 className={styles.sectionHeadText}>
        {title}
      </h2>
    </motion.div>
    <motion.p
      variants={fadeIn("", "", 0,1, 1)}
      className={styles.subDescriptionText}
    >
      {subDescription}  
    </motion.p>
    <div className='mt-20 flex flex-wrap gap-10'>
      {services.map((service, index) => (
        <ServiceCard 
        key={service.title}
        index = {index}
        {...service}
        >

        </ServiceCard>
      ))}
    </div>
    </>
  )
}

export default SectionWrapper(About, "about")