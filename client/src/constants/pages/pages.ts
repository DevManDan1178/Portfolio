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