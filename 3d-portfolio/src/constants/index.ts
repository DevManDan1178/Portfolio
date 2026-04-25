import { experiences } from "./experiences";
import { services } from "./services";
import { projects } from "./projects";
import { testimonials } from "./testimonials";
import { technologies } from "./technologies";

export type NavLink = {
  id: string,
  title: string,
  showInNavbar : boolean,
}

export const navLinks : Record<string, NavLink> = {
  hero : {
    id : "hero",
    title : "Hero",
    showInNavbar : false,
  },
  about : {
    id: "about",
    title: "About",
    showInNavbar : true,
  },
  projects : {
    id: "projects",
    title: "Projects",
    showInNavbar : true,
  },
  technologies : {
    id : "technologies",
    title: "Tech",
    showInNavbar : true,
  },
  experience : {
    id: "experience",
    title: "Experience",
    showInNavbar : true,
  },
  testimonials : {
    id : "testimonials",
    title : "Testimonials",
    showInNavbar : true,
  },
  contact : {
    id: "contact",
    title: "Contact",
    showInNavbar : true,
  },
};

export { services, technologies, experiences, testimonials, projects };