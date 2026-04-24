import { BrowserRouter } from "react-router-dom";
import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Projects, StarsCanvas } from "./components";
import { navLinks } from "./constants";

function App() {
  return (
    <div>

    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar/>
          <div id={navLinks.hero.id}><Hero/></div>
        </div>
        <div id={navLinks.about.id}><About/></div>
        <div id={navLinks.experience.id}><Experience/></div>
        <div id={navLinks.technologies.id}> <Tech/></div>
        <div id={navLinks.projects.id}><Projects/></div>
        <div id={navLinks.feedbacks.id}><Feedbacks/></div>
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
