import { type LeaderboardCategory, type LeaderboardEntry, type LeaderboardInputEntry } from "../../../shared/types/api/globalBoards/leaderboard"
import { reverseOrderQueryParameter } from "../../../shared/constants/api/globalBoards"
import getEnvironmentVariables from "../environment";
import { fetchWithTimeout } from "../querying/fetchWithTimeout";

const leaderboardKeys : Record<LeaderboardCategory, string> = {
    "Echo Arena Highscore": "echo-arena-highscore",
    "Echo Arena Pacifist": "echo-arena-pacifist",
    "Sidestep2": "sidestep-2",
    "Stack Matching": "stack-matching",
};

const requestSectionKey = "leaderboards";


export async function getLeaderboardEntries(
    category : LeaderboardCategory, 
    start : number, 
    end : number,
) :  Promise<LeaderboardEntry[] | undefined> {
    if (start < 0 || end < 0) {
        console.log("Invalid start and/or end - getLeaderboardEntres: ", start, end)
        return;
    }
    const environmentVariables = getEnvironmentVariables();
    if (!environmentVariables) {
        return;
    }
    const {requestURLBase, API_KEY} = environmentVariables;

    const categoryKey = leaderboardKeys[category];
    const requestURL = 
        `${requestURLBase}${requestSectionKey}/${categoryKey}?` +
        `start=${start.toString()}&end=${end.toString()}&${reverseOrderQueryParameter}=${false}`;
    try {
        const response = await fetchWithTimeout(requestURL, {
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
            return;
        }

        const data = await response.json();
        console.log("fetched leaderboard data:", category, categoryKey, " - ", data);
        return data as LeaderboardEntry[];
    } catch (error) {
        console.log("Failed to fetch leaderboard entries:", error);
        return;
    }
}

export async function addLeaderboardEntry(category : LeaderboardCategory, entry : LeaderboardInputEntry) : Promise<JSON | undefined> {
    if (!entry.name.trim()) {
        return
    }

    const environmentVariables = getEnvironmentVariables();
    if (!environmentVariables) {
        return;
    }
    const {requestURLBase, API_KEY} = environmentVariables;

    const categoryKey = leaderboardKeys[category];
    const requestURL = `${requestURLBase}${requestSectionKey}/${categoryKey}?${reverseOrderQueryParameter}=${false}`;

    try {
        console.log("score", entry.score)
        const response = await fetchWithTimeout(requestURL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
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
        console.log("response", data);
        return data;
    } catch (error) {
        console.log("Failed to post leaderboard entry:", error);
        return;
    }
}
