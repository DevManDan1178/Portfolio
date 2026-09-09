import type { ReactElement } from "react";
import { javascript, typescript, html, reactjs, tailwind, nodejs, git, threejs, unity, godot, cSharp, lua, robloxStudio, java, vsCode, cMake, cpp, dotnet, css, } from "../../../assets";

export type Technology = {
  name : string,
  icon : string,
}

export const preTitle : string = "Stuff I Use"
export const title : string = "Tech Stack" //"\u00A0" is an invisible character
export const subDescription : string = "Development tools I use to build interactive applications."
export const abortingButtonText : ReactElement = <span className="text-lime-100/80 text-center w-full flex items-center justify-center"> Reveal </span>
export const abortedButtonText : string = "Play"
export const solvedButtonText : string = "Play Again!"

export const techStack: Record<string, Technology[]> = {
  "Front-end Web Development": [
    { name: "HTML", icon: html }, 
    { name: "CSS", icon: css },
    { name: "React", icon: reactjs },
    { name: "Three JS", icon: threejs },
  ],
  
  "Game Development": [
    { name: "Unity", icon: unity },
    { name: "Godot", icon: godot },
    { name: "Roblox Studio", icon: robloxStudio },
  ],

  "Runtimes & Frameworks": [
    { name: ".NET", icon: dotnet },
    { name: "Node JS", icon: nodejs },
    { name: "Tailwind CSS", icon: tailwind },
  ],

  "Programming Languages": [
    { name: "C++", icon: cpp },
    { name: "C#", icon: cSharp },
    { name: "TypeScript", icon: typescript },
    { name: "Java", icon: java },
    { name: "Lua", icon: lua },
    { name: "JavaScript", icon: javascript },
  ],

  Tools: [
    { name: "VS Code", icon: vsCode },
    { name: "Git", icon: git },
    { name: "CMake", icon: cMake },
  ],
}

export const technologies : Technology[] = Object.values(techStack).flat()
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