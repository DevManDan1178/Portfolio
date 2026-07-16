import { type NameboardCategory, type NameboardEntry, type NameboardInputEntry } from "../../../shared/types/nameboard"
import getEnvironmentVariables from "../environment";

const nameboardKeys : Record<NameboardCategory, string> = {
    "PolygonTD": "polygon-td",
    "Stack Matching": "stack-matching"
};

const requestSectionKey = "nameboards";

export async function getNameboardEntries(
    category : NameboardCategory, 
    start : number, 
    end : number
) :  Promise<NameboardEntry[]> {
    if (start < 0 || end < 0) {
        console.log("Invalid start and/or end - getNameboardEntres: ", start, end)
        return [];
    }
    const environmentVariables = getEnvironmentVariables();
    if (!environmentVariables) {
        return [];
    }
    const {requestURLBase, API_KEY} = environmentVariables;
    const categoryKey = nameboardKeys[category];
    const requestURL = 
        `${requestURLBase}${requestSectionKey}/${categoryKey}?` +
        `start=${start.toString()}&end=${end.toString()}`;
    
    try {
        const response = await fetch(requestURL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        if (!response.ok) {
            console.log(
                "Leaderboard request failed:",
                response.status,
                await response.text()
            );
            return [];
        }

        const data = await response.json();

        console.log("fetched nameboard data:", categoryKey, " - ", data);
        return data as NameboardEntry[];
    } catch (error) {
        console.log("Failed to fetch nameboard entries:", error);
        return [];
    }
}

export async function addNameboardEntry(category : NameboardCategory, entry : NameboardInputEntry) : Promise<number | undefined> {
    const environmentVariables = getEnvironmentVariables();
    if (!environmentVariables) {
        return;
    }
    const {requestURLBase, API_KEY} = environmentVariables;

    const categoryKey = nameboardKeys[category];
    const requestURL = `${requestURLBase}${requestSectionKey}/${categoryKey}`;

    try {
        const response = await fetch(requestURL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                name: entry.name,
            }),
        });

        if (!response.ok) {
            console.log(
                "Leaderboard request failed:",
                response.status,
                await response.text()
            );
            return;
        }

        const data = await response.json();
        const added_index = data.index;

        return added_index;
    } catch (error) {
        console.log("Failed to post nameboard entry:", error);
        return;
    }
}
