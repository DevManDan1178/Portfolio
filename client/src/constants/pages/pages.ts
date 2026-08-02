import { type ReactElement } from "react"
export type PageInfo = {
    name : string,
    iconElement : ReactElement | string,
    url : string,
}


export const pages : Record<string, PageInfo> = { 
    portfolio : {
        name : "Portfolio",
        iconElement : "✦",
        url : "/"
    },
    play : {
        name : "/ Play",
        iconElement : "▶",
        url : "/Play"
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