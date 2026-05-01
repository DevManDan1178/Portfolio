import { About, Contact, Experience, Testimonials, Hero, Navbar, Technologies, Projects, StarsCanvas } from "../components";
import { navLinks } from "../constants";


export default function MainPage() {

    return  (
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
    )
}