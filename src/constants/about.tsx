import { useState } from "react"


export const preTitle : string = "Something About Me"
export const title : string = "Overview"

export function SubDescription() {
  const [showSmiley, setShowSmiley] = useState(false)

  return <span className="cursor-default"> 
    I'm a student developer focused on building interactive experiences, especially games. <br/>
    I work with game engines like <span className="text-teal-100/80 font-semibold">Unity, Roblox Studio, and Godot</span>, and I also do front-end web development with <span className="text-blue-100/80 font-semibold">React, TailwindCSS, and HTML</span>. <br/>
    I enjoy building projects from scratch and experimenting with different ideas. <br/>
    <br/>
    Look around! I hope you enjoy exploring! <span className="text-yellow-200/90 cursor-pointer hover:text-yellow-100" onClick={() => setShowSmiley(!showSmiley)}>:D</span>
    <br/><br/>
      <span className="text-[22px]">
        {showSmiley ?<span className="text-white items-center flex justify-center text-[20px]">	
          <button onClick={() => {scrollTo(0, 0), setShowSmiley(false)}} className="border-2 border-white-100/20 rounded-lg">
            &nbsp;⊂(◉‿◉)つ <span className="text-[10px]">Hello! Click this to play my game.</span> <span className="text-[20px]">↑</span> &nbsp;
          </button>
          </span> : <br/> }
      </span>
    </span>
}

export type Service = {
  title : string,
  icon? : string,
}
