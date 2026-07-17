import { reverseOrderQueryParameter } from "../../../shared/constants/api/globalBoards";
import type { LeaderboardCategory, LeaderboardSortOrder } from "../../../shared/types/api/globalBoards/leaderboard";

export async function getLeaderboardEntries(
    category: LeaderboardCategory,
    start: number,
    end: number,
    sortOrder: LeaderboardSortOrder = "Top"
) {
    const queryURL =`/api/leaderboard?category=${encodeURIComponent(category)}&start=${start}&end=${end}${sortOrder == "Bottom" && reverseOrderQueryParameter}`;
   
    console.log("fetching from ",  queryURL)
    const response = await fetch(queryURL);

    if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
    }

    return response.json();
}