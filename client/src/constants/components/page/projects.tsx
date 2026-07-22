import { useState, useEffect ,type ReactElement } from "react"
import { echoArena, pendulumSimulator, polygonTD, untitled2DShooter, portfolioSite, github, roblox, itchIO, typingPracticeAssignment, sidestep2 } from "../../../assets"
import { type Tag, BaseTags, MiscTags, CategoryTags, Tags } from "../../tags"
import { InvertingDisplay, type HoverMode } from "../../../components/effects/VisualEffects"

export const PROJECTS_TITLE_TEXT_SIZE = 24


export const SUBTAG_TEXT_SIZE_REDUCTION_BY_LAYER = 1.5

export const defaultTagSymbol = (tagName : string) => `‹${tagName}›`

export const preTitle : string = "Stuff I Made"
export const title : string = "Projects"
export const subDescription : string = "Some of my best work."


export const projects : Record<string, Project> = {
  polygonTD :{
    name : "Polygon Tower Defense",
    description : "Small tower defense game with player-customized upgrading and addition of map elements",
    tags : [Tags.Unity, BaseTags.MusicComposition, GetPlayableTag("/PolygonTD")],
    display : GetImageDisplay(polygonTD, "PolygonTD"),
    links : {
      mainLink: {
        url: "/PolygonTD",
        linkIcon : "▶",
        iconIsStr : true
      },
      allLinks: [{
          url: "/PolygonTD",
          linkIcon : "▶",
          iconIsStr : true
        },
        {
          url: "https://github.com/DevManDan1178/PolygonTD",
          linkIcon: github
        },
        {
          url: "https://devman-dan.itch.io/polygon-tower-defense",
          linkIcon : itchIO
        },
      ]
    },
    visuals : {
      nameColor : "yellow-text-gradient",
    },
    featured : true
  },
  echoArena :{
    name : "Echo Arena",
    description: "Simple arena shooter game where you must also evade your past movements",
    tags : [Tags.Godot, MiscTags.GMTKJam2026, GetPlayableTag("/EchoArena", "Click to Play ‹PC›")],
    display : GetImageDisplay(echoArena, "Echo Arena"),
    links : {
      mainLink : {
        url: "/EchoArena",
        linkIcon : "▶",
        iconIsStr : true
      },
      allLinks : [{
          url: "/EchoArena",
          linkIcon : "▶",
          iconIsStr : true
        },
        {
          url: "https://github.com/DevManDan1178/Echo-Arena",
          linkIcon : github
        },
        {
          url: "https://devman-dan.itch.io/echo-arena",
          linkIcon : itchIO
        },
      ]
    },
    visuals : {
      nameColor : "light-red-text-gradient"
    }
  },
  sidestep2 : {
    name : "Sidestep²",
    description : "Small bullet hell game.",
    tags : [Tags.Unity, BaseTags.MusicComposition, GetPlayableTag("/Sidestep2", "Click to Play ‹PC›")],
    display : GetImageDisplay(sidestep2, "Sidestep²"),
    links : {
      mainLink : {
          url : "/sidestep2",
          linkIcon : "▶",
          iconIsStr : true
      },
      allLinks:[{
          url : "/sidestep2",
          linkIcon : "▶",
          iconIsStr : true
        },
        {
          url: "https://github.com/DevManDan1178/Sidestep2",
          linkIcon: github
        },
        {
          url : "https://devman-dan.itch.io/sidestep",
          linkIcon : itchIO,
        },
      ]
    },
    visuals: {
      nameColor: "#f6ffe0"
    }
  },
  untitled2DShooter : {
    name : "Untitled 2D Shooter",
    description : "Layered multiplayer (2+) horizontal shooter with various abilities, weapons, and cosmetics.",
    tags : [Tags.RobloxStudio],
    display : GetImageDisplay(untitled2DShooter, "Untitled 2D Shooter"),
    links : {
      mainLink:{
        url: "https://www.roblox.com/games/15434757878/Untitled-2D-Shooter",
        linkIcon : roblox
      },
      allLinks: [{
        url: "https://www.roblox.com/games/15434757878/Untitled-2D-Shooter",
        linkIcon : roblox
    }]},
    visuals : {
      nameColor : "#e0ebff",
    },
    featured : true,
  },
  portfolioSite : {
    name : "Interactive Portfolio Experience",
    display : GetImageDisplay(portfolioSite, "Interactive Portfolio Experience"),
    links: {
      mainLink: {
        url: "https://github.com/DevManDan1178/Portfolio",
        linkIcon: github
      },
      allLinks: [
        {
          url: "https://github.com/DevManDan1178/Portfolio",
          linkIcon: github
        }
      ],
    },
    description : "What more can I say? Look around.",
    featured : true,
    tags : [Tags.React, Tags.Tailwind, BaseTags.ThreeJS, BaseTags.Git],
    visuals: {
      nameColor: "#e8e0ff"
    }
  },
  pendulumSimulator : {
    name : "Pendulum Simulator",
    description : "Physics simulator of a simple pendulum",
    tags : [BaseTags.Java, BaseTags.Git, CategoryTags.TeamProject, CategoryTags.Academic],
    display : GetImageDisplay(pendulumSimulator, "Pendulum Simulator"),
    links : {
      mainLink : {
        url: "https://github.com/VanierCollege/PendulumSimulator/",
        linkIcon : github
    },
      allLinks: [{
        url: "https://github.com/VanierCollege/PendulumSimulator/",
        linkIcon : github
      },
    ]},
    bulletPoints : [
      {text: "Implemented physics calculations"},
      {text: "Implemented UI for the simulation"},
      {text: "Implemented rendering"}
    ],
    visuals: {
      nameColor: "#e6fcea"
    }
  },
  typingTutor : {
    name : "Typing Tutor App",
    description : "Small typing tutor app made in JavaFX.",
    tags : [BaseTags.Java, BaseTags.Git, CategoryTags.Academic],
    display : GetImageDisplay(typingPracticeAssignment, "Typing Practice"),
    links : {
      mainLink : {
        url : "https://github.com/DevManDan1178/TypingPractice",
        linkIcon : github,
    },
      allLinks :[{
        url : "https://github.com/DevManDan1178/TypingPractice",
        linkIcon : github,
    }]},
    visuals : {
      nameColor : "#fcefe6"
    }
  }
};


