import type { LeaderboardCategory } from "../../../shared/types/leaderboard";

export async function getLeaderboardEntries(
    category: LeaderboardCategory,
    start: number,
    end: number
) {
    console.log("fetching from ",  `/api/leaderboard?category=${encodeURIComponent(category)}&start=${start}&end=${end}`)
    const response = await fetch(
        `/api/leaderboard?category=${encodeURIComponent(category)}&start=${start}&end=${end}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
    }

    return response.json();
}