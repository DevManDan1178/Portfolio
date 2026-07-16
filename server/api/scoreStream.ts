import { addScoreStreamEntry, getScoreStreamEntries, } from "../src/routes/scoreStream";
import { type ScoreStreamCategory } from "../../shared/types/scoreStreams";

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
            const start = Number(url.searchParams.get("start") ?? 0);
            const end = Number(url.searchParams.get("end") ?? 10);

            const entries = await getScoreStreamEntries(
                category as ScoreStreamCategory,
                start,
                end
            );

            return Response.json(entries);
        }

        if (request.method === "POST") {
            const body = await request.json();

            const index = await addScoreStreamEntry(
                category as ScoreStreamCategory,
                {
                    name: body.name,
                    score: body.score,
                }
            );

            return Response.json({ index });
        }

        return Response.json(
            { error: "Method not allowed" },
            { status: 405 }
        );

    } catch (error) {
        console.error(error);

        return Response.json(
            { error: "ScoreStream request failed" },
            { status: 500 }
        );
    }
}