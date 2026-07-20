import { getNameboardEntries, addNameboardEntry, } from "../src/routes/nameboard";
import { defaultNameboardQueryOrder, type NameboardCategory, NameboardQueryOrder } from "../../shared/types/api/globalBoards/nameboard";
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
            const queryOrder = String(url.searchParams.get(reverseOrderQueryParameter) ?? defaultNameboardQueryOrder);
            const entries = await getNameboardEntries(
                category as NameboardCategory,
                start,
                end,
                queryOrder as NameboardQueryOrder
            );

            return Response.json(entries);
        }

        if (request.method === "POST") {
            const body = await request.json();

            const queryOrder = String(url.searchParams.get(reverseOrderQueryParameter) ?? defaultNameboardQueryOrder);
            const result = await addNameboardEntry(
                category as NameboardCategory,
                {
                    name: body.name,
                },
                queryOrder as NameboardQueryOrder
            )
            return Response.json(result);
        }

        return Response.json(
            { error: "Method not allowed" },
            { status: 405 }
        );

    } catch (error) {
        console.error("[Nameboard request handler]", error);

        return Response.json(
            { error: "Nameboard request failed" },
            { status: 500 }
        );
    }
}