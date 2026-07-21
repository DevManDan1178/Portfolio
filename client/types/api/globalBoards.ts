import type { Dispatch, SetStateAction } from "react"

export type GlobalBoardPropsBase = {
    title: string, 
    count: number, 
}

export type SubmittableGlobalBoardPropsBase = GlobalBoardPropsBase & {
    maxNameLength : number
    placeholderName? : string
    submitButtonText?: string;
    submitButtonCooldown?: number;
    submitSectionTitle?: string;
}

export type GlobalBoardSubTitlePropsBase = {
    name : string, 
    timestamp: string
}

export type EntriesState<T> = [
    entries: T[],
    setEntries: Dispatch<SetStateAction<T[]>>
]

export type SubmitResult = {
    message : string,
    isError : boolean
  }