import { vanierCollege } from '../assets'

export type IconInfo = {
  icon : string,
  background : string,
  iconScale? : number
}

export type Experience = {
  title: string,
  subTitle : string,
  iconInfo : IconInfo,
  date : string,
  points : string[]
}

export const preTitle : string = "Stuff I Did"
export const title : string = "My Journey"
export const subDescription : string = "Currently a work in progress."

export const experiences : Experience[] = [
  {
    title : "Math, Science, and Computer Science",
    subTitle : "Vanier College",
    iconInfo : {
      icon : vanierCollege,
      background : "#ff9896",
      iconScale : 1.75
    },
    date : "Fall 2024 - Winter 2026",
    points : [
      "Applied computer science fundamentals by building small-scale software projects using Java",
      "Implemented core data structures and algorithms through coursework and personal programming exercises",
      "Developed interactive and graphical projects applying programming logic and problem-solving techniques",
      "Worked with Git for version control and debugging tools to iteratively improve project codebases",
      "Used mathematical concepts such as linear algebra, discrete math, and logic to support computational problem-solving",
      "Built and refined personal projects that reinforced object-oriented programming and software design principles",
    ]
  }
];