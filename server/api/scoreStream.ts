import { addScoreStreamEntry, getScoreStreamEntries, } from "../src/routes/scoreStream";
import { defaultScoreStreamQueryOrder, ScoreStreamQueryOrder, type ScoreStreamCategory } from "../../shared/types/api/globalBoards/scoreStreams";
import { reverseOrderQueryParameter } from "../../shared/constants/api/globalBoards";

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
            
            const queryOrder = String(url.searchParams.get(reverseOrderQueryParameter) ?? defaultScoreStreamQueryOrder);
            const entries = await getScoreStreamEntries(
                category as ScoreStreamCategory,
                start,
                end,
                queryOrder as ScoreStreamQueryOrder
            );

            return Response.json(entries);
        }

        if (request.method === "POST") {
            const body = await request.json();

            const queryOrder = String(url.searchParams.get(reverseOrderQueryParameter) ?? defaultScoreStreamQueryOrder);
            
            const result = await addScoreStreamEntry(
                category as ScoreStreamCategory,
                {
                    name: body.name,
                    score: body.score,
                },
                queryOrder as ScoreStreamQueryOrder
            )
            return Response.json(result);
        }

        return Response.json(
            { error: "Method not allowed" },
            { status: 405 }
        );

    } catch (error) {
        console.error("[ScoreStream request handler", error);

        return Response.json(
            { error: "ScoreStream request failed" },
            { status: 500 }
        );
    }
}