export type ScoreStreamCategory =
    | "Stack Matching";

export type ScoreStreamEntry = {
    name: string;
    timestamp: number;
    score: number;
};

export type ScoreStreamSortOrder = "Newest" | "Oldest";

export type ScoreStreamInputEntry = Omit<
    ScoreStreamEntry,
    "timestamp"
>;