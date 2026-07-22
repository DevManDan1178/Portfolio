import { useState } from "react"


export const preTitle : string = "Something About Me"
export const title : string = "Overview"

export function SubDescription() {
  const [showSmiley, setShowSmiley] = useState(false)

  return <div className="cursor-default text-lg"> 
    I'm a student developer who builds useful applications, interactive experiences and fun games. <br/>
    <br/>
    <p className="text-xl font-bold mb-2">Stuff I build with:</p> 
    <p>Game Dev: <span className="text-teal-100/80 font-semibold"> Unity, Roblox Studio, Godot</span>.</p>
    <p>Web Dev: <span className="text-blue-100/80 font-semibold"> React, Tailwind CSS, Node.js</span>.</p>
    <p>Code: <span className="text-amber-100/80 font-semibold">C#, C++, Typescript, Java, Lua</span> <span className="text-[6px]"> (JAVASCRIPT HATE CLUB) </span></p>
    <br/>
    Check out my projects below! I hope you enjoy exploring! <button className="text-yellow-200/90 cursor-pointer hover:text-yellow-100" onClick={() => setShowSmiley(!showSmiley)}>:D</button>
    <br/><br/>
      <span className="text-[22px]">
        {showSmiley ?<span className="text-white items-center flex justify-center text-[20px]">	
          <button onClick={() => {
              window.scrollTo(0, 0) 
              setShowSmiley(false)
              }
            } 
            className="border-2 border-white-100/20 rounded-lg">
            &nbsp;⊂(◉‿◉)つ <span className="text-[10px]">Hey! My PC has a game on it. Check it out!</span> <span className="text-[20px]">↑</span> &nbsp;
          </button>
          </span> : <br/> }
      </span>
    </div>
}

export type Service = {
  title : string,
  icon? : string,
}
