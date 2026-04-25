import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { styles } from '../style'
import { logo, menu, close } from '../assets'
import { navLinks, type NavLink } from '../constants'

const SURFING_THRESHOLD : number = .75;

const Navbar = () => {
  const [toggle, setToggle] = useState<boolean>(false)
  const navbarLinks : NavLink[] = Object.values(navLinks).filter((navLink : NavLink) => (navLink.showInNavbar))
  const [surfingNavlinkIndices, setSurfingNavlinkIndices] = useState<boolean[]>(Array(navbarLinks.length).fill(false));
  
  
  useEffect(() => {
    const updateActive = () => {
    const vh = window.innerHeight;
    const center = vh / 2;

    let closestIndex = -1;
    let closestDistance = Infinity;

    navbarLinks.forEach((link, i) => {
      const el = document.getElementById(link.id);
      if (!el) return;

      const rect = el.getBoundingClientRect();

      // distance from center of screen
      const elementCenter = rect.top + rect.height / 2;
      const distance = Math.abs(center - elementCenter);

      // fallback for bottom section (important fix)
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 2;

      if (isAtBottom && i === navbarLinks.length - 1) {
        closestIndex = i;
        return;
      }

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    const newState = Array(navbarLinks.length).fill(false);
    if (closestIndex !== -1) {
      newState[closestIndex] = true;
    }

    setSurfingNavlinkIndices(newState);
  };

  window.addEventListener("scroll", updateActive);
  window.addEventListener("resize", updateActive);

  updateActive(); // run once on load

  return () => {
    window.removeEventListener("scroll", updateActive);
    window.removeEventListener("resize", updateActive);
  };
}, [navbarLinks]);

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-primary`}> 
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          to="/" 
          className='flex items-center gap-2'
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <img 
          src= {logo} 
          alt="logo"
          className="w-9 h-9 object-contain"
          />
          <p className='text-white text-[18px] font-bold cursor-pointer flex'> 
            DevManDan
          </p>

        </Link>
        <ul className='lg:flex list-none hidden flex:row gap-10'>
          {navbarLinks.map((link : NavLink, index : number) => (
            <li 
              key={link.id}
              className={`${surfingNavlinkIndices[index] ? "text-white" : "text-secondary"} hover:text-white text-[18px] font-medium cursor-pointer`}
            >
              <a href={`#${link.id}`}>
                {link.title}
              </a>
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
              {navbarLinks.map((link : NavLink) => (
                <li 
                  key={link.id}
                  className={`text-secondary font-poppins font-medium cursor-pointer text-[16px]`}
                  onClick={() => {
                    setToggle(false)
                  }}
                >
                  <a href={`#${link.id}`}>
                    {link.title}
                  </a>
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