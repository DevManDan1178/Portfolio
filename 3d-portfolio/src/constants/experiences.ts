import { vanierCollege } from '../assets'

export type IconInfo = {
  icon : string,
  background : string,
  iconScale? : number
}

export type Experience = {
  title: string,
  companyName : string,
  iconInfo : IconInfo,
  date : string,
  points : string[]
}

export const preTitle : string = "Stuff I Did"
export const title : string = "Journey"
export const subDescription : string = ""

export const experiences : Experience[] = [
  {
    title : "Math, Science, and Computer Science",
    companyName : "Vanier College",
    iconInfo : {
      icon : vanierCollege,
      background : "#ff9896",
      iconScale : 1.5
    },
    date : "Fall 2024 - Winter 2026",
    points : []
  }
];