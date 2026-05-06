import type { ReactElement } from "react";
import { javascript, typescript, html, reactjs, tailwind, nodejs, git, threejs, unity, godot, cSharp, lua, robloxStudio, java, vsCode, } from "../assets";

export type TechnologyCategory = "Game Development" | "Programming Languages" | "Web Development" | "Tools"

export type Technology = {
  name : string,
  icon : string,
  category : TechnologyCategory
}

export const preTitle : string = "Stuff I Use"
export const title : string = "Tech Stack" //"\u00A0" is an invisible character
export const subDescription : string = "Development tools I use to build interactive applications."
export const solvedtitle : string = "Tech Stack"
export const abortingButtonText : ReactElement = <span className="text-lime-100/80 text-[25px] text-center w-full flex items-center justify-center"> Reveal </span>
export const abortedButtonText : string = "Play"
export const solvedButtonText : string = "Play Again!"

export const technologies : Technology[] = [
  {
    name: "HTML 5",
    icon: html,
    category : "Web Development"
  },
  {
    name: "React JS",
    icon: reactjs,
    category : "Web Development"
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
    category : "Web Development"
  },
  {
    name: "Node JS",
    icon: nodejs,
    category : "Web Development"
  },
  {
    name: "Three JS",
    icon: threejs,
    category : "Web Development"
  },

  {
    name : "Unity",
    icon: unity,
    category : "Game Development"
  },
  {
    name : "Godot",
    icon: godot,
    category : "Game Development"
  },
  {
    name : "Roblox Studio",
    icon : robloxStudio,
    category : "Game Development"
  },
  {
    name : "Java",
    icon : java,
    category : "Programming Languages"
  },
    {
    name: "JavaScript",
    icon: javascript,
    category : "Programming Languages"
  },
  {
    name: "TypeScript",
    icon: typescript,
    category : "Programming Languages"
  },
  {
    name : "C#",
    icon : cSharp,
    category : "Programming Languages"
  },
  {
    name : "Lua",
    icon : lua,
    category : "Programming Languages"
  },
  {
    name : "VS Code",
    icon : vsCode,
    category : "Tools"
  },
  {
    name: "Git",
    icon: git,
    category : "Tools"
  },

];

/*
export const subDescription : ReactElement = <span>
  <span className="text-[25px] text-red-200/80"> Oops. My tech stack collapsed...  <br/> </span>
  The printed icons on my tech stack elements are 
  <span className="text-blue-200"> super duper heavy </span> 
  magnets. <br/>
  Flip <span className="text-yellow-200/90"> two same icons </span> at once and they will
  <span className="text-green-100/85"> resonate and stabilize</span>.
  <br/> <br/> <br/> <br/>
</span>

export const solvedSubDescription : ReactElement = <span className="text-lime-100/80 text-[25px]"> AWESOME! :D <br/> <br/> <br/> <br/> <br/></span>
export const abortedSubDescription : ReactElement = <span> 
  <span className="text-[25px] text-green-100/80"> Here it is!
    <br/> <br/> <br/> <br/> <br/> 
    <span className="text-lime-100/80 text-[25px] text-center w-full flex items-center justify-center">  </span>
  </span>
</span>*/