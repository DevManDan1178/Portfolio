import { type LeaderboardCategory, type LeaderboardEntry, type LeaderboardInputEntry } from "../../../shared/types/api/globalBoards/leaderboard"
import { reverseOrderQueryParameter } from "../../../shared/constants/api/globalBoards"
import getEnvironmentVariables from "../environment";
import { fetchWithTimeout } from "../querying/fetchWithTimeout";

const leaderboardKeys : Record<LeaderboardCategory, string> = {
    "EchoArena-highscore": "echo-arena-highscore",
    "EchoArena-pacifist": "echo-arena-pacifist",
    "Sidestep2-highscore": "sidestep-2-highscore",
    "StackMatching": "stack-matching",
};

const requestSectionKey = "leaderboards";


export async function getLeaderboardEntries(
    category : LeaderboardCategory, 
    start : number, 
    end : number,
) : Promise<LeaderboardEntry[]> {
    if (start < 0 || end < 0) {
        throw new Error(`Invalid start and/or end: ${start}, ${end}`);
    }
    const environmentVariables = getEnvironmentVariables();
    if (!environmentVariables) {
        throw new Error("Missing environment variables");
    }
    const categoryKey = leaderboardKeys[category];
    if (!categoryKey) {
        throw new Error(`Invalid leaderboard category: ${category}`);
    }
    const {requestURLBase, API_KEY} = environmentVariables;


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
            throw new Error(
                `Leaderboard request failed: ${response.status} ${await response.text()}`
            );
        }

        const data = await response.json();
        console.log("fetched leaderboard data:", category, categoryKey, " - ", data);
        return data as LeaderboardEntry[];
    } catch (error) {
        console.log("Failed to fetch leaderboard entries:", error);
        throw error;
    }
}

export async function addLeaderboardEntry(category : LeaderboardCategory, entry : LeaderboardInputEntry) : Promise<JSON> {
    if (!entry.name.trim()) {
        throw new Error("Leaderboard entry name cannot be empty");
    }

    const environmentVariables = getEnvironmentVariables();
    if (!environmentVariables) {
        throw new Error("Missing environment variables");
    }
    const {requestURLBase, API_KEY} = environmentVariables;

    const categoryKey = leaderboardKeys[category];
    if (!categoryKey) {
        throw new Error(`Invalid leaderboard category: ${category}`);
    }
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
            throw new Error(
                `Leaderboard request failed: ${response.status} ${await response.text()}`
            );
        }

        const data = await response.json();
        console.log("response", data);
        return data;
    } catch (error) {
        console.log("Failed to post leaderboard entry:", error);
        throw error;
    }
}