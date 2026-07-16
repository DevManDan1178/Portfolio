import { type LeaderboardCategory, type LeaderboardEntry, type LeaderboardInputEntry } from "../../../shared/types/leaderboard"
import getEnvironmentVariables from "../environment";

const leaderboardKeys : Record<LeaderboardCategory, string> = {
    "Echo Arena": "echo-arena",
    "Sidestep2": "sidestep-2",
};

const requestSectionKey = "leaderboards";



export async function getLeaderboardEntries(
    category : LeaderboardCategory, 
    start : number, 
    end : number
) :  Promise<LeaderboardEntry[]> {
    if (start < 0 || end < 0) {
        console.log("Invalid start and/or end - getLeaderboardEntres: ", start, end)
        return [];
    }
    const environmentVariables = getEnvironmentVariables();
    if (!environmentVariables) {
        return [];
    }
    const {requestURLBase, API_KEY} = environmentVariables;

    const categoryKey = leaderboardKeys[category];
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
        console.log("fetched leaderboard data:", categoryKey, " - ", data);
        return data as LeaderboardEntry[];
    } catch (error) {
        console.log("Failed to fetch leaderboard entries:", error);
        return [];
    }
}

export async function addLeaderboardEntry(category : LeaderboardCategory, entry : LeaderboardInputEntry) : Promise<number | undefined> {
    const environmentVariables = getEnvironmentVariables();
    if (!environmentVariables) {
        return;
    }
    const {requestURLBase, API_KEY} = environmentVariables;

    const categoryKey = leaderboardKeys[category];
    const requestURL = `${requestURLBase}${requestSectionKey}/${categoryKey}`;

    try {
        const response = await fetch(requestURL, {
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
        console.log("Failed to post leaderboard entry:", error);
        return;
    }
}
