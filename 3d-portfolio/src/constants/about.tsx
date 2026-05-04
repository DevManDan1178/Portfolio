import { useState, type ReactElement } from "react"


export const preTitle : string = "Stuff about me"
export const title : string = "Overview"

export function SubDescription() {
  const [showSmiley, setShowSmiley] = useState(false)

  return <span className="cursor-default text-[20px]"> 
    Hi, I'm <span className="text-purple-200/80">Daniel</span>. 
    I focus on building interactive and engaging experiences that are fun to play and use. <br/>
    I've built several projects ranging from small tools to video games. <br/> 
    I've worked with several <span className="text-teal-200/80  hover:text-teal-200 font-bold"> game engines </span>
    and with <span className="text-blue-200/80 hover:text-blue-200 font-bold"> front-end web development</span>.
    <br/>
    Look around! I hope you enjoy exploring them! <span className="text-yellow-200/90 cursor-pointer hover:text-yellow-100" onClick={() => setShowSmiley(!showSmiley)}>:D</span>
    <br/><br/>
      <span className="text-[22px]">
        <span className={`text-teal-200/90 font-bold`}>Unity, Roblox Studio, Godot </span> <br/>
        <span className="text-blue-200/90 font-bold">React, TailwindCSS, HTML</span> <br/>
        {showSmiley ?<span className="text-white items-center flex justify-center text-[20px]">	
          <button onClick={() => {scrollTo(0, 0), setShowSmiley(false)}} className="border-2 border-white-100/20 rounded-lg">
            &nbsp;⊂(◉‿◉)つ <span className="text-[10px]">Hello! Click this to check out my game.</span> <span className="text-[20px]">↑</span> &nbsp;
          </button>
          </span> : <br/> }
      </span>
    </span>
}

export type Service = {
  title : string,
  icon? : string,
}
