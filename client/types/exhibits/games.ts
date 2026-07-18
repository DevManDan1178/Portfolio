export type GameEventLinkers = {
    gameEventName : string,
    handler: (e : any) => void,
}[]