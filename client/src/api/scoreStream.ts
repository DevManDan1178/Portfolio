import { reverseOrderQueryParameter } from "../../../shared/constants/api/globalBoards";
import { defaultScoreStreamQueryOrder, type ScoreStreamCategory, type ScoreStreamInputEntry, type ScoreStreamQueryOrder } from "../../../shared/types/api/globalBoards/scoreStreams";
import { scoreStreamApiURLPath } from "../../../shared/constants/api/globalBoards";

export async function getScoreStreamEntries(
    category: ScoreStreamCategory,
    start: number,
    end: number,
    queryOrder: ScoreStreamQueryOrder
) {
    const queryURL = `${scoreStreamApiURLPath}?category=${encodeURIComponent(category)}&start=${start}&end=${end}&${reverseOrderQueryParameter}=${queryOrder != defaultScoreStreamQueryOrder}`;
    console.log("fetching from ", queryURL )
    const response = await fetch(queryURL);

    if (!response.ok) {
        throw new Error("Failed to fetch score stream");
    }

    return response.json();
}


export async function submitScoreStreamScore(category : ScoreStreamCategory, entry : ScoreStreamInputEntry) {
    const queryURL = `${scoreStreamApiURLPath}?category=${encodeURIComponent(category)}`;

    console.log("posting to ", queryURL);
    const response = await fetch(queryURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: entry.name,
            score: entry.score
        })
    })

    return response.json();
}