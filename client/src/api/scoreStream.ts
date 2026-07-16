import type { ScoreStreamCategory } from "../../../shared/types/scoreStreams";

export async function getScoreStreamEntries(
    category: ScoreStreamCategory,
    start: number,
    end: number
) {
    console.log("fetching from ",  `/api/score-stream?category=${encodeURIComponent(category)}&start=${start}&end=${end}`)
    const response = await fetch(
        `/api/score-stream?category=${encodeURIComponent(category)}&start=${start}&end=${end}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch score stream");
    }

    return response.json();
}