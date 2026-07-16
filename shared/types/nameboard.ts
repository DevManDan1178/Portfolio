export type NameboardEntry = {
    name : string,
    timestamp : number,
}
export type NameboardCategory = 
    | "PolygonTD"
    | "Stack Matching";

export type NameboardInputEntry = Omit<NameboardEntry, "timestamp">
