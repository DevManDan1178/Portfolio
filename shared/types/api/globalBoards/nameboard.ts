export type NameboardEntry = {
    name : string,
    timestamp : number,
}

export type NameboardQueryOrder =  "Oldest" | "Newest";
export const defaultNameboardQueryOrder : NameboardQueryOrder = "Oldest";

export type NameboardCategory = 
    | "PolygonTD-completionist";

export type NameboardInputEntry = Omit<NameboardEntry, "timestamp">

