import React from 'react'
import { motion } from 'framer-motion'
import { styles } from '../style'
import { SectionWrapper } from '../hoc'
import { fadeIn, textVariant } from '../utils/motion'
import { testimonials, preTitle, title, type Testimonial } from '../constants/testimonials'

const TITLE_TRANSITION_DELAY = 0.35

const TestimonialCard = ({index, testimonial} : {index : number, testimonial : Testimonial}) => {
  const {statement, name, designation, image} = {...testimonial}
    return (
      <motion.div
        variants={{
          hidden: {
            x:-100,
            y: 0,
          },
          show: {
            x: 0,
            y: 0,
            transition: {
              type: "tween",
              delay: 0,
              duration: .65,
              ease: "easeOut",
            }}}}
        viewport={{ once: true }}
        className='bg-black-200 p-10 rounded-3xl w-[300px] md:w-[calc(15%+300px)] '
      >
        <p className='text-white font-black text-[48px]'>"</p>
        <div  className='mt-1'>
          <p className='text-white tracking-wider text-[18px]'>
            {statement}
          </p>
          <div className='mt-7 flex justify-between items-center gap-1'>
            <div className='flex-1 flex flex-col'>
              <p className='text-white font-medium text-[16px]'>
                <span className="blue-text-gradient">@</span> {name}
              </p>
              <p className='mt-1 text-secondary text-[12px]'>
                {designation}
              </p>
            </div>
            <img
              src={image}
              alt={`feedback by ${name}`}
              className='w-10 h-10 rounded-full object-cover'
            />
          </div>
        </div>
      </motion.div>
  )
}

const Testimonials = () => {
  return (
    <div className='mt-12 bg-black-100 rounded-[20px]'>
      <div className={`${styles.padding} bg-tertiary rounded-2xl min-h-[300px]`}>
        <motion.div  
          variants={{hidden: {y: -50, opacity: 0, }, show: { y: 0, opacity: 1, transition: { type: "spring", duration: 1.25, delay: TITLE_TRANSITION_DELAY}}}}
          viewport={{ once: true }}
        >
          <p className={styles.sectionSubText}>
            {preTitle}
          </p>
          <h2 className={styles.sectionHeadText}>
            {title}
          </h2>
        </motion.div>
      </div>
      <div className={`${styles.paddingX} -mt-20 pb-14 flex flex-wrap gap-7`}>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.name}
            testimonial={testimonial}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

export default SectionWrapper(Testimonials, "Testimonials")