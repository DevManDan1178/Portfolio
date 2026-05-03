import type { ReactElement } from "react";
import { javascript, typescript, html, reactjs, tailwind, nodejs, git, threejs, } from "../assets";

export type Technology = {
  name : string,
  icon : string,
}

export const preTitle : string = "Stuff I know"
export const title : string = "Tech Stack" //"\u00A0" is an invisible character
export const subDescription : ReactElement = <span>
  <span className="text-[25px] text-red-200/80"> Oops. My tech stack collapsed...  <br/> </span>
  The printed icons on my tech stack elements are 
  <span className="text-blue-200"> super duper heavy </span> 
  magnets. <br/>
  Flip <span className="text-yellow-200/90"> two same icons </span> at once and they will
  <span className="text-green-100/85"> resonate and stabilize</span>.
  <br/> <br/> <br/> <br/>
  <span className="text-lime-100/80 text-[25px] text-center w-full flex items-center justify-center"> Match 2? </span>
</span>

export const solvedSubDescription : ReactElement = <span className="text-lime-100/80 text-[25px]"> AWESOME!:D <br/> <br/> <br/> <br/> <br/></span>
export const abortedSubDescription : ReactElement = <span> 
  <span className="text-[25px] text-green-100/80"> Here it is!
    <br/> <br/> <br/> <br/> <br/> 
    <span className="text-lime-100/80 text-[25px] text-center w-full flex items-center justify-center">  </span>
  </span>
</span>
export const solvedtitle : string = "Tech Stack"
export const abortingButtonText : ReactElement = <span className="text-lime-100/80 text-[25px] text-center w-full flex items-center justify-center"> Use a big magnet </span>
export const abortedButtonText : string = "It (kinda?) worked"
export const solvedButtonText : string = "Discombobulate the stack"

export const technologies : Technology[] = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },

];