function GetImageDisplay(image : string, name : string) : ProjectDisplay {
  return ({LinkElements}) => {
    return <div className="group"><img
      src={image}
      alt={name}
      className='peer items-end justify-end flex opacity-70 group-hover/image:opacity-90 w-full h-full object-cover rounded-2xl brightness-75 group-hover/image:brightness-100 transition-[filter] duration-300 ease-in-out'   
    />
      <div className="absolute inset-0 flex justify-end gap-0">
        {LinkElements}
      </div>
    </div>
  }
}

function GetPlayableTag(routePath : string, tagName : string = "Click to Play") : Tag {
  
    const overrideTagSymbol = (tagName : string) => (<span> <br/>
      <span 
      className="bg-black/25  hover:bg-white/25 rounded-xl cursor-pointer"
      onClick={() => {window.open(routePath, '_blank')}}
      >
        {`「${tagName}」`}
      </span>
    </span>)
    
    return {
    name : tagName,
    color : "#e0f5c6",
    baseTextSizeModifier : 4,
    overrideTagSymbol : overrideTagSymbol
  }
}

export function getDefaultLinkElement(link? : Link, hoverMode? : HoverMode) {
  return getLinkElement(() => window.open(link?.url, "_blank"), link, hoverMode)
}

function getLinkElement(onClick : () => void, link? : Link, hoverMode? : HoverMode) {
  const linkIcon = link?.linkIcon
  return (
    <div className='relative inset-0 flex justify-end m-3 card-img_hover pointer-events-none z-10' key={"LinkElement-" + (link?.url ?? ".") }>
      <div
        className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer pointer-events-auto flex-col group'
        onClick={onClick}
      > 
        <div className="relative w-10 h-10 flex items-center justify-center inset-0 rounded-full overflow-hidden">
            {linkIcon && !link.iconIsStr ? (
              <img
                className="w-3/5 h-3/5 object-contain absolute"
                src={linkIcon} 
              />
              )  : (
              <h1 className="flex items-center justify-center w-3/5 h-3/5 text-center absolute">
                {linkIcon ?? "🔗"}  
              </h1>
            )}

            {InvertingDisplay(0.75, hoverMode)}
        </div>
      </div> 
    </div> 
  )
}



export type ImageSource = string | "None"

export type BulletPoint = {
  text : string,
  color? : string,
}

export type ProjectDisplay = ({LinkElements} : {LinkElements? : ReactElement[]}) => ReactElement

export type Link = {
  url : string,
  linkIcon? : string,
  iconIsStr? : boolean
}

export type Project = {
  name : string,
  description: string,
  tags: Tag[],
  display : ProjectDisplay,
  featured? : boolean,
  links? : {
    allLinks : Link[],
    mainLink : Link
  },
  bulletPoints? : BulletPoint[],
  visuals? : {
    nameColor? : string,
    descriptionColor? : string,
  }
}