import type { Dispatch, SetStateAction } from "react"

export type GlobalBoardPropsBase = {
    title: string, 
    count: number, 
}

export type SubmitSectionTextsBase = {
    submitButtonText?: string; 
    submitSectionTitle?: string;
    placeholderName? : string,
}

export type SubmittableGlobalBoardPropsBase = GlobalBoardPropsBase & {
    maxNameLength : number
    submitSectionTexts : SubmitSectionTextsBase 
    submitButtonCooldown?: number;
}

export type GlobalBoardSubTitlePropsBase = {
    name? : string, 
    timestamp?: string
}

export type EntriesState<T> = [
    entries: T[],
    setEntries: Dispatch<SetStateAction<T[]>>
]

export type SubmitResult = {
    message : string,
    isError : boolean
  }