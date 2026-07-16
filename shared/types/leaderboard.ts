export type LeaderboardCategory =
    | "Echo Arena"
    | "Sidestep2"

export type LeaderboardEntry = {
    name: string;
    timestamp: number;
    score: number;
};

export type LeaderboardInputEntry = Omit<
    LeaderboardEntry,
    "timestamp"
>;