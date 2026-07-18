export type NameboardEntry = {
    name : string,
    timestamp : number,
}

export type NameboardSortOrder =  "Oldest" | "Newest";
export const defaultNameboardSortOrder : NameboardSortOrder = "Oldest";

export type NameboardCategory = 
    | "PolygonTD";

export type NameboardInputEntry = Omit<NameboardEntry, "timestamp">

export const nameboardApiURLPath = "/api/nameboard";