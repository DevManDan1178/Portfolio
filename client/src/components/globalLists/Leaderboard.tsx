import { useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import { type LeaderboardCategory, type LeaderboardEntry } from "../../../../shared/types/api/globalBoards/leaderboard";
import { getLeaderboardEntries, submitLeaderboardScore } from "../../api/leaderboard";
import type { EntriesState, GlobalBoardPropsBase, GlobalBoardSubTitlePropsBase } from "../../../types/api/globalBoards";
import { deletedIndexKey, indexFromTopKey } from "../../../../shared/constants/api/globalBoards";
import { postQueryNetworkErrorCode, postQueryRefusedErrorCode } from "../../constants/components/globalLists";
import { type Theme, getThemeStyles } from "../../style";

const DATE_ADJUSTMENT_FACTOR: number = 1000;

const INITIAL_LOAD_FAIL_TEXT : string = "Failed to load data";
const LOAD_MORE_FAIL_TEXT : string = "Failed to load more entries.";

const NO_MORE_ENTRIES_TEXT : string = "Thats about it...";
const NO_ENTRIES_TEXT : string = "Nobody's here. Be the first!";

const LOAD_MORE_DISTANCE_FROM_BOTTOM : number = 16

const getPlacementBadge = (index: number, theme : Theme) => {
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
        <div className={`${getThemeStyles(theme)} ${placementTextStyle} font-semibold`}>
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
    entriesState?: EntriesState<LeaderboardEntry>,
    scoreFormatFunction? : (score : number) => string,
    scoreStorageFactor? : number,
    theme? : Theme
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
    entriesState = useState<LeaderboardEntry[]>([]),
    scoreFormatFunction = (score : number) => `${score}`,
    scoreStorageFactor = 1,
    theme = {}
}: LeaderboardProps) : [ReactNode, (score : number, name : string) => Promise<number>] {
    const [entries, setEntries] = entriesState;
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const scrollRef = useRef<HTMLDivElement>(null);
    const loadingMoreRef = useRef(false);
    const hasMoreRef = useRef(true);
    const loadedRef = useRef(false);

    const loadEntries = useCallback(async () => {
        setLoading(true);
        setError(null);
        setHasMore(true);

        hasMoreRef.current = true;

        try {
            const data = await getLeaderboardEntries(
                category,
                0,
                count,
            );

            setEntries(data);

            const stillMore = data.length === count;

            setHasMore(stillMore);
            hasMoreRef.current = stillMore;
        } catch (err) {
            setError(INITIAL_LOAD_FAIL_TEXT);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [category, count, setEntries]);

    useEffect(() => {
        if (loadedRef.current) return;

        loadedRef.current = true;
        loadEntries();
    }, [loadEntries]);

    function getFormattedScore(score : number) {
        return scoreFormatFunction(score / scoreStorageFactor);
    }

    const loadMore = useCallback(async () => {
        if (!loadedRef.current || loadingMoreRef.current || !hasMoreRef.current || entries.length <= 0) return;

        loadingMoreRef.current = true;
        setLoadingMore(true);

        try {
            const start = entries.length;
            const end = start + count;

            const data = await getLeaderboardEntries(
                category,
                start,
                end,
            );

            setEntries((prev) => [...prev, ...data]);

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
    }, [category, count, entries, setEntries]);

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

    async function submitScore(preprocessedScore : number, name : string) : Promise<number> {
        const score = Math.round(preprocessedScore * scoreStorageFactor);
        try {
            const timestamp = Math.floor(Date.now() / DATE_ADJUSTMENT_FACTOR);
            const result = await submitLeaderboardScore(category, {
                name,
                score: Math.round(score)
            });

            const index = result[indexFromTopKey];
            const deletedIndex = result[deletedIndexKey];
            
            if (typeof index != "number") {
                return postQueryNetworkErrorCode;
            } else if (index < 0) {
                return postQueryRefusedErrorCode;
            }
            const newEntry : LeaderboardEntry = {
                timestamp,
                name,
                score
            };

           setEntries((prevEntries) => {
                const updated = [...prevEntries];

                if (typeof deletedIndex === "number" && deletedIndex >= 0) {
                    updated.splice(deletedIndex, 1);
                }

                updated.splice(index, 0, newEntry);

                return updated;
            });

            return index;
        } catch (err) {
            console.error(err);
        } 
        return -1;
    }

    return [(
        <div className="w-full max-w-2xl mx-auto bg-transparent rounded-xl border border-neutral-800 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-950/60">
                <h2 className={`text-lg font-bold text-neutral-100 tracking-wide uppercase ${getThemeStyles(theme)}`}>
                    {title}
                </h2>
            </div>

            <div>
                <div
                    ref={scrollRef}
                    className="max-h-96 overflow-y-auto"
                >
                    <table className="w-full border-collapse table-fixed">
                        <tbody>
                            <tr className="text-neutral-500 text-xs uppercase tracking-wider bg-neutral-950/40 text-white/75">
                                <th className={`${getThemeStyles(theme)} px-5 py-0 text-left font-medium w-[15%]`}>
                                    {subTitles.placement}
                                </th>

                                <th className={`${getThemeStyles(theme)} px-5 py-0 text-center font-medium w-[30%]`}>
                                    {subTitles.name}
                                </th>

                                <th className={`${getThemeStyles(theme)} px-5 py-0 text-center font-medium w-[25%]`}>
                                    {subTitles.score}
                                </th>

                                <th className={`${getThemeStyles(theme)} px-5 py-0 text-right font-medium w-[20%]`}>
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
                                        {getPlacementBadge(index, theme)}
                                    </td>

                                    <td className={`${getThemeStyles(theme)} px-5 py-3 text-center text-neutral-100 truncate`}>
                                        {entry.name}
                                    </td>

                                    <td className={`${getThemeStyles(theme)} px-5 py-3 text-neutral-200 text-sm text-center whitespace-nowrap font-semibold`}>
                                        {getFormattedScore(entry.score)}
                                    </td>

                                    <td className="px-5 py-3 text-neutral-500 text-sm text-right whitespace-nowrap">
                                        {(() => {
                                            const date = new Date(entry.timestamp * DATE_ADJUSTMENT_FACTOR);

                                            return (
                                                <div className={`${getThemeStyles(theme)} px-5 py-3 text-neutral-300/70 text-sm text-right whitespace-nowrap`}>
                                                    {`${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`}

                                                    <div className={`${getThemeStyles(theme)}  text-neutral-400/80 text-xs text-right whitespace-nowrap`}>
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
                    {loadingMore || loading && (
                        <p className={`${getThemeStyles(theme)} px-5 py-3 text-neutral-500 text-xs text-center bg-neutral-950/40`}>
                            Loading...
                        </p>
                    )}

                    {!hasMore && (
                        <p className={`${getThemeStyles(theme)} px-5 py-3 text-neutral-500 text-xs text-center bg-neutral-950/40`}>
                            {entries.length > 0 ? NO_MORE_ENTRIES_TEXT : NO_ENTRIES_TEXT}
                        </p>
                    )}

                    {error && (
                        <div className="px-5 py-6 text-center bg-neutral-950/40">
                            <p className={`${getThemeStyles(theme)} text-red-400/80 text-sm mb-3`}>
                                {error}
                            </p>

                            <button
                                onClick={loadEntries}
                                className={`${getThemeStyles(theme)} px-4 py-2 rounded-md bg-neutral-800 text-neutral-200 text-sm hover:bg-neutral-700 transition-colors`}
                            >
                                Retry
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ),
    submitScore
    ]
}