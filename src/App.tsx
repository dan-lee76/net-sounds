// typescript
// file: `src/App.tsx`
import './App.css'
import { useEffect, useState } from 'react';

type Sound = {
    name: string;
    url: string;
    line: string;
    finalStop?: boolean;
    nextStop?: boolean;
    forStop?: boolean;
};

type FilterType = 'all' | 'final' | 'next' | 'for' | 'other';
type LineType = 'all' | 'Clifton' | 'Toton';

function formatName(input: string): string {
    return input
        .replace(/.*(?:the_next_stop_is_|this_is_|which_is_|is_)/i, '') // drop leading phrase
        .replace(/_which.*$/i, '')                                       // drop trailing "_which..." leftovers
        .replace(/(?:_[^_]+)?\.(wav|mp3|ogg)$/i, '')                     // remove trailing ".wav", "_t.wav", ".mp3", etc.
        .replace(/^_+|_+$/g, '')                                         // trim stray underscores
        .replace(/_/g, ' ')                                              // convert underscores to spaces
        .trim();
}

function App() {
    const [sounds, setSounds] = useState<Sound[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<FilterType>('all');
    const [line, setLine] = useState<LineType>('all');
    const [search, setSearch] = useState<string>('');

    useEffect(() => {
        let mounted = true;
        fetch('https://sounds.dan-lee1.workers.dev')
            .then(res => res.json())
            .then((data: Sound[]) => {
                if (!mounted) return;
                setSounds(data);
                setLoading(false);
            })
            .catch(() => {
                if (!mounted) return;
                setSounds(null);
                setLoading(false);
            });
        return () => { mounted = false; };
    }, []);

    const matchesFilter = (s: Sound) => {
        if (filter === 'all') return true;
        if (filter === 'final') return Boolean(s.finalStop);
        if (filter === 'next') return Boolean(s.nextStop);
        if (filter === 'for') return Boolean(s.forStop);
        // 'other' means none of the specific flags are set
        return !s.finalStop && !s.nextStop && !s.forStop;
    };

    const matechesLine = (s: Sound) => {
        if (line === 'all') return true;
        if (line === 'Clifton') {
            return formatName(s.line).includes('Clifton');
        }
        if (line === 'Toton') {
            return formatName(s.line).includes('Toton');
        }
        return false;
    }

    const matchesSearch = (s: Sound) => {
        if (!search.trim()) return true;
        const formatted = formatName(s.name).toLowerCase();
        return formatted.includes(search.trim().toLowerCase());
    };

    const play = (url: string) => {
        const audio = new Audio(url);
        audio.play();
    };

    const filtered = (sounds ?? []).filter(s => matchesFilter(s) && matchesSearch(s) && matechesLine(s));

    return (
        <>
            <h1 className="text-3xl text-white text-center p-3">Net Sound Board</h1>
            <p className="text-white text-center p-3">More sounds coming soon</p>
            <div className="items-center justify-center gap-4 p-4 grid grid-cols-2 ">
                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value as FilterType)}
                    className="p-2 rounded border-2 netGreen-text"
                >
                    <option value="all">All</option>
                    <option value="final">Next Final Stop</option>
                    <option value="next">Next Stop</option>
                    <option value="for">Tram For</option>
                    <option value="other">Current Stop</option>
                </select>

                <select
                    value={line}
                    onChange={e => setLine(e.target.value as LineType)}
                    className="p-2 rounded border-2 netGreen-text "
                >
                    <option value="all">All Lines</option>
                    <option value="Clifton">Clifton Line</option>
                    <option value="Toton">Toton Line</option>
                </select>

                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="p-2 rounded border-2 netGreen-text col-span-full"
                />
            </div>

            {loading && (
                <div className="flex justify-center items-center p-6">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="sr-only">Loading</span>
                </div>
            )}

            {!loading && sounds && (
                <div className="grid grid-cols-3 gap-4 p-4">
                    {filtered.map((sound, idx) => {
                        const labelPrefix = sound.finalStop ? 'Final Stop: '
                            : sound.nextStop ? 'Next Stop: '
                                : sound.forStop ? 'Tram For: '
                                    : 'This Is: ';
                        const content = `${labelPrefix}${formatName(sound.name)}`;

                        return (
                            <div
                                key={sound.url ?? idx}
                                className="p-4 rounded align-middle netGreen-bg cursor-pointer"
                                onClick={() => play(sound.url)}
                            >
                                <p className="text-white font-bold text-center">{content}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && !sounds && (
                <p className="text-center text-white p-4">No sounds available.</p>
            )}
        </>
    );
}

export default App;
