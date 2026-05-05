import { useRef } from 'react'
import { motion } from 'framer-motion'
import { styles } from '../style'
import { SectionWrapper } from '../hoc'
import { emailDomain, emailUser, preTitle, title, subDescription } from '../constants/contact'
import { SocialLinks } from '../constants/contact'
import {  useState } from 'react'


const EMAIL_COPIED_DISPLAY_DURATION = 3

const TITLE_TRANSITION_DELAY = 0.35


const Contact = () => {
 const [showEmailCopied, setShowEmailCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onEmailCopy = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    navigator.clipboard.writeText(emailUser + "@" + emailDomain)
    setShowEmailCopied(true)

    timeoutRef.current = setTimeout(() => {
      setShowEmailCopied(false)
    }, EMAIL_COPIED_DISPLAY_DURATION * 1000)
  }

  return (
    <div>
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
        <span className='flex text-center justify-center mt-[25px] text-[30px] font-semibold'>
          Clicky Stuffs
        </span>
        <div className='flex items-center justify-center gap-10 mt-[25px]'>
          {Object.entries(SocialLinks).map(([platform, link], index : number) =>  (
            <div
              key={index}
              onClick={() => window.open(link.url, "_blank")}
              className="flex flex-col items-center justify-center gap-2 group cursor-pointer"
            >
            <div className="w-[50px] h-[50px] flex items-center justify-center bg-black rounded-lg relative overflow-hidden border-2 border-white/50">
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
          </div>
        ))}
      </div>
      <div  className='mt-[25px] flex items-center justify-center w-full'>
          <button 
            className=' bg-white/10 hover:bg-white/20 pl-2 pr-2 rounded-xl transition-all transition-duration[0.5s] border-white/30 border-[2px] hover:border-white/20 hover:scale-110'
            onClick={onEmailCopy}
          >
            <span className='text-blue-100/60'>{showEmailCopied ? "Copied" : "Copy"}[</span> 
            <span className='green-text-gradient font-semibold'>{emailUser}</span>
            <span className='blue-text-gradient font-pixeloid'> @   </span>
            <span className='blue-text-gradient font-semibold'>{emailDomain}</span>
            <span className='text-blue-100/60'>]</span> 
          </button>     
      </div>   
    </div>
  )
}
/*
<form
        ref={formRef}
        onSubmit={handleSubmit}
        className='mt-12 flex flex-col gap-8'
      >
        <label className='flex flex-col'>
          <span className='text-white font-medium mb-4'>Your Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder='Insert Name Here'
            className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
          ></input>
        </label>

        <label className='flex flex-col'>
          <span className='text-white font-medium mb-4'>Your Email</span>
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder='Insert Email Here'
            className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
          ></input>
        </label>

        <label className='flex flex-col'>
          <span className='text-white font-medium mb-4'>Your Message</span>
          <textarea
            rows={7}
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder='Insert cool block of text here'
            className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
          ></textarea>
        </label>
        <button
          type='submit'
          className='bg-tertiary py-3 px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl'
        >
          {loading ? 'Sending...' : 'Send'}
        </button>

      </form>*/
export default SectionWrapper(Contact, "contact")