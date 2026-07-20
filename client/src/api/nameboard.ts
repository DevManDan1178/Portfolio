import { defaultNameboardQueryOrder, type NameboardCategory, type NameboardInputEntry, type NameboardQueryOrder } from "../../../shared/types/api/globalBoards/nameboard";
import { reverseOrderQueryParameter } from "../../../shared/constants/api/globalBoards"
import { nameboardApiURLPath } from "../../../shared/constants/api/globalBoards";

export async function getNameboardEntries(
    category: NameboardCategory,
    start: number,
    end: number,
    queryOrder : NameboardQueryOrder = "Newest",
) {
    const queryURL = `${nameboardApiURLPath}?category=${encodeURIComponent(category)}&start=${start}&end=${end}&${reverseOrderQueryParameter}=${queryOrder != defaultNameboardQueryOrder}`;
    console.log("fetching from ",  queryURL)
    const response = await fetch(queryURL);

    if (!response.ok) {
        throw new Error("Failed to fetch nameboard");
    }

    return response.json();
}


export async function submitNameboardEntry(category : NameboardCategory, entry : NameboardInputEntry) {
    const queryURL = `${nameboardApiURLPath}?category=${encodeURIComponent(category)}`;

    console.log("posting to ", queryURL);
    const response = await fetch(queryURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: entry.name,
        })
    })

    if (!response.ok) {
        throw new Error("Failed to post to nameboard");
    }

    return response.json();
}