import { getNameboardEntries, addNameboardEntry, } from "../src/routes/nameboard";
import { defaultNameboardSortOrder, type NameboardCategory, NameboardSortOrder } from "../../shared/types/api/globalBoards/nameboard";
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
            const sortOrder = String(url.searchParams.get(reverseOrderQueryParameter) ?? defaultNameboardSortOrder);
            const entries = await getNameboardEntries(
                category as NameboardCategory,
                start,
                end,
                sortOrder as NameboardSortOrder
            );

            return Response.json(entries);
        }

        if (request.method === "POST") {
            const body = await request.json();

            const index = await addNameboardEntry(
                category as NameboardCategory,
                {
                    name: body.name,
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
            { error: "Nameboard request failed" },
            { status: 500 }
        );
    }
}