import { type ReactElement } from "react"
export type PageInfo = {
    name : string,
    iconElement : ReactElement | string,
    url : string,
}


export const pages : Record<string, PageInfo> = { 
    main : {
        name : "Main",
        iconElement : ".",
        url : "/"
    },
    games : {
        name : "Games",
        iconElement : "▶",
        url : "/Games"
    },
    ost : {
        name : "OST",
        iconElement : "♫",
        url : "/OST"
    },
}