import type { ProjectDisplay, Link } from "../../constants/components/page/projects"
import type { Tag } from "../../constants/tags"
import { InvertingDisplay, type HoverMode } from "../effects/VisualEffects"
import { type SocialLink} from "../../constants/components/page/contact"
import { type ReactElement } from "react"

import { GetLinkDisplay } from "../page/Pages"

export function GetImageDisplay(image : string, name : string) : ProjectDisplay {
  return ({LinkElements}) => {
    return <div className="group"><img
      src={image}
      alt={name}
      className='peer items-end justify-end flex opacity-70 group-hover/image:opacity-90 w-full h-full object-cover rounded-2xl brightness-75 group-hover/image:brightness-100 transition-[filter] duration-300 ease-in-out'   
    />
      <div className="absolute inset-0 flex justify-end gap-0">
        {LinkElements}
      </div>
    </div>
  }
}

export function GetPlayableTag(routePath : string, tagName : string = "Click to Play") : Tag {
  
    const overrideTagSymbol = (tagName : string) => (<span> <br/>
      <span 
      className="bg-black/25  hover:bg-white/25 rounded-xl cursor-pointer"
      onClick={() => {window.open(routePath, '_blank')}}
      >
        {`「${tagName}」`}
      </span>
    </span>)
    
    return {
    name : tagName,
    color : "#e0f5c6",
    baseTextSizeModifier : 4,
    overrideTagSymbol : overrideTagSymbol
  }
}

export function getDefaultLinkElement(link? : Link, hoverMode? : HoverMode) {
  return getLinkElement(() => window.open(link?.url, "_blank"), link, hoverMode)
}

export function getLinkElement(onClick : () => void, link? : Link, hoverMode? : HoverMode) {
  const linkIcon = link?.linkIcon
  return (
    <div className='relative inset-0 flex justify-end m-3 card-img_hover pointer-events-none z-10' key={"LinkElement-" + (link?.url ?? ".") }>
      <div
        className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer pointer-events-auto flex-col group'
        onClick={onClick}
      > 
        <div className="relative w-10 h-10 flex items-center justify-center inset-0 rounded-full overflow-hidden">
            {linkIcon && !link.iconIsStr ? (
              <img
                className="w-3/5 h-3/5 object-contain absolute"
                src={linkIcon} 
              />
              )  : (
              <h1 className="flex items-center justify-center w-3/5 h-3/5 text-center absolute">
                {linkIcon ?? "🔗"}  
              </h1>
            )}

            {InvertingDisplay(0.75, hoverMode)}
        </div>
      </div> 
    </div> 
  )
}


export function GetSocialLinkElement(link : SocialLink, key : string | number, openInNewTab : boolean = true, pixelSize : number = 50) : ReactElement {
    const linkIcon =  <img
        src={link.linkIcon}
        className="w-3/4 h-3/4 aspect-square relative"   
    />
  
    return GetLinkDisplay(link.url, linkIcon, link.platform, key, openInNewTab, pixelSize) 
}
