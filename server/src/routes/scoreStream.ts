import { reverseOrderQueryParameter } from "../../../shared/constants/api/globalBoards";
import { defaultScoreStreamSortOrder, ScoreStreamSortOrder, type ScoreStreamCategory, type ScoreStreamEntry, type ScoreStreamInputEntry } from "../../../shared/types/api/globalBoards/scoreStreams"
import getEnvironmentVariables from "../environment";
import { fetchWithTimeout } from "../querying/fetchWithTimeout";

const scoreStreamKeys : Record<ScoreStreamCategory, string> = {
    "Stack Matching": "stack-matching"
};

const requestSectionKey = "score-streams";

export async function getScoreStreamEntries(
    category : ScoreStreamCategory, 
    start : number, 
    end : number,
    sortOrder: ScoreStreamSortOrder
) :  Promise<ScoreStreamEntry[] | undefined> {
    if (start < 0 || end < 0) {
        console.log("Invalid start and/or end - getScoreStreamEntres: ", start, end)
        return;
    }
    const environmentVariables = getEnvironmentVariables();
    if (!environmentVariables) {
        return;
    }
    const {requestURLBase, API_KEY} = environmentVariables;

    const categoryKey = scoreStreamKeys[category];
    const requestURL = 
        `${requestURLBase}${requestSectionKey}/${categoryKey}?` +
        `start=${start.toString()}&end=${end.toString()}&${reverseOrderQueryParameter}=${sortOrder != defaultScoreStreamSortOrder}`;
    
    try {
        const response = await fetchWithTimeout(requestURL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        if (!response.ok) {
            console.log(
                "ScoreStream request failed:",
                response.status,
                await response.text()
            );
            return;
        }

        const data = await response.json();
        console.log("fetched scoreStream data:", categoryKey, " - ", data);
        return data as ScoreStreamEntry[];
    } catch (error) {
        console.log("Failed to fetch scoreStream entries:", error);
        return;
    }
}

export async function addScoreStreamEntry(category : ScoreStreamCategory, entry : ScoreStreamInputEntry) : Promise<number | undefined> {
    const environmentVariables = getEnvironmentVariables();
    if (!environmentVariables) {
        return;
    }
    const {requestURLBase, API_KEY} = environmentVariables;

    const categoryKey = scoreStreamKeys[category];
    const requestURL = `${requestURLBase}${requestSectionKey}/${categoryKey}`;

    try {
        const response = await fetchWithTimeout(requestURL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                name: entry.name,
                score: entry.score,
            }),
        });

        if (!response.ok) {
            console.log(
                "ScoreStream request failed:",
                response.status,
                await response.text()
            );
            return;
        }

        const data = await response.json();
        const added_index = data.index;

        return added_index;
    } catch (error) {
        console.log("Failed to post scoreStream entry:", error);
        return;
    }
}
