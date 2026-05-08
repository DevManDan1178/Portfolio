
import { projects } from "../../constants";
import SEO from "../../components/effects/SEO";
import { pages } from "../../constants/pages/pages";
import { GetPagesExcept, } from "../../components/Pages";
import { ProjectCard } from "../../components/Projects";


export default function ProjectsPage() {
    const Pages = GetPagesExcept(pages.projects, false)
    const projectList = Object.values(projects)
    return (<>
        <SEO title="Projects" description="A list of my projects."/>
        <div className="min-h-screen w-full flex flex-col items-center px-6 py-16 text-white ">
            <h1 className="text-4xl font-bold mb-4">Projects</h1>

            <p className="text-white/70 mb-10 text-center max-w-xl">
                A collection of my projects
            </p>
            
            <div className='flex flex-wrap gap-16 items-start justify-center w-[75%]'>
                {projectList.map((project, index) => (
                <div key={`project-${index}`}>
                    <ProjectCard project={project}/>
                </div>
                ))
            }
            </div>
        </div>
        <Pages/>
    </>)
}