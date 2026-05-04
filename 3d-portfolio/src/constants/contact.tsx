import type { ReactElement } from "react"
import { github, itchIO, linkedIn, email } from "../assets"


export const preTitle = "Get in touch"
export const title = "Contact"
export const subDescription = "I’m currently looking for internship opportunities. Feel free to reach out."

export const emailUser = "danielorejuelaliu"
export const emailDomain = "gmail.com"

export const emailElement = <span className="text-[20px]">
    danielorejuelaliu<span className="text-[15px]">@</span>gmail
    <span className="text-[15px]">[]</span>
</span>

export const CoreSocialLinks : LinkList = {
    gitHub : {
        platform : "GitHub",
        url : "https://github.com/DevManDan1178",
        linkIcon : github,
    },
    itchIO : {
        platform : "Itch.io",
        url : "https://devman-dan.itch.io/",
        linkIcon : itchIO
    },
    linkedIn : {
        platform : "LinkedIn",
        url : "https://www.linkedin.com/in/danoliu/",
        linkIcon : linkedIn, 
        
    },
    email : {
        platform : "Mail",
        url : `mailto:${emailUser + "@" + emailDomain}`,
        linkIcon : email,
    }
}

export const SocialLinks : LinkList = {
    ...CoreSocialLinks,
}


export type SocialLink = {
    platform : string,
    url? : string,
    linkIcon : string,
}

export type LinkList = Record<string, SocialLink>
