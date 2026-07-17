export type LeaderboardCategory =
    | "Echo Arena"
    | "Sidestep2"
    | "Test"

export type LeaderboardSortOrder = "Top" | "Bottom"

export type LeaderboardEntry = {
    name: string;
    timestamp: number;
    score: number;
};

export type LeaderboardInputEntry = Omit<
    LeaderboardEntry,
    "timestamp"
>;