import { defaultNameboardSortOrder, nameboardApiURLPath, type NameboardCategory, type NameboardSortOrder } from "../../../shared/types/api/globalBoards/nameboard";
import { reverseOrderQueryParameter } from "../../../shared/constants/api/globalBoards"

export async function getNameboardEntries(
    category: NameboardCategory,
    start: number,
    end: number,
    sortOrder : NameboardSortOrder = "Newest",
) {
    const queryURL = `${nameboardApiURLPath}?category=${encodeURIComponent(category)}&start=${start}&end=${end}&${reverseOrderQueryParameter}=${sortOrder != defaultNameboardSortOrder}`;
    console.log("fetching from ",  queryURL)
    const response = await fetch(queryURL);

    if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
    }

    return response.json();
}