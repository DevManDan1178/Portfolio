import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { styles } from '../style'
import { menu, close } from '../assets'
import { navLinks, type NavLink , portfolioHeroHandle} from '../constants'

export function ScrollToNavId(navId : string) {
    document.getElementById(navId)?.scrollIntoView({
    behavior: "smooth",
  });
}

const Navbar = () => {
  const [toggle, setToggle] = useState<boolean>(false)
  const navbarLinks : NavLink[] =  Object.values(navLinks)
  const [surfingNavlinkIndex, setSurfingNavlinkIndex] = useState(0)
  const surfingNavlinkIndexRef = useRef(0)
  
  const setSurfingNavlinkIdx = (index : number) => { 
    setSurfingNavlinkIndex(index)
    surfingNavlinkIndexRef.current = index 
  }
  
  useEffect(() => {
    function updateActive() {
      const vh = window.innerHeight;
      const center = vh / 2;

      let closestIndex = -1;
      let closestDistance = Infinity;

      navbarLinks.forEach((link, index) => {
        const el = document.getElementById(link.id);
        if (!el) return;
        
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;

        if (!isVisible) return;

        // distance from center of screen
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(center - elementCenter);

        // fallback for bottom section (important fix)
        const isAtBottom =
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 2;

        if (isAtBottom && index === navbarLinks.length - 1) {
          closestIndex = index;
          return;
        }

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

    setSurfingNavlinkIdx(closestIndex);
  };

  window.addEventListener("scroll", updateActive);
  window.addEventListener("resize", updateActive);
  function processKeyboardEvent(event : KeyboardEvent) {
    if (event.code == "Space") {
      console.log((surfingNavlinkIndexRef.current + 1) % (navbarLinks.length), navbarLinks.length)
      scrollToNavIdx(Math.min(surfingNavlinkIndexRef.current + 1 , navbarLinks.length - 1))
      event.preventDefault()
    }
  }
  window.addEventListener("keydown", processKeyboardEvent)

  updateActive(); 

  return () => {
    window.removeEventListener("scroll", updateActive);
    window.removeEventListener("resize", updateActive);
  };
}, []);

  function scrollToNavIdx(navIdx : number) : void {
    const navId = navbarLinks[navIdx].id
    ScrollToNavId(navId)
  }

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-2 fixed top-0 z-20 bg-primary`}> 
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          to="/" 
          className='flex items-center gap-2'
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          {/* 
          <img 
          src= {logo} 
          alt="logo"
          className="w-9 h-9 object-contain"
          />
          */}
          <p className='text-white text-[18px] font-bold cursor-pointer flex'> 
            {portfolioHeroHandle}
          </p>

        </Link>
        <ul className='lg:flex list-none hidden flex:row gap-10'>
          {navbarLinks.map((link : NavLink, index : number) => (link.showInNavbar &&
            <li 
              key={link.id}
              className={`${surfingNavlinkIndexRef.current == index ? "text-white/90 hover:text-white" : "text-secondary hover:text-white/80 "} text-[18px] font-medium cursor-pointer`}
            >
              <button onClick={() => scrollToNavIdx(index)}>
                {link.title}
              </button>
            </li>
          ))     
          }
        </ul>
        
        <div className='lg:hidden flex flex-1 justify-end items-center'>
          <img
          src = {!toggle ? menu : close}
          alt = "menu"
          className="w-[28px] h-[28px] object-contain cursor-pointer"
          onClick={() => setToggle(!toggle)}
          />
          <div className={`${!toggle ? "hidden" : "flex"} p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px]`}>
            <ul className='list-none flex justify-end items-start flex-col gap-4'>
              {navbarLinks.map((link : NavLink, index : number) => (link.showInNavbar &&
                <li 
                  key={link.id}
                  className={`${surfingNavlinkIndexRef.current == index ? "text-white/90 hover:text-white" : "text-secondary hover:text-white/80 "} font-poppins font-medium cursor-pointer text-[16px]`}
                  onClick={() => {
                    setToggle(false)
                  }}
                >
                  <button onClick={() => scrollToNavIdx(index)}>
                    {link.title}
                  </button>
                </li>
              ))     
              }
            </ul>
          </div>       
        </div>
      </div>
    </nav>
  )
}

export default Navbar