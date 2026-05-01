import { useEffect } from 'react'
import {useState, useRef} from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { styles } from '../style'
import { EarthCanvas } from './canvas'
import { SectionWrapper } from '../hoc'
import { slideIn } from '../utils/motion'
import { portfolioHeroName, portfolioHeroEmail } from '../constants'

const SERVICE_ID = ""
const TEMPLATE_ID = ""
const PUBLIC_KEY = ""
const RECEIVER_EMAIL = portfolioHeroName
const RECEIVER_NAME = portfolioHeroEmail



async function SendEmail(form : any) {
  if (SERVICE_ID.length == 0 || TEMPLATE_ID.length == 0 || PUBLIC_KEY.length == 0 || RECEIVER_EMAIL.length == 0) {
    console.log("Email was not send because the API was not configured properly")
    return
  }
  emailjs.send(
    SERVICE_ID, 
    TEMPLATE_ID, 
    {
      from_name: form.name,
      to_name: RECEIVER_NAME,
      from_email: form.email,
      to_email: RECEIVER_EMAIL,
    },
    PUBLIC_KEY
  )
}

const Contact = () => {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [form, setForm] = useState({name: '', email: '', message: ''})
  const [loading, setLoading] = useState(false)

  const handleChange = (e : any) => {
    const { name, value } = e.currentTarget
    console.log(name, value)
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e : any) => {
    e.preventDefault()
    setLoading(true)
    SendEmail(form).then(() => {
      setLoading(false)
      alert("Message recieved! I will get back to you soon. (probably)")

      setForm({
        name:'',
        email:'',
        message:'',
      })
    }, (error) => {
      setLoading(false)
      console.log(error)
      alert("Something went wrong. Oops.")
    })
  }
  useEffect(() => {
  console.log("FORM STATE:", form);
}, [form]);

  return (
    <div className='xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden'>
      <motion.div
        variants={{
          hidden: {
            x:"-100%",
            y: 0,
          },
          show: {
            x: 0,
            y: 0,
            transition: {
              type: "tween",
              delay: 0.2,
              duration: 1,
              ease: "easeOut",
            },
          }}}
        className='flex-[0.75] bg-black-100 p-8 rounded-2xl'
      >
      <p className={styles.sectionSubText}>Get in touch</p>
      <h3 className={styles.sectionHeadText}>Contact.</h3>
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

      </form>
      </motion.div>
      <motion.div
        variants={{
          hidden: {
            x:"100%",
            y: 0,
          },
          show: {
            x: 0,
            y: 0,
            transition: {
              type: "tween",
              delay: 0.2,
              duration: 1,
              ease: "easeOut",
            },
          }}}
        className='x1:flex-1 xl:h-auto md:h-[550px] h-[350px] w-full'
      >
        <EarthCanvas/>

      </motion.div>
    </div>
  )
}

export default SectionWrapper(Contact, "contact")