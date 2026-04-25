import { mobile, backend, creator, web, } from '../assets'

export type Service = {
  title : string,
  icon : string,
}

export const services : Service[] = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "React Native Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Content Creator",
    icon: creator,
  },
];