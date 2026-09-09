export type NavLink = {
  id: string,
  title: string,
  showInNavbar : boolean,
}

export const navLinks : Record<string, NavLink> = {
  hero : {
    id : "hero",
    title : "Intro",
    showInNavbar : true,
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
    title: "Stack",
    showInNavbar : true,
  },
  /*
  experience : {
    id: "experience",
    title: "Experience",
    showInNavbar : true,
  },
  
  testimonials : {
    id : "testimonials",
    title : "Testimonials",
    showInNavbar : false,
  },*/
  contact : {
    id: "contact",
    title: "Contact",
    showInNavbar : true,
  },
};