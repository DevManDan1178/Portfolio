import { reverseOrderQueryParameter } from "../../../shared/constants/api/globalBoards";
import { defaultScoreStreamSortOrder, scoreStreamApiURLPath, type ScoreStreamCategory, type ScoreStreamSortOrder } from "../../../shared/types/api/globalBoards/scoreStreams";

export async function getScoreStreamEntries(
    category: ScoreStreamCategory,
    start: number,
    end: number,
    sortOrder: ScoreStreamSortOrder
) {
    const queryURL = `${scoreStreamApiURLPath}?category=${encodeURIComponent(category)}&start=${start}&end=${end}&${reverseOrderQueryParameter}=${sortOrder != defaultScoreStreamSortOrder}`;
    console.log("fetching from ", queryURL )
    const response = await fetch(queryURL);

    if (!response.ok) {
        throw new Error("Failed to fetch score stream");
    }

    return response.json();
}