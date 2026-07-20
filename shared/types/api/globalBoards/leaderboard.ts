export type LeaderboardCategory =
    | "Echo Arena Highscore"
    | "Echo Arena Pacifist"
    | "Sidestep2 Highscore"
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

