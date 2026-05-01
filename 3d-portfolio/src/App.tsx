import { BrowserRouter } from "react-router-dom";
import { About, Contact, Experience, Testimonials, Hero, Navbar, Technologies, Projects, StarsCanvas } from "./components";
import { useEffect } from "react";
import { navLinks } from "./constants";

function App() {
  useEffect(() => {
  const handleHashChange = () => {
    // remove hash without reloading or scrolling
    history.replaceState(null, "", window.location.pathname + window.location.search);
  };

  window.addEventListener("hashchange", handleHashChange);

  return () => {
    window.removeEventListener("hashchange", handleHashChange);
  };
}, []);
  return (
    <div>
      <BrowserRouter> 
        <div className="relative z-0 bg-primary">
          <Navbar/>
          <div 
          className="bg-hero-pattern bg-cover bg-no-repeat bg-center"
          id={navLinks.hero.id}
          >
            <Hero/>
          </div>
          <div id={navLinks.about.id}><About/></div>
          <div id={navLinks.projects.id}><Projects/></div>
          <div id={navLinks.technologies.id}> <Technologies/></div>
          <div id={navLinks.experience.id}><Experience/></div>  
          <div id={navLinks.testimonials.id}><Testimonials/></div>
          <div className="relative z-0">
            <Contact/>
            <StarsCanvas/>
          </div>
        </div>
      </BrowserRouter>
    </div>    
  )
    
}

export default App;
