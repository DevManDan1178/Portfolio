import { type ReactElement } from "react"
import { GetPlayableTag, GetImageDisplay, GetEmptyDisplay } from "../../../components/elements/LinkElements"
import { echoArena, pendulumSimulator, polygonTD, untitled2DShooter, portfolioSite, github, roblox, itchIO, typingPracticeAssignment, sidestep2, shaderMD } from "../../../assets"
import { type Tag, BaseTags, MiscTags, CategoryTags, Tags } from "../../tags"

export const PROJECTS_TITLE_TEXT_SIZE = 24


export const SUBTAG_TEXT_SIZE_REDUCTION_BY_LAYER = 1.5

export const defaultTagSymbol = (tagName : string) => `‹${tagName}›`

export const preTitle : string = "Stuff I Made"
export const title : string = "Projects"
export const subDescription : string = "Some of my best work."


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
  description: string | ReactElement,
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

type ProjectType = "Games" | "Applications" | "Websites" | "Libraries"

export const projects : Record<ProjectType, Record<string, Project>> = {
  Games: {
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
  },
  Applications: {
    keyboardWarriorLoL: {
      name: "KeyboardWarriorLoL",
      display: GetEmptyDisplay(),
      links: {
        mainLink: {
          url: "https://github.com/DevManDan1178/KeyboardWarriorLoL",
          linkIcon: github
        },
        allLinks: [
          {
            url: "https://github.com/DevManDan1178/KeyboardWarriorLoL",
            linkIcon: github
          }
        ],
      },
      description: 
        <p>
          Companion application with League of Legends for efficient adaptive chat message sending using live in-game event detection.
          <br/> <br/>
          Built in C++ for windows, chosen for its minimal runtime overhead and high performance.
          <br/> <br/>
          More details and a download are available on the Github repository.
        </p>
      ,
      tags : [BaseTags.CMake, BaseTags.Cpp, BaseTags.DearImgui],
      visuals: {
        nameColor: "#d5eef0",
      }
    },
    simpleSoundboard: {
      name: "Simple Soundboard",
      display: GetEmptyDisplay(),
      links: {
        mainLink: {
          url: "https://github.com/DevManDan1178/simple-soundboard",
          linkIcon: github
        },
        allLinks: [
          {
            url: "https://github.com/DevManDan1178/simple-soundboard",
            linkIcon: github
          }
        ],
      },
      description: 
        <p>
          A soundboard designed with the goal of being as easy to use as possible, with only two configurable hotkeys for all the required functionality.
          <br/> <br/>
          Built in C++ for windows, chosen for its minimal runtime overhead and high performance.
          <br/> <br/>
          More details and a download are available on the Github repository.
        </p>
      ,
      tags : [BaseTags.CMake, BaseTags.Cpp, BaseTags.DearImgui],
      visuals: {
        nameColor: "#f5fce1"
      }
    },
    shaderMd: {
      name: "Shader-md",
      display: GetImageDisplay(shaderMD, "Shader-md"),
      links: {
        mainLink: {
          url: "https://github.com/DevManDan1178/shader-md",
          linkIcon: github
        },
        allLinks: [
          {
            url: "https://github.com/DevManDan1178/shader-md",
            linkIcon: github
          }
        ],
      },
      description: 
        <p>
          An application that applies GPU shader effects to markdown and HTML, exporting the result as a separate animated file, as <code>Gif</code>, <code>WebP</code>, or <code>APNG</code>.
          <br/> <br/>
          Built in C# with DotNet 8 and in Typescript.
        </p>
      ,
      tags : [BaseTags.CSharp, BaseTags.DotNet],
    },
    pendulumSimulator : {
      name : "Pendulum Simulator",
      description : "Physics simulator of a simple pendulum",
      tags : [ BaseTags.Git, BaseTags.Java,CategoryTags.TeamProject, CategoryTags.Academic],
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
  },
  Libraries: {
    serverSimple: {
      name: "Server-simple",
      display: GetEmptyDisplay(),
      links: {
        mainLink: {
          url: "https://github.com/DevManDan1178/server-simple",
          linkIcon: github
        },
        allLinks: [
          {
            url: "https://github.com/DevManDan1178/server-simple",
            linkIcon: github
          }
        ]
      },
      description:
      <p>
        A lightweight, header-only C++20 server infrastructure library built with Boost.Asio and Boost.Beast for asynchronous HTTP and WebSocket applications.
        <br/> <br/>
        Provides bounded work queues, backpressure, rate limiting, multithreaded request processing, thread-safe data structures, persistent storage, and real-time WebSocket infrastructure.
        <br/> <br/>
        <em>Designed for building reliable concurrent services without the overhead of a large framework.</em>
        <br/> <br/>
        <em>Used for this site's leaderboards <br/>(coming soon).</em>
      </p>
      ,
      tags: [BaseTags.CMake, BaseTags.Cpp],
      visuals: {
        nameColor: "#edffde"
      },
      featured: true,
    }
  },
  Websites: {
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
      tags : [BaseTags.Git, Tags.React, Tags.Tailwind, BaseTags.ThreeJS, BaseTags.Cpp, BaseTags.CMake],
      visuals: {
        nameColor: "#e8e0ff"
      }
    },
  }
}


export const allProjects: Record<string, Project> = Object.fromEntries(
  Object.entries(projects).flatMap(([, category]) =>
    Object.entries(category)
  )
)

