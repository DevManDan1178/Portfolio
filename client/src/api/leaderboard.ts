import { reverseOrderQueryParameter } from "../../../shared/constants/api/globalBoards";
import { defaultLeaderboardSortOrder, leaderboardApiURLPath, type LeaderboardCategory, type LeaderboardInputEntry, type LeaderboardSortOrder } from "../../../shared/types/api/globalBoards/leaderboard";

export async function getLeaderboardEntries(
    category: LeaderboardCategory,
    start: number,
    end: number,
    sortOrder: LeaderboardSortOrder = "Top"
) {
    const queryURL =`${leaderboardApiURLPath}?category=${encodeURIComponent(category)}&start=${start}&end=${end}&${reverseOrderQueryParameter}=${sortOrder != defaultLeaderboardSortOrder}`;
   
    console.log("fetching from ",  queryURL)
    const response = await fetch(queryURL);

    if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
    }

    return response.json();
}


export async function submitLeaderboardScore(category : LeaderboardCategory, entry : LeaderboardInputEntry) {
    const queryURL = `${leaderboardApiURLPath}?category=${encodeURIComponent(category)}`;

    console.log("posting to ", queryURL);
    const response = await fetch(queryURL, {
        body: JSON.stringify({
            name: entry,
            score: entry.score
        })
    })

    if (!response.ok) {
        throw new Error("Failed to post to leaderboard");
    }

    return response.json();
}