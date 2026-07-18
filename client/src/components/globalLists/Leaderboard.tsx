import { useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import { defaultLeaderboardSortOrder, type LeaderboardCategory, type LeaderboardEntry, type LeaderboardSortOrder } from "../../../../shared/types/api/globalBoards/leaderboard";
import { getLeaderboardEntries, submitLeaderboardScore } from "../../api/leaderboard";
import type { EntriesState, GlobalBoardPropsBase, GlobalBoardSubTitlePropsBase } from "../../../types/api/globalBoards";

const DATE_ADJUSTMENT_FACTOR: number = 1000;

const INITIAL_LOAD_FAIL_TEXT : string = "Failed to load data";
const LOAD_MORE_FAIL_TEXT : string = "Failed to load more entries.";

const LOAD_MORE_DISTANCE_FROM_BOTTOM : number = 16

const getPlacementBadge = (index: number) => {
    const placementNumber: number = index + 1;

    const placementTextStyle: string = (() => {
        switch (placementNumber) {
            case 1:
                return "text-yellow-400";
            case 2:
                return "text-gray-300";
            case 3:
                return "text-amber-600";
            default:
                if (placementNumber <= 10) {
                    return "text-neutral-300/80";
                }
                return "text-neutral-400/60";
        }
    })();

    return (
        <div className={`${placementTextStyle} font-semibold`}>
            #{placementNumber}
        </div>
    );
};

export type LeaderboardProps = GlobalBoardPropsBase & {
    category: LeaderboardCategory,
    subTitles?: GlobalBoardSubTitlePropsBase & {
        score: string,
        placement: string
    }
    sortOrder?: LeaderboardSortOrder,
    entriesState?: EntriesState<LeaderboardEntry>,
    scoreFilterFunction? : (score : number) => string
}

export function Leaderboard({
    title,
    category,
    count,
    subTitles = {
        placement: "Rank",
        name: "Name",
        score: "Score",
        timestamp: "Achieved at"
    },
    sortOrder = defaultLeaderboardSortOrder,
    entriesState = useState<LeaderboardEntry[]>([]),
    scoreFilterFunction = (score : number) => `${score}`
}: LeaderboardProps) : [ReactNode, (score : number, name : string) => Promise<number>] {
    const [entries, setEntries] = entriesState;
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const scrollRef = useRef<HTMLDivElement>(null);
    const loadingMoreRef = useRef(false);
    const hasMoreRef = useRef(true);
    const entriesLengthRef = useRef(0);

    const loadEntries = useCallback(async () => {
        setLoading(true);
        setError(null);
        setHasMore(true);

        hasMoreRef.current = true;
        entriesLengthRef.current = 0;

        try {
            const data = await getLeaderboardEntries(
                category,
                0,
                count,
                sortOrder
            );

            setEntries(data);

            entriesLengthRef.current = data.length;

            const stillMore = data.length === count;

            setHasMore(stillMore);
            hasMoreRef.current = stillMore;
        } catch (err) {
            setError(INITIAL_LOAD_FAIL_TEXT);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [category, count, sortOrder, setEntries]);

    useEffect(() => {
        loadEntries();
    }, [loadEntries]);

    const loadMore = useCallback(async () => {
        if (loadingMoreRef.current || !hasMoreRef.current || entries.length == 0) return;

        loadingMoreRef.current = true;
        setLoadingMore(true);

        try {
            const start = entriesLengthRef.current;
            const end = start + count;

            const data = await getLeaderboardEntries(
                category,
                start,
                end,
                sortOrder
            );

            setEntries((prev) => [...prev, ...data]);

            entriesLengthRef.current += data.length;

            const stillMore = data.length === count;

            setHasMore(stillMore);
            hasMoreRef.current = stillMore;
        } catch (err) {
            setError(LOAD_MORE_FAIL_TEXT);
            console.error(err);
        } finally {
            loadingMoreRef.current = false;
            setLoadingMore(false);
        }
    }, [category, count, sortOrder, setEntries]);

    useEffect(() => {
        const el = scrollRef.current;

        if (!el || loading) return;

        const handleScroll = () => {
            const distanceFromBottom =
                el.scrollHeight - el.scrollTop - el.clientHeight;

            if (distanceFromBottom < LOAD_MORE_DISTANCE_FROM_BOTTOM) {
                loadMore();
            }
        };

        el.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            el.removeEventListener("scroll", handleScroll);
        };
    }, [loading, loadMore]);

    async function submitScore(score : number, name : string) : Promise<number> {
        try {
            const timestamp = Math.floor(Date.now() / DATE_ADJUSTMENT_FACTOR);
            const result = await submitLeaderboardScore(category, {
                name,
                score
            });

            const addedIndex = result["index"];
            
            if (typeof addedIndex != "number") {
                return -1;
            } else if (addedIndex < 0) {
                return addedIndex;
            }
            const newEntry : LeaderboardEntry = {
                timestamp,
                name,
                score
            };

            setEntries((prevEntries) => {
                const updated = [...prevEntries];
                updated.splice(addedIndex, 0, newEntry);
                return updated;
            });

            return addedIndex;
        } catch (err) {
            console.error(err);
        } 
        return -1;
    }

    return [(
        <div className="w-full max-w-2xl mx-auto bg-transparent rounded-xl border border-neutral-800 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-950/60">
                <h2 className="text-lg font-bold text-neutral-100 tracking-wide uppercase">
                    {title}
                </h2>
            </div>

            {loading ? (
                <p className="px-5 py-6 text-neutral-400 text-sm">
                    Loading...
                </p>
            ) : (
                <div>
                    <div
                        ref={scrollRef}
                        className="max-h-96 overflow-y-auto"
                    >
                        <table className="w-full border-collapse table-fixed">
                            <tbody>
                                <tr className="text-neutral-500 text-xs uppercase tracking-wider bg-neutral-950/40 text-white/75">
                                    <th className="px-5 py-0 text-left font-medium w-[15%]">
                                        {subTitles.placement}
                                    </th>

                                    <th className="px-5 py-0 text-center font-medium w-[30%]">
                                        {subTitles.name}
                                    </th>

                                    <th className="px-5 py-0 text-center font-medium w-[25%]">
                                        {subTitles.score}
                                    </th>

                                    <th className="px-5 py-0 text-right font-medium w-[20%]">
                                        {subTitles.timestamp}
                                    </th>
                                </tr>

                                {entries.map((entry, index) => (
                                    <tr
                                        key={`${entry.name}-${entry.timestamp}-${index}`}
                                        className={`border-t border-neutral-800 bg-neutral-800/40 hover:bg-neutral-500/10 transition-colors ${
                                            index < 3
                                                ? "bg-neutral-800/20"
                                                : ""
                                        }`}
                                    >
                                        <td className="px-5 py-3 text-left">
                                            {getPlacementBadge(index)}
                                        </td>

                                        <td className="px-5 py-3 text-center text-neutral-100 truncate">
                                            {entry.name}
                                        </td>

                                        <td className="px-5 py-3 text-neutral-200 text-sm text-center whitespace-nowrap font-semibold">
                                            {scoreFilterFunction(entry.score)}
                                        </td>

                                        <td className="px-5 py-3 text-neutral-500 text-sm text-right whitespace-nowrap">
                                            {(() => {
                                                const date = new Date(entry.timestamp * DATE_ADJUSTMENT_FACTOR);

                                                return (
                                                    <div className="px-5 py-3 text-neutral-300/70 text-sm text-right whitespace-nowrap">
                                                        <div>
                                                            {`${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`}
                                                        </div>

                                                        <div className="text-neutral-400/80 text-xs text-right whitespace-nowrap">
                                                            {`${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {loadingMore && (
                            <p className="px-5 py-3 text-neutral-500 text-xs text-center bg-neutral-950/40">
                                Loading more...
                            </p>
                        )}

                        {!hasMore && (
                            <p className="px-5 py-3 text-neutral-700 text-xs text-center bg-neutral-950/40">
                                {entries.length > 0 ? "That's about it..." : "Be the first!"}
                            </p>
                        )}

                        {error && (
                            <div className="px-5 py-6 text-center bg-neutral-950/40">
                                <p className="text-red-400/80 text-sm mb-3">
                                    {error}
                                </p>

                                <button
                                    onClick={loadEntries}
                                    className="px-4 py-2 rounded-md bg-neutral-800 text-neutral-200 text-sm hover:bg-neutral-700 transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    ),
    submitScore
    ]
}