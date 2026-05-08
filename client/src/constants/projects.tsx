import { useState, useEffect ,type ReactElement } from "react"
import { echoArena, pendulumSimulator, polygonTD, untitled2DShooter, portfolioSite, github, roblox, itchIO, typingPracticeAssignment, sidestep2 } from "../assets"
import { type Tag, BaseTags, MiscTags, CategoryTags, Tags } from "./tags"
import { InvertingDisplay } from "../components/effects/VisualEffects"

export const PROJECTS_TITLE_TEXT_SIZE = 24


export const SUBTAG_TEXT_SIZE_REDUCTION_BY_LAYER = 1.5

export const defaultTagSymbol = (tagName : string) => `‹${tagName}›`

export const preTitle : string = "Stuff I Made"
export const title : string = "Projects"
export const subDescription : string = "Some of my best work."


export const projects : Record<string, Project> = {
  polygonTD :{
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
    featured : true
  },
  echoArena :{
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
  sidestep2 : {
    name : "Sidestep²",
    description : "Small bullet hell game.",
    tags : [Tags.Unity, BaseTags.MusicComposition, GetPlayableTag("/Sidestep2", "Click to Play ‹PC›")],
    display : GetImageDisplay(sidestep2, "Sidestep²"),
    link : {
      url : "https://devman-dan.itch.io/sidestep",
      linkImage : itchIO,
    },
  },
  untitled2DShooter : {
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
    },
    featured : true,
  },
  portfolioSite : {
    name : "Interactive Portfolio Experience",
    display : WebsiteDisplay, 
    description : "What more can I say? Look around.",
    featured : true,
    tags : [Tags.React, Tags.Tailwind, BaseTags.ThreeJS, BaseTags.Git]
  },
  pendulumSimulator : {
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
  typingTutor : {
    name : "Typing Tutor App",
    description : "Small typing tutor app made in JavaFX.",
    tags : [BaseTags.Java, BaseTags.Git, CategoryTags.Academic],
    display : GetImageDisplay(typingPracticeAssignment, "Typing Practice"),
    link : {
      url : "https://github.com/DevManDan1178/TypingPractice",
      linkImage : github,
    },
  }
};


function GetImageDisplay(image : string, name : string) : ProjectDisplay {
  return ({LinkElement}) => {
    return <><img
      src={image}
      alt={name}
      className='opacity-70 group-hover:opacity-90 w-full h-full object-cover rounded-2xl brightness-[75%] group-hover:brightness-[100%] transition-[filter] duration-300 ease-in-out'   
    />
      {LinkElement}
    </>
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

const LINK_TEXT_HIDE_DELAY_DURATION = 2.5
const LINK_PRESS_DISABLE_DURATION = 0.75


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

  const linkElement = getLinkElement(onLinkClicked)
  useEffect(() => {
    setTimeout(() => {
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
      {GetImageDisplay(portfolioSite, "Portfolio Site")({LinkElement : linkElement})}
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

export function getDefaultLinkElement(linkUrl : string, linkImage? : string) {
  return getLinkElement(() => window.open(linkUrl, "_blank"), linkImage) 
}

function getLinkElement(onClick : () => void, linkImage? : string) {
  return (
        
    <div className='absolute inset-0 flex justify-end m-3 card-img_hover pointer-events-none '>
      <div
        className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer pointer-events-auto flex-col group'
        onClick={onClick}
      > 
        <div className="relative w-10 h-10 flex items-center justify-center inset-0 rounded-full overflow-hidden">
            {linkImage ? (
              <img
                className="w-3/5 h-3/5 object-contain absolute"
                src={linkImage} 
              />
              )  : (
              <h1 className="flex items-center justify-center w-3/5 h-3/5 text-center absolute">
                🔗
              </h1>
            )}

            {InvertingDisplay(0.75, false)}
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
  featured? : boolean,
  link? : Link,
  bulletPoints? : BulletPoint[],
  visuals? : {
    nameColor? : string,
    descriptionColor? : string,
  }
}