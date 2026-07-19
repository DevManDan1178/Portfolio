import { getLeaderboardEntries, addLeaderboardEntry, } from "../src/routes/leaderboard";
import { type LeaderboardCategory } from "../../shared/types/api/globalBoards/leaderboard";
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
            
            const entries = await getLeaderboardEntries(
                category as LeaderboardCategory,
                start,
                end,
            );

            return Response.json(entries);
        }

        if (request.method === "POST") {
            const body = await request.json();
            
            return Response.json(await addLeaderboardEntry(
                category as LeaderboardCategory,
                {
                    name: body.name,
                    score: body.score,
                },
            ));
        }

        return Response.json(
            { error: "Method not allowed" },
            { status: 405 }
        );

    } catch (error) {
        console.error(error);

        return Response.json(
            { error: "Leaderboard request failed" },
            { status: 500 }
        );
    }
}