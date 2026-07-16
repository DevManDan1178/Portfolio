import {type URLCategory, type URLEntry} from "../../../shared/types/globalURL"
import getEnvironmentVariables from "../environment";

const URLKeys : Record<URLCategory, string> = {
    "DynamicRedirect": "dynamic-redirect"
};


const requestSectionKey = "global-urls";



export async function getURLEntry(
    category : URLCategory, 
) :  Promise<URLEntry | undefined> {
    
    const environmentVariables = getEnvironmentVariables();
    if (!environmentVariables) {
        return;
    }
    const {requestURLBase, API_KEY} = environmentVariables;

    const categoryKey = URLKeys[category];
    const requestURL = `${requestURLBase}${requestSectionKey}/${categoryKey}?`;
    
    try {
        const response = await fetch(requestURL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        if (!response.ok) {
            console.log(
                "URL request failed:",
                response.status,
                await response.text()
            );
            return;
        }

        const data = await response.json();
        console.log("fetched url data:", category, " - ", data);
        return data as URLEntry;
    } catch (error) {
        console.log("Failed to fetch URL entries:", error);
        return;
    }
}

export async function setURLEntry(category : URLCategory, entry : URLEntry) : Promise<boolean> {
    const environmentVariables = getEnvironmentVariables();
    if (!environmentVariables) {
        return false;
    }
    const {requestURLBase, API_KEY} = environmentVariables;

    const categoryKey = URLKeys[category];
    const requestURL = `${requestURLBase}${requestSectionKey}/${categoryKey}`;

    try {
        const response = await fetch(requestURL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
            body: entry
        });

        if (!response.ok) {
            console.log(
                "URL request failed:",
                response.status,
                await response.text()
            );
            return false;
        }

        return true;
    } catch (error) {
        console.log("Failed to post URL entry:", error);
        return true;
    }
}
