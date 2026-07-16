import type { NameboardCategory } from "../../../shared/types/nameboard";

export async function getNameboardEntries(
    category: NameboardCategory,
    start: number,
    end: number
) {
    console.log("fetching from ",  `/api/nameboard?category=${encodeURIComponent(category)}&start=${start}&end=${end}`)
    const response = await fetch(
        `/api/nameboard?category=${encodeURIComponent(category)}&start=${start}&end=${end}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
    }

    return response.json();
}