import { useEffect, useState } from "react";
import { type NameboardCategory, type NameboardEntry }  from "../../../../shared/types/nameboard"
import { getNameboardEntries } from "../../api/nameboard";

const DATE_ADJUSTMENT_FACTOR: number = 1000; // Seconds to milliseconds

export function Nameboard({ category, count }: { category: NameboardCategory, count: number }) {
    const [entries, setEntries] = useState<NameboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const data = await getNameboardEntries(
                    category,
                    0,
                    count - 1
                );

                if (!cancelled) {
                    setEntries(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError("Failed to load nameboard.");
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

    return (
        <div className="nameboard">
            <h2>{category}</h2>

            {loading && <p>Loading...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, index) => (
                            <tr key={`${entry.name}-${entry.timestamp}`}>
                                <td>{index + 1}</td>
                                <td>{entry.name}</td>
                                <td>
                                    {new Date(entry.timestamp * DATE_ADJUSTMENT_FACTOR).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}