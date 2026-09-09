import { reverseOrderQueryParameter } from "../../../shared/constants/api/globalBoards";
import { defaultNameboardQueryOrder, type NameboardCategory, type NameboardEntry, type NameboardInputEntry,  NameboardQueryOrder} from "../../../shared/types/api/globalBoards/nameboard"
import getEnvironmentVariables from "../environment";
import { fetchWithTimeout } from "../querying/fetchWithTimeout";

const nameboardKeys : Record<NameboardCategory, string> = {
    "PolygonTD-completionist": "polygon-td-completionists",
};

const requestSectionKey = "nameboards";

export async function getNameboardEntries(
    category : NameboardCategory, 
    start : number, 
    end : number,
    queryOrder: NameboardQueryOrder
) : Promise<NameboardEntry[]> {
    if (start < 0 || end < 0) {
        throw new Error(`Invalid start and/or end: ${start}, ${end}`);
    }
    const environmentVariables = getEnvironmentVariables();
    if (!environmentVariables) {
        throw new Error("Missing environment variables");
    }
    const categoryKey = nameboardKeys[category];
    if (!categoryKey) {
        throw new Error(`Invalid nameboard category: ${category}`);
    }
    const {requestURLBase, API_KEY} = environmentVariables;

    const requestURL = 
        `${requestURLBase}${requestSectionKey}/${categoryKey}?` +
        `start=${start.toString()}&end=${end.toString()}&${reverseOrderQueryParameter}=${queryOrder != defaultNameboardQueryOrder}`;
    
    try {
        const response = await fetchWithTimeout(requestURL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error(
                `Nameboard request failed: ${response.status} ${await response.text()}`
            );
        }

        const data = await response.json();

        console.log("fetched nameboard data:", categoryKey, " - ", data);
        return data as NameboardEntry[];
    } catch (error) {
        console.log("Failed to fetch nameboard entries:", error);
        throw error;
    }
}

export async function addNameboardEntry(category : NameboardCategory, entry : NameboardInputEntry, queryOrder : NameboardQueryOrder) : Promise<JSON> {
    if (!entry.name.trim()) {
        throw new Error("Nameboard entry name cannot be empty");
    }
    const environmentVariables = getEnvironmentVariables();
    if (!environmentVariables) {
        throw new Error("Missing environment variables");
    }
    const {requestURLBase, API_KEY} = environmentVariables;

    const categoryKey = nameboardKeys[category];
    if (!categoryKey) {
        throw new Error(`Invalid nameboard category: ${category}`);
    }
    const requestURL = `${requestURLBase}${requestSectionKey}/${categoryKey}?${reverseOrderQueryParameter}=${queryOrder != defaultNameboardQueryOrder}`;

    try {
        const response = await fetchWithTimeout(requestURL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: entry.name,
            }),
        });

        if (!response.ok) {
            throw new Error(
                `Nameboard request failed: ${response.status} ${await response.text()}`
            );
        }

        return await response.json();
    } catch (error) {
        console.log("Failed to post nameboard entry:", error);
        throw error;
    }
}