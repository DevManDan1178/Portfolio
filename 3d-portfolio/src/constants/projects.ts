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


];
