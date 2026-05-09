import { type ReactElement } from "react"
export const CategoryTags : Record<string, Tag> = {
  Academic : {
    name : "Academic",
    color : "#fff1c9",
    baseTextSizeModifier : -4,
  },
  TeamProject : {
    name : "Team Project",
    color : "#f4e3ff",
    baseTextSizeModifier :- 2,
  }
}

export const MiscTags : Record<string, Tag> = {
  GMTKJam2026 : {
    name : "GMTK Game Jam 2026",
    color : "lime-text-gradient",
    baseTextSizeModifier : 1
  },
}

export const BaseTags : Record<string, Tag> = {
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
    color : "#c2d6ff",
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
    color : "#f7ccff",
  },
  GameDev : {
    name : "Game Development",
    color : "orange-text-gradient",
  },
  WebDev : {
    name : "Web Development",
    color : "#c9fffa",
  },
  Java : {
    name : "Java",
    color : "#fcc379",
  },
  Git : {
    name : "Git",
    color : "#fcdedc", 
  },
  ThreeJS : {
    name : "ThreeJS",
    color : "grey-text-gradient"
  },
  MusicComposition : {
    name : "♪ Composition",
    color : "#f2e3ff",
    baseTextSizeModifier : -2
  } 
}

export const Tags : Record<string, Tag> = {
  React : {
    name: "React",
    color: "light-blue-text-gradient",
    subTags : [BaseTags.Javascript, BaseTags.Typescript, BaseTags.WebDev],
  },
  Tailwind : {
    name: "Tailwind",
    color: "red-text-gradient",
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


export type Tag = {
  name : string,
  color : string,
  subTags? : Tag[]
  baseTextSizeModifier? : number,
  overrideTagSymbol? : (tagName : string) => ReactElement | string,
  hideSubTagsByDefault? : boolean,
}