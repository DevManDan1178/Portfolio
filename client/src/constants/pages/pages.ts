import { type ReactElement } from "react"
export type PageInfo = {
    name : string,
    iconElement : ReactElement | string,
    url : string,
}


export const pages : Record<string, PageInfo> = { 
    main : {
        name : "Main Page",
        iconElement : "↩",
        url : "/"
    },
    games : {
        name : "/ Games",
        iconElement : "▶",
        url : "/Games"
    },
    projects : {
        name : "/ Projects",
        iconElement: "🛠",
        url : "/Projects"
    },    
    ost : {
        name : "/ OST",
        iconElement : "♪",
        url : "/OST"
    },
}