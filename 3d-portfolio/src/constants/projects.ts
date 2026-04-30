import { echoArena, javascript, pendulumSimulator, polygonTD, untitled2DShooter } from "../assets"

export type Tag = {
  name : string,
  color : string,
  subTags : Tag[]
  baseTextSize? : number,
}

export type ImageSource = string | "None"


export const preTitle : string = "Stuff I Made"
export const title : string = "Projects"
export const subDescription : string = "Making stuff is fun when you make fun stuff."

export type BulletPoint = {
  text : string,
  color? : string,
}

export type Project = {
  name : string,
  description: string,
  tags: Tag[],
  image : ImageSource,
  link : string,
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
  ForFun : {
    name : "4fun",
    color : "#e0f5c6",
    subTags : [],
    baseTextSize : 14,
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
    color : "yellow",
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
    name: "react",
    color: "blue-text-gradient",
    subTags : [BaseTags.javascript, BaseTags.Typescript],
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
    description : "Small tower defense game with player-customized upgrading and addition map elements",
    tags : [Tags.Unity, CategoryTags.ForFun],
    image : polygonTD,
    link : "https://randomguy1178.itch.io/polygon-tower-defense",
    visuals : {
      nameColor : "yellow-text-gradient",
    }
  },
  {
    name : "Echo Arena",
    description: "Simple arena shooter game where you must also evade your past movements",
    tags : [Tags.Godot, MiscTags.GMTKJam2026, CategoryTags.ForFun],
    image : echoArena,
    link : "https://randomguy1178.itch.io/echo-arena",
    visuals : {
      nameColor : "light-red-text-gradient"
    }
  },
  {
    name : "Untitled 2D Shooter",
    description : "2.5D layered horizontal shooter with various abilities, weapons, and cosmetics.",
    tags : [Tags.RobloxStudio, CategoryTags.ForFun],
    image : untitled2DShooter,
    link : "https://www.roblox.com/games/15434757878/Untitled-2D-Shooter",
    visuals : {
      nameColor : "#caddfc",
    }
  },
  {
    name : "Pendulum Simulator",
    description : "Simple pendulum physics simulator",
    tags : [BaseTags.Java, BaseTags.Git, CategoryTags.TeamProject, CategoryTags.Academic],
    image : pendulumSimulator,
    link : "https://github.com/VanierCollege/PendulumSimulator/tree/main/Project_PendulumSimulator",
    bulletPoints : [
      {text: "Implemented physics calculations"},
      {text: "Implemented UI for the simulation"},
      {text: "Implemented rendering"}
    ]
  }
];
