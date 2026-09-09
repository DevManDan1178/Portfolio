import { About, Contact, Experience, Hero, Navbar, Technologies, Projects, StarsCanvas } from "../components";
import { GetPagesExcept } from "../components/page/Pages";
import { pages } from "../constants/pages/pages";
import { navLinks } from "../constants";
import SEO from "../components/misc/SEO";


export default function PortfolioPage() {
    
    const Pages = GetPagesExcept(pages.portfolio)

    return  (<>
        <SEO title="DevManDan" description="Portfolio of DevManDan, aspiring game and software developper. Game development and software engineering projects, with playable games in browser."/>
        
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
            {/*<div id={navLinks.experience.id}><Experience/></div>*/}
            <div id={navLinks.contact.id}><Contact/></div>
            {Pages()}
        </div>
    </>)
}