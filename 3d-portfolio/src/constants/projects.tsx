import { useState, useEffect ,type ReactElement } from "react"
import { echoArena, pendulumSimulator, polygonTD, untitled2DShooter, portfolioSite } from "../assets"

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

export type Tag = {
  name : string,
  color : string,
  subTags : Tag[]
  baseTextSize? : number,
  overrideTagSymbol? : (tagName : string) => ReactElement
}

export type ImageSource = string | "None"

export type BulletPoint = {
  text : string,
  color? : string,
}

export type ProjectDisplay = ({LinkElement} : {LinkElement? : ReactElement}) => ReactElement

export type Project = {
  name : string,
  description: string,
  tags: Tag[],
  display : ProjectDisplay,
  link? : string,
  bulletPoints? : BulletPoint[],
  visuals? : {
    nameColor? : string,
    descriptionColor? : string,
  }
  onClick? : () => void
}

const CategoryTags : Record<string, Tag> = {
  Academic : {
    name : "Academic",
    color : "#e0b7ad",
    subTags : [],
    baseTextSize : 14,
  },
  Playable : {
    name : "Playable",
    color : "#e0f5c6",
    subTags : [],
    baseTextSize : 16,
    overrideTagSymbol : (tagName : string) => <span>{`「${tagName}」`}</span>,
  },
  TeamProject : {
    name : "Team Project",
    color : "#f7b6fc",
    subTags : [],
    baseTextSize : 14,
  }
}


const MiscTags : Record<string, Tag> = {
  GMTKJam2026 : {
    name : "GMTK Game Jam 2026",
    color : "lime-text-gradient",
    subTags : [],
    baseTextSize : 16
  },

}

const BaseTags : Record<string, Tag> = {
  CSharp : {
    name : "C#",
    color : "green-text-gradient",
    subTags : [],
  },

  GDScript : {
    name : "GDScript",
    color : "light-blue-text-gradient",
    subTags : [],
  },
  Luau : {
    name : "Luau",
    color : "dark-blue",
    subTags : [],
  },
  Typescript : {
    name : "Typescript",
    color : "blue-text-gradient",
    subTags : [],
  },
  Javascript : {
    name : "Javascript",
    color : "yellow-text-gradient",
    subTags : [],
  },
  CSS : {
    name : "CSS",
    color : "purple-text-gradient",
    subTags : [],
  },
  GameDev : {
    name : "Game Development",
    color : "orange-text-gradient",
    subTags : [],
  },
  WebDev : {
    name : "Web Development",
    color : "#ffffa8",
    subTags : []
  },
  Java : {
    name : "Java",
    color : "#f8981d",
    subTags : [],
  },
  Git : {
    name : "Git",
    color : "#c7c7c7", 
    subTags : [],
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
    subTags : [BaseTags.Luau, BaseTags.GameDev]
  }
}



export const projects : Project[] = [
  {
    name : "Polygon Tower Defense",
    description : "Small tower defense game with player-customized upgrading and adding of map elements",
    tags : [Tags.Unity, CategoryTags.Playable],
    display : GetImageDisplay(polygonTD, "PolygonTD"),
    link : "https://randomguy1178.itch.io/polygon-tower-defense",
    visuals : {
      nameColor : "yellow-text-gradient",
    },
  },
  {
    name : "Echo Arena",
    description: "Simple arena shooter game where you must also evade your past movements",
    tags : [Tags.Godot, MiscTags.GMTKJam2026, CategoryTags.Playable],
    display : GetImageDisplay(echoArena, "Echo Arena"),
    link : "https://randomguy1178.itch.io/echo-arena",
    visuals : {
      nameColor : "light-red-text-gradient"
    }
  },
  {
    name : "Untitled 2D Shooter",
    description : "Layered multiplayer (2+) horizontal shooter with various abilities, weapons, and cosmetics.",
    tags : [Tags.RobloxStudio, CategoryTags.Playable],
    display : GetImageDisplay(untitled2DShooter, "Untitled 2D Shooter"),
    link : "https://www.roblox.com/games/15434757878/Untitled-2D-Shooter",
    visuals : {
      nameColor : "#caddfc",
    }
  },
  {
    name : "Pendulum Simulator",
    description : "Physics simulator of a simple pendulum",
    tags : [BaseTags.Java, BaseTags.Git, CategoryTags.TeamProject, CategoryTags.Academic],
    display : GetImageDisplay(pendulumSimulator, "Pendulum Simulator"),
    link : "https://github.com/VanierCollege/PendulumSimulator/",
    bulletPoints : [
      {text: "Implemented physics calculations"},
      {text: "Implemented UI for the simulation"},
      {text: "Implemented rendering"}
    ]
  },
  {
    name : "Interactive Portfolio Experience",
    display : WebsiteDisplay, 
    description : "What more can I say? Look around.",
    tags : [Tags.React, Tags.Tailwind]
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

const LINK_TEXT_HIDE_DELAY_DURATION = 2

function WebsiteDisplay() {
  const [linkToggled, setLinkToggled] = useState(false)
  const linkElement = getDefaultLinkElement(() => {
    setLinkToggled(!linkToggled)
  })

  useEffect(() => {
    if (!linkToggled) return;

    const timer = setTimeout(() => {
      setLinkToggled(false);
    }, LINK_TEXT_HIDE_DELAY_DURATION * 1000);

    return () => clearTimeout(timer);
  }, [linkToggled]);


  return (
    <div
      className="w-full h-full relative "
    >
      {GetImageDisplay(portfolioSite, "Yes")({LinkElement : linkElement})}
      {linkToggled &&
        <>
          <h3 className="w-full absolute inset-0 flex items-center justify-center text-center text-[30px] bg-black/50 ">
            You're already here.
          </h3>
          {linkElement}
        </>
      }
    </div>
  )
}

export function getDefaultLinkElement(onClick : () => void) {
  return (    
    <div className='absolute inset-0 flex justify-end m-3 card-img_hover pointer-events-none'>
      <div
        className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer pointer-events-auto'
        onClick={onClick}
      > 
        <h1 className='w-1/2 h-1/2 object-contain'> 🔗 </h1>
      </div>
    </div> 
  )
}