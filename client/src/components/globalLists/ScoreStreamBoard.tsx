import { useEffect, useState, useCallback, useRef } from "react";
import { type ScoreStreamCategory, type ScoreStreamEntry } from "../../../../shared/types/scoreStreams";
import { getScoreStreamEntries } from "../../api/scoreStream";

const DATE_ADJUSTMENT_FACTOR: number = 1000; // Seconds to milliseconds

export function ScoreStreamBoard({ title, category, count }: { title: string, category: ScoreStreamCategory, count: number }) {
    const [entries, setEntries] = useState<ScoreStreamEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const scrollRef = useRef<HTMLDivElement>(null);
    const loadingMoreRef = useRef(false);
    const hasMoreRef = useRef(true);
    const entriesLengthRef = useRef(0);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            setHasMore(true);
            hasMoreRef.current = true;

            try {
                const data = await getScoreStreamEntries(
                    category,
                    0,
                    count
                );

                if (!cancelled) {
                    setEntries(data);
                    entriesLengthRef.current = data.length;
                    const stillMore = data.length === count;
                    setHasMore(stillMore);
                    hasMoreRef.current = stillMore;
                }
            } catch (err) {
                if (!cancelled) {
                    setError("Failed to load leaderboard.");
                    console.error(err);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [category, count]);

    const loadMore = useCallback(async () => {
        if (loadingMoreRef.current || !hasMoreRef.current) return;

        loadingMoreRef.current = true;
        setLoadingMore(true);

        try {
            const start = entriesLengthRef.current;
            const end = start + count;
            const data = await getScoreStreamEntries(category, start, end);

            setEntries((prev) => [...prev, ...data]);
            entriesLengthRef.current += data.length;
            const stillMore = data.length === count;
            setHasMore(stillMore);
            hasMoreRef.current = stillMore;
        } catch (err) {
            setError("Failed to load more entries.");
            console.error(err);
        } finally {
            loadingMoreRef.current = false;
            setLoadingMore(false);
        }
    }, [category, count]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el || loading) return;

        const handleScroll = () => {
            const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
            if (distanceFromBottom < 32) {
                loadMore();
            }
        };

        el.addEventListener("scroll", handleScroll);

        // Also check immediately in case content doesn't fill the container
        handleScroll();

        return () => el.removeEventListener("scroll", handleScroll);
    }, [loading, loadMore]);

    return (
        <div className="w-full max-w-2xl mx-auto bg-transparent rounded-xl border border-neutral-800 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-950">
                <h2 className="text-lg font-bold text-neutral-100 tracking-wide uppercase">
                    {title}
                </h2>
            </div>

            {loading && (
                <p className="px-5 py-6 text-neutral-400 text-sm">Loading...</p>
            )}

            {error && (
                <p className="px-5 py-6 text-red-400 text-sm">{error}</p>
            )}

            {!loading && !error && (
                <div>
                    <div
                        ref={scrollRef}
                        className="max-h-96 overflow-y-auto"
                    >
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr className="text-neutral-500 text-xs uppercase tracking-wider">
                                    <th className="py-0 text-left font-medium w-60"></th>
                                    <th className="py-0 text-right font-medium"></th>
                                    <th className="py-0 text-right font-medium"></th>
                                </tr>  
                            </tbody>
                            
                            <tbody>
                                {entries.map((entry, index) => (
                                    <tr
                                        key={`${entry.name}-${entry.timestamp}-${index}`}
                                        className={`border-t border-neutral-800 bg-neutral-800/40 hover:bg-neutral-500/10 transition-colors ${
                                            index < 3 ? "bg-neutral-800/20" : ""
                                        }`}
                                    >
                                        <td className="px-5 py-3 text-neutral-100 truncate max-w-[1px]">
                                            {entry.name}
                                        </td>
                                        <td className="px-5 py-3 text-neutral-200 text-sm text-right whitespace-nowrap font-semibold">
                                            {entry.score}
                                        </td>
                                        <td className="px-5 py-3 text-neutral-500 text-sm text-right whitespace-nowrap">
                                            {(() => {
                                                const date: Date = new Date(entry.timestamp * DATE_ADJUSTMENT_FACTOR);
                                                return (
                                                    <div className="px-5 py-3 text-neutral-500 text-sm text-right whitespace-nowrap">
                                                        <div>
                                                            {`${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`}
                                                        </div>

                                                        <div className="text-neutral-600 text-xs text-right whitespace-nowrap">
                                                            {`${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`}
                                                        </div>
                                                    </div>
                                                )
                                            })()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {loadingMore && (
                            <p className="px-5 py-3 text-neutral-500 text-xs text-center">
                                Loading more...
                            </p>
                        )}

                        {!hasMore && entries.length > 0 && (
                            <p className="px-5 py-3 text-neutral-700 text-xs text-center">
                                That's about it...
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}