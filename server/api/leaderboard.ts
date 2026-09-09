import { getLeaderboardEntries, addLeaderboardEntry, } from "../src/routes/leaderboard";
import { type LeaderboardCategory } from "../../shared/types/api/globalBoards/leaderboard";
import { nameRefusalEror, reverseOrderQueryParameter } from "../../shared/constants/api/globalBoards";
import nameFilter from "../src/security/nameFilter";

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
            const name = body.name;
            if (!nameFilter(name)) {
              return Response.json(
                { error: nameRefusalEror },
                { status: 400 }
              )
            }

            const result = await addLeaderboardEntry(
                category as LeaderboardCategory,
                {
                    name,
                    score: body.score,
                },
            )
            return Response.json(result);
        }

        return Response.json(
            { error: "Method not allowed" },
            { status: 405 }
        );

    } catch (error) {
        console.error("[Leaderboard request handler]", error);

        return Response.json(
            { error: "Leaderboard request failed" },
            { status: 500 }
        );
    }
}