import { getURLEntry, setURLEntry, } from "../src/routes/globalURL";
import { type URLCategory } from "../../shared/types/globalURL";

export default async function handler(request: Request) {
    const url = new URL(request.url);

    const category = url.searchParams.get("category");

    if (!category) {
        return Response.json(
            { error: "Missing category" },
            { status: 400 }
        );
    }

    try {
        if (request.method === "GET") {
            const entry = await getURLEntry(
                category as URLCategory
            );

            return Response.json(entry);
        }

        if (request.method === "POST") {
            const body = await request.text();

            const success = await setURLEntry(
                category as URLCategory,
                body
            );

            return Response.json({ success });
        }

        return Response.json(
            { error: "Method not allowed" },
            { status: 405 }
        );

    } catch (error) {
        console.error(error);

        return Response.json(
            { error: "URL request failed" },
            { status: 500 }
        );
    }
}