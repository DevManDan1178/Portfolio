import { carrent, jobit, } from "../assets"

export type Tag = {
  name : string,
  color : string,
}

export type Project = {
  name : string,
  description: string,
  tags: Tag[],
  image : string,
  link : string,
}

const tags : Record<string, Tag> = {
  react : {
    name: "react",
    color: "blue-text-gradient",
  },
  tailwind : {
    name: "tailwind",
    color: "pink-text-gradient",
  }
}

export const preTitle : string = "Stuff I Made"
export const title : string = "Projects"
export const subDescription : string = "Making stuff is fun when you make fun stuff."

export const projects : Project[] = [
  {
    name: "Car Rent",
    description:
      "Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.",
    tags: [
      tags.react,
      tags.tailwind
    ],
    image: carrent,
    link: "https://github.com/",
  },
  {
    name: "Job IT",
    description:
      "Web application that enables users to search for job openings, view estimated salary ranges for positions, and locate available jobs based on their current location.",
    tags: [
      tags.react,
      tags.tailwind
    ],
    image: jobit,
    link: "https://github.com/",
  },

];
