import { useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import { defaultNameboardQueryOrder, type NameboardCategory, type NameboardEntry, type NameboardQueryOrder } from "../../../../shared/types/api/globalBoards/nameboard";
import { getNameboardEntries, submitNameboardEntry } from "../../api/nameboard";
import type { EntriesState, GlobalBoardPropsBase, GlobalBoardSubTitlePropsBase } from "../../../types/api/globalBoards";
import { indexFromBottomKey, indexFromTopKey } from "../../../../shared/constants/api/globalBoards";
import { postQueryNetworkErrorCode, postQueryRefusedErrorCode } from "../../constants/components/globalLists";
import { type Theme, getThemeStyles } from "../../style";

const DATE_ADJUSTMENT_FACTOR: number = 1000;

const INITIAL_LOAD_FAIL_TEXT : string = "Failed to load data";
const LOAD_MORE_FAIL_TEXT : string = "Failed to load more entries.";

const NO_MORE_ENTRIES_TEXT : string = "Thats about it...";
const NO_ENTRIES_TEXT : string =  "Nobody's here. Be the first!";

const LOAD_MORE_DISTANCE_FROM_BOTTOM : number = 16

export type NameboardProps = GlobalBoardPropsBase & {
    category: NameboardCategory,
    boardSubTitles?: GlobalBoardSubTitlePropsBase,
    queryOrder?: NameboardQueryOrder,
    entriesState?: EntriesState<NameboardEntry>,
    theme? : Theme
}


const defaultSubtitles = {
    name: "Name",
    timestamp: "Achieved at"
}
export function Nameboard({
    title,
    category,
    count,
    boardSubTitles,
    queryOrder = defaultNameboardQueryOrder,
    entriesState = useState<NameboardEntry[]>([]),
    theme = {}
}: NameboardProps) : [ReactNode, (name : string) => Promise<number>] {
    const subTitles = {...defaultSubtitles, ...boardSubTitles}
    const [entries, setEntries] = entriesState;
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const scrollRef = useRef<HTMLDivElement>(null);
    const loadingMoreRef = useRef(false);
    const hasMoreRef = useRef(true);
    const entriesLengthRef = useRef(0);
    const loadedRef = useRef(false);

    const loadEntries = useCallback(async () => {
        setLoading(true);
        setError(null);
        setHasMore(true);

        hasMoreRef.current = true;
        entriesLengthRef.current = 0;

        try {
            const data = await getNameboardEntries(
                category,
                0,
                count,
                queryOrder
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
    }, [category, count, queryOrder, setEntries]);

    useEffect(() => {
        if (loadedRef.current) return;

        loadedRef.current = true;
        loadEntries();
    }, [loadEntries]);

    const loadMore = useCallback(async () => {
        if (!loadedRef.current || loadingMoreRef.current || !hasMoreRef.current || entries.length == 0) return;

        loadingMoreRef.current = true;
        setLoadingMore(true);

        try {
            const start = entriesLengthRef.current;
            const end = start + count - 1;

            const data = await getNameboardEntries(
                category,
                start,
                end,
                queryOrder
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
    }, [category, count, queryOrder, setEntries]);

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

    async function submitEntry(name : string) : Promise<number> {
        try {
            const timestamp = Math.floor(Date.now() / DATE_ADJUSTMENT_FACTOR);
            const result = await submitNameboardEntry(category, {
                name,
            });

            const indexFromTop = result[indexFromTopKey];
            const indexFromBottom = result[indexFromBottomKey]
            
            
            if (typeof indexFromTop != "number" || typeof indexFromBottom != "number") {
                return postQueryNetworkErrorCode;
            } else if (indexFromTop < 0 || indexFromBottom < 0) {
                return postQueryRefusedErrorCode;
            }

            const index = queryOrder == defaultNameboardQueryOrder ? indexFromTop : indexFromBottom;

            const newEntry : NameboardEntry = {
                timestamp,
                name,
            };

            setEntries((prevEntries) => {
                const updated = [...prevEntries];
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
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="text-neutral-500 text-xs uppercase tracking-wider bg-neutral-950/40 text-white/75">
                                <th className={`${getThemeStyles(theme)} px-10 py-0 text-left font-medium w-[60%]`}>
                                    {subTitles.name}
                                </th>

                                <th className={`${getThemeStyles(theme)} px-10 py-0 text-center font-medium w-[40%]`}>
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
                                    <td className={`${getThemeStyles(theme)} px-10 py-3 text-left text-neutral-100 font-bold truncate`}>
                                        {entry.name}
                                    </td>

                                    <td className="px-5 py-3 text-neutral-300 text-sm text-center whitespace-nowrap">
                                        {(() => {
                                            const date = new Date(
                                                entry.timestamp *
                                                    DATE_ADJUSTMENT_FACTOR
                                            );

                                            return (
                                                <div className={`${getThemeStyles(theme)} px-5 py-3 text-neutral-300/70 text-sm text-right whitespace-nowrap`}>
                                                    <div>
                                                        {`${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`}
                                                    </div>

                                                    <div className={`${getThemeStyles(theme)} text-neutral-400/80 text-xs text-right whitespace-nowrap`}>
                                                        {`${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {loading || loadingMore && (
                        <p className={`${getThemeStyles(theme)} px-5 py-3 text-neutral-500 text-xs text-center bg-neutral-950/40`}>
                            Loading more...
                        </p>
                    )}

                    {!hasMore && (
                        <p className={`${getThemeStyles(theme)} px-5 py-3 text-neutral-700 text-xs text-center bg-neutral-950/40`}>
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
        submitEntry
    ]
}