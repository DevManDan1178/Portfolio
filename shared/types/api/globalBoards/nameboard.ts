export type NameboardEntry = {
    name : string,
    timestamp : number,
}

export type NameboardSortOrder = "Newest" | "Oldest";

export type NameboardCategory = 
    | "PolygonTD";

export type NameboardInputEntry = Omit<NameboardEntry, "timestamp">
