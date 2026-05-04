import { useState, useEffect ,type ReactElement } from "react"
import { echoArena, pendulumSimulator, polygonTD, untitled2DShooter, portfolioSite, github, roblox, itchIO, typingPracticeAssignment } from "../assets"

export const PROJECTS_TITLE_TEXT_SIZE = 24
export const PROJECTS_DESCRIPTION_TEXT_SIZE = 20
export const PROJECTS_BULLET_POINTS_TEXT_SIZE = 14

export const SUBTAG_TEXT_SIZE_REDUCTION_BY_LAYER = 3
export const BASE_TAG_SIZE = 20
export const MINIMUM_SUBTAG_TEXT_SIZE = 14

export const defaultTagSymbol = (tagName : string) => `‹${tagName}›`

export const preTitle : string = "Stuff I Made"
export const title : string = "Projects"
export const subDescription : string = "Making stuff is fun when you make fun stuff."

const CategoryTags : Record<string, Tag> = {
  Academic : {
    name : "Academic",
    color : "#fff1c9",
    baseTextSize : 16,
  },
  TeamProject : {
    name : "Team Project",
    color : "#f7b6fc",
    baseTextSize : 14,
  }
}

const LolTags : Record<string, Tag> = {
  FLStudioFree : {
    name : "FL Studio free version lol",
    color : "#ffaf69",
    baseTextSize : 10
  }
}

const MiscTags : Record<string, Tag> = {
  GMTKJam2026 : {
    name : "GMTK Game Jam 2026",
    color : "lime-text-gradient",
    baseTextSize : 16
  },
}

const BaseTags : Record<string, Tag> = {
  CSharp : {
    name : "C#",
    color : "green-text-gradient",
  },

  GDScript : {
    name : "GDScript",
    color : "light-blue-text-gradient",
  },
  Lua : {
    name : "Lua",
    color : "dark-blue",
  },
  Typescript : {
    name : "Typescript",
    color : "blue-text-gradient",
  },
  Javascript : {
    name : "Javascript",
    color : "yellow-text-gradient",
  },
  CSS : {
    name : "CSS",
    color : "purple-text-gradient",
  },
  GameDev : {
    name : "Game Development",
    color : "orange-text-gradient",
  },
  WebDev : {
    name : "Web Development",
    color : "#ffffa8",
  },
  Java : {
    name : "Java",
    color : "#f8981d",
  },
  Git : {
    name : "Git",
    color : "#c7c7c7", 
  },
  MusicComposition : {
    name : "♫ Composition",
    color : "#d096ff",
    baseTextSize : 14,
    subTags : [LolTags.FLStudioFree]
  }
}

const Tags : Record<string, Tag> = {
  React : {
    name: "React",
    color: "light-blue-text-gradient",
    subTags : [BaseTags.Javascript, BaseTags.Typescript, BaseTags.WebDev],
  },
  Tailwind : {
    name: "tailwind",
    color: "pink-text-gradient",
    subTags : [BaseTags.CSS],
  },
  Unity : {
    name : "Unity",
    color : "grey-text-gradient",
    subTags : [BaseTags.CSharp, BaseTags.GameDev],
  },
  Godot : {
    name : "Godot",
    color : "light-blue-text-gradient",
    subTags : [BaseTags.GDScript, BaseTags.GameDev],
  },
  RobloxStudio : {
    name : "Roblox Studio",
    color : "blue-text-gradient",
    subTags : [BaseTags.Lua, BaseTags.GameDev]
  }
}



export const projects : Project[] = [
  {
    name : "Polygon Tower Defense",
    description : "Small tower defense game with player-customized upgrading and adding of map elements",
    tags : [Tags.Unity, BaseTags.MusicComposition, GetPlayableTag("/PolygonTD")],
    display : GetImageDisplay(polygonTD, "PolygonTD"),
    link : {
      url: "https://devman-dan.itch.io/polygon-tower-defense",
      linkImage : itchIO
    },
    visuals : {
      nameColor : "yellow-text-gradient",
    },
  },
  {
    name : "Echo Arena",
    description: "Simple arena shooter game where you must also evade your past movements",
    tags : [Tags.Godot, MiscTags.GMTKJam2026, GetPlayableTag("/EchoArena", "Click to Play ‹PC›")],
    display : GetImageDisplay(echoArena, "Echo Arena"),
    link : {
      url: "https://devman-dan.itch.io/echo-arena",
      linkImage : itchIO
    },
    visuals : {
      nameColor : "light-red-text-gradient"
    }
  },
  {
    name : "Untitled 2D Shooter",
    description : "Layered multiplayer (2+) horizontal shooter with various abilities, weapons, and cosmetics.",
    tags : [Tags.RobloxStudio],
    display : GetImageDisplay(untitled2DShooter, "Untitled 2D Shooter"),
    link : {
      url: "https://www.roblox.com/games/15434757878/Untitled-2D-Shooter",
      linkImage : roblox
    },
    visuals : {
      nameColor : "#caddfc",
    }
  },
  {
    name : "Interactive Portfolio Experience",
    display : WebsiteDisplay, 
    description : "What more can I say? Look around.",
    tags : [Tags.React, Tags.Tailwind]
  },
  {
    name : "Pendulum Simulator",
    description : "Physics simulator of a simple pendulum",
    tags : [BaseTags.Java, BaseTags.Git, CategoryTags.TeamProject, CategoryTags.Academic],
    display : GetImageDisplay(pendulumSimulator, "Pendulum Simulator"),
    link : {
      url: "https://github.com/VanierCollege/PendulumSimulator/",
      linkImage : github
    },
    bulletPoints : [
      {text: "Implemented physics calculations"},
      {text: "Implemented UI for the simulation"},
      {text: "Implemented rendering"}
    ]
  },
  {
    name : "Typing Practice App",
    description : "Small typing practice app made in JavaFX.",
    tags : [BaseTags.Java, BaseTags.Git, CategoryTags.Academic],
    display : GetImageDisplay(typingPracticeAssignment, "Typing Practice"),
    link : {
      url : "https://github.com/DevManDan1178/TypingPractice",
      linkImage : github,
    },
  }
];


