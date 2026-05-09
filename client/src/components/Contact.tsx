import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SectionWrapper } from '../hoc'
import { emailDomain, emailUser, preTitle, title, subDescription, GetSocialLinkElement } from '../constants/contact'
import { SocialLinks } from '../constants/contact'
import AnimatedTextAppearance from './effects/AnimatedTextAppearance'
import { type ScreenSizeType, GetScreenSizeType, styles } from '../style'


const EMAIL_COPIED_DISPLAY_DURATION = 3


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
    <div>
      <div> 
        {/*        
        variants={{hidden: {y: -50, opacity: 0, }, show: { y: 0, opacity: 1, transition: { type: "spring", duration: 1.25, delay: TITLE_TRANSITION_DELAY}}}}
        viewport={{ once: true }}
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
        <span className='flex text-center justify-center mt-[50px] text-[20px] font-semibold'>
          Clicky Stuffs
        </span>
        <div className='flex items-center justify-center gap-10 mt-[10px]'>
          {Object.entries(SocialLinks).map(([_platform, link], index : number) =>  (
            GetSocialLinkElement(link, index.toString(), true, styles.getLinkDisplayPixelSize(screenSizeType))
        ))}
      </div>
      <div  className={`pt-[25px] ${styles.copyEmailSizeStyle} flex items-center justify-center w-full`}>
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