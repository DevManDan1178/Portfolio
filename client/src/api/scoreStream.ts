import { reverseOrderQueryParameter } from "../../../shared/constants/api/globalBoards";
import type { ScoreStreamCategory, ScoreStreamSortOrder } from "../../../shared/types/api/globalBoards/scoreStreams";

export async function getScoreStreamEntries(
    category: ScoreStreamCategory,
    start: number,
    end: number,
    sortOrder: ScoreStreamSortOrder
) {
    const queryURL = `/api/score-stream?category=${encodeURIComponent(category)}&start=${start}&end=${end}${sortOrder == "Oldest" && reverseOrderQueryParameter}`;
    console.log("fetching from ", queryURL )
    const response = await fetch(queryURL);

    if (!response.ok) {
        throw new Error("Failed to fetch score stream");
    }

    return response.json();
}