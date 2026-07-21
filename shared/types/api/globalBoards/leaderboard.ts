export type LeaderboardCategory =
    | "EchoArena-highscore"
    | "EchoArena-pacifist"
    | "Sidestep2-highscore"
    | "StackMatching";

export type LeaderboardEntry = {
    name: string;
    timestamp: number;
    score: number;
};

export type LeaderboardInputEntry = Omit<
    LeaderboardEntry,
    "timestamp"
>;

