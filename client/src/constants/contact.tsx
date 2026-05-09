import type { ReactElement } from "react"
import { github, itchIO, linkedIn, email } from "../assets"
import { GetLinkDisplay } from "../components/Pages"

export const emailUser = "danielorejuelaliu"
export const emailDomain = "gmail.com"

export const preTitle = "Get in touch"
export const title = "Contact"
export const subDescription = <span> 
    I’m currently looking for internship opportunities in 
    <span className="text-teal-100/75"> game </span>
    or in 
    <span className="text-blue-100/75"> software </span>
    development. Feel free to reach out. <br/> 
    I will get back to you as soon as possible if you 
    <a 
        className="text-white/75 cursor-pointer font-semibold" 
        href={`mailto:${emailUser + "@" + emailDomain}`}
        target="_blank"
    >
       &nbsp;send me a mail
    </a>
    . <br/>
</span>



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


export function GetSocialLinkElement(link : SocialLink, key : string | number, openInNewTab : boolean = true, pixelSize : number = 50) : ReactElement{
    const linkIcon =  <img
                    src={link.linkIcon}
                    className="w-3/4 h-3/4 aspect-square relative"   
                />
  
    return GetLinkDisplay(link.url, linkIcon, link.platform, key, openInNewTab, pixelSize) 
}
export const SocialLinks : LinkList = {
    ...CoreSocialLinks,
}


export type SocialLink = {
    platform : string,
    url : string,
    linkIcon : string,
}

export type LinkList = Record<string, SocialLink>
