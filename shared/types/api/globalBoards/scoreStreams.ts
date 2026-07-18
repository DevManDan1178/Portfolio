export type ScoreStreamCategory =
    | "Stack Matching";

export type ScoreStreamEntry = {
    name: string;
    timestamp: number;
    score: number;
};

export type ScoreStreamSortOrder = "Newest" | "Oldest";
export const defaultScoreStreamSortOrder : ScoreStreamSortOrder = "Newest";

export type ScoreStreamInputEntry = Omit<
    ScoreStreamEntry,
    "timestamp"
>;

export const scoreStreamApiURLPath = "/api/score-stream";