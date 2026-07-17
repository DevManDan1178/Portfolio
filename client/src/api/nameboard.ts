import type { NameboardCategory, NameboardSortOrder } from "../../../shared/types/api/globalBoards/nameboard";
import { reverseOrderQueryParameter } from "../../../shared/constants/api/globalBoards"

export async function getNameboardEntries(
    category: NameboardCategory,
    start: number,
    end: number,
    sortOrder : NameboardSortOrder = "Newest",
) {
    const queryURL = `/api/nameboard?category=${encodeURIComponent(category)}&start=${start}&end=${end}${sortOrder == "Oldest" && reverseOrderQueryParameter}`;
    console.log("fetching from ",  queryURL)
    const response = await fetch(queryURL);

    if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
    }

    return response.json();
}