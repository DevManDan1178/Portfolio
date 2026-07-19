export type LeaderboardCategory =
    | "Echo Arena"
    | "Sidestep2"
    | "Stack Matching";

export type LeaderboardEntry = {
    name: string;
    timestamp: number;
    score: number;
};

export type LeaderboardInputEntry = Omit<
    LeaderboardEntry,
    "timestamp"
>;

export const leaderboardApiURLPath = "/api/leaderboard";