function GetImageDisplay(image : string, name : string) : ProjectDisplay {
  return ({LinkElement}) => {
    return <><img
      src={image}
      alt={name}
      className='w-full h-full object-cover rounded-2xl brightness-[75%] group-hover:brightness-[100%] transition-[filter] duration-300 ease-in-out'   
    />
      {LinkElement}
    </>
  }
}

function GetPlayableTag(routePath : string, tagName? : string) : Tag {
  
    const overrideTagSymbol = (tagName : string) => (<span> <br/>
      <span 
      className="bg-black/25  hover:bg-white/25 rounded-xl cursor-pointer"
      onClick={() => {window.open(routePath, '_blank')}}
      >
        {`「${tagName}」`}
      </span>
    </span>)
    
    return {
    name : tagName ?? "Click To Play",
    color : "#e0f5c6",
    baseTextSize : 16,
    overrideTagSymbol : overrideTagSymbol
  }
}

const LINK_TEXT_HIDE_DELAY_DURATION = 2.5
const LINK_PRESS_DISABLE_DURATION = 0.5


function WebsiteDisplay() {
  const [linkPressCount, setLinkPressCount] = useState<number>(0)
  const [linkPressDisabled, setLinkPressDisabled] = useState<boolean>(false)
  
  const linkPressTexts = [
    "You're already here.",
    "You're already here!",
  ]
  const onLinkClicked = () => {
    if (linkPressDisabled || linkPressCount > linkPressTexts.length) {
      return
    }
    if (linkPressCount == linkPressTexts.length) {
      window.open("/SecretRealPortfolio", '_blank')
    }
    setLinkPressCount((value) => value + 1)
    setLinkPressDisabled(true)
  }

  const linkElement = getDefaultLinkElement(onLinkClicked)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLinkPressDisabled(false)
    }, LINK_PRESS_DISABLE_DURATION * 1000)
  }, [linkPressDisabled])
  
  useEffect(() => {
    if (linkPressCount == 0) return;

    const timer = setTimeout(() => {
      setLinkPressCount(0)
    }, LINK_TEXT_HIDE_DELAY_DURATION * 1000);

    return () => clearTimeout(timer);
  }, [linkPressCount]);


  return (
    <div
      className="w-full h-full relative "
    >
      {GetImageDisplay(portfolioSite, "Yes")({LinkElement : linkElement})}
      {linkPressCount > 0 &&
        <>
          <h3 className="w-full absolute inset-0 flex items-center justify-center text-center text-[30px] bg-black/50 ">
            {linkPressTexts[Math.min(linkPressCount, linkPressTexts.length) - 1]}
          </h3>
          {linkElement}
        </>
      }
    </div>
  )
}

export function getDefaultLinkElement(onClick : () => void, linkImage? : string) {
  return (    
    <div className='absolute inset-0 flex justify-end m-3 card-img_hover pointer-events-none '>
      <div
        className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer pointer-events-auto'
        onClick={onClick}
      > 
        <div className="flex items-center justify-center transition-transform duration-200 hover:scale-125">
          {linkImage ? (
            <img
              className="w-3/5 h-3/5 object-contain"
              src={linkImage}
            />
          ) : (
            <h1 className="flex items-center justify-center w-3/5 h-3/5 text-center">
              🔗
            </h1>
          )}
        </div>
      </div> 
    </div> 
  )
}


export type Tag = {
  name : string,
  color : string,
  subTags? : Tag[]
  baseTextSize? : number,
  overrideTagSymbol? : (tagName : string) => ReactElement,
}

export type ImageSource = string | "None"

export type BulletPoint = {
  text : string,
  color? : string,
}

export type ProjectDisplay = ({LinkElement} : {LinkElement? : ReactElement}) => ReactElement
export type Link = {
  url : string,
  linkImage? : string
}

export type Project = {
  name : string,
  description: string,
  tags: Tag[],
  display : ProjectDisplay,
  link? : Link,
  bulletPoints? : BulletPoint[],
  visuals? : {
    nameColor? : string,
    descriptionColor? : string,
  }
}