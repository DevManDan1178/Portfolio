import { About, Contact, Experience, Hero, Navbar, Technologies, Projects, StarsCanvas } from "../components";
import { GetPagesExcept } from "../components/Pages";
import { pages } from "../constants/pages/pages";
import { navLinks } from "../constants";
import SEO from "../components/effects/SEO";


export default function MainPage() {
    
    const Pages = GetPagesExcept(pages.main)

    return  (<>
        <SEO title="DevManDan" description="Welcome to my portfolio!"/>
        
        <div className="relative z-0 bg-primary">
            <div className="fixed inset-0 -z-20">
                <StarsCanvas/>
            </div>
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
            <div id={navLinks.contact.id}><Contact/></div>
            <Pages/>
        </div>
    </>)
}