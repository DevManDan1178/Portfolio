export type NameboardEntry = {
    name : string,
    timestamp : number,
}

export type NameboardQueryOrder =  "Oldest" | "Newest";
export const defaultNameboardQueryOrder : NameboardQueryOrder = "Oldest";

export type NameboardCategory = 
    | "PolygonTD";

export type NameboardInputEntry = Omit<NameboardEntry, "timestamp">

export const nameboardApiURLPath = "/api/nameboard";