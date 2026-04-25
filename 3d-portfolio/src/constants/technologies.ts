import {
  javascript,
  typescript,
  html,
  reactjs,
  tailwind,
  nodejs,
  git,

  threejs,
} from "../assets";

export type Technology = {
  name : string,
  icon : string,
}

export const title : string = "\u00A0" //"\u00A0" is an invisible character
export const subDescription : string = "Match 2?"
export const solvedSubDescription : string = "WP"
export const solvedtitle : string = "GG"

export const technologies : Technology[] = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },

];
