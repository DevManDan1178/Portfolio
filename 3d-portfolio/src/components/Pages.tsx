
import type { ReactElement } from 'react'
import { InvertingDisplay } from './effects/VisualEffects'
import { pages, type PageInfo } from '../constants/pages/pages'

export function GetPages(pages : PageInfo[], openInNewTab : boolean = true) : () => ReactElement {
  return () => (
    <div className=''>
        <span className='flex text-center justify-center text-[15px] font-semibold'>
          My Other Pages
        </span>
        <div className='w-full flex items-center justify-center gap-6 mt-[15px]'>
            {GetPageDisplays(pages, openInNewTab)}
        </div>       
    </div>
  )
}

export function GetPagesExcept(page : PageInfo, openInNewTab : boolean = true) : () => ReactElement {
    const allOtherPages = Object.values(pages).filter((_page) => _page != page)
    return GetPages(allOtherPages, openInNewTab)
}

export function PagesForAll(openInNewTab : boolean = true) : () => ReactElement {
    return GetPages(Object.values(pages), openInNewTab)
}

export function GetPageDisplays(pages : PageInfo[], openInNewTab : boolean = true) {
    return pages.map((page : PageInfo, index : number) => (GetLinkDisplay(page.url, page.iconElement, page.name, index, openInNewTab)))
}

export function GetLinkDisplay(url : string, iconElement : ReactElement | string, linkName : string, key : number | string, openInNewTab : boolean = true) {
    return (
        <a
        key={key}
        className="flex flex-col items-center justify-center group"
        href={url}
        target={openInNewTab ? "_blank" : "_self"}
    >
        <div className="relative w-[50px] h-[50px] flex items-center justify-center inset-0 rounded-xl overflow-hidden border-2 border-white/30">
            <span className='text-[40px] items-center text-center justify-center flex'>
                {iconElement}
            </span>

            {InvertingDisplay(0.5, true, true)}

        </div>
        
        {/* LABEL */}
        <span className="text-white/75 text-xs text-center"> 
            <b>{linkName}</b>
        </span>
    </a>
    )
}

export const GetPageDisplaysForAll = () => GetPageDisplays(Object.values(pages))

