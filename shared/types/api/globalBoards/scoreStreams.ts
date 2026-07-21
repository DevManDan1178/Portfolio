export type ScoreStreamCategory =
    | "PolygonTD";

export type ScoreStreamEntry = {
    name: string;
    timestamp: number;
    score: number;
};

export type ScoreStreamQueryOrder = "Newest" | "Oldest";
export const defaultScoreStreamQueryOrder : ScoreStreamQueryOrder = "Newest";

export type ScoreStreamInputEntry = Omit<
    ScoreStreamEntry,
    "timestamp"
>;

