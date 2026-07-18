export type LeaderboardCategory =
    | "Echo Arena"
    | "Sidestep2"
    | "Test"

export type LeaderboardSortOrder = "Top" | "Bottom"
export const defaultLeaderboardSortOrder : LeaderboardSortOrder = "Top";

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