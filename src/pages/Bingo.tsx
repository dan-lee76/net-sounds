// typescript
// file: `src/App.tsx`
import '../App.css'
import { useEffect, useState } from 'react';

type Sound = {
    name: string;
    url: string;
    line: string;
    finalStop?: boolean;
    nextStop?: boolean;
    forStop?: boolean;
};


function formatName(input: string): string {
    return input
        .replace(/.*(?:the_next_stop_is_|this_is_|which_is_|is_)/i, '') // drop leading phrase
        .replace(/_which.*$/i, '')                                       // drop trailing "_which..." leftovers
        .replace(/(?:_[^_]+)?\.(wav|mp3|ogg)$/i, '')                     // remove trailing ".wav", "_t.wav", ".mp3", etc.
        .replace(/^_+|_+$/g, '')                                         // trim stray underscores
        .replace(/_/g, ' ')                                              // convert underscores to spaces
        .trim();
}

function Bingo() {
    const [sounds, setSounds] = useState<Sound[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    const randomSoundArray = (arr: Sound[], arraySize: number): Sound[] => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, arraySize);
    }

    useEffect(() => {
        let mounted = true;
        fetch('https://sounds.dan-lee1.workers.dev')
            .then(res => res.json())
            .then((data: Sound[]) => {
                if (!mounted) return;
                setSounds(randomSoundArray(data, 16));
                setLoading(false);
            })
            .catch(() => {
                if (!mounted) return;
                setSounds(null);
                setLoading(false);
            });
        return () => { mounted = false; };
    }, []);



    return (
        <>
            <h1 className="text-3xl text-white text-center p-3">Net Bingo Board</h1>

            {loading && (
                <div className="flex justify-center items-center p-6">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="sr-only">Loading</span>
                </div>
            )}

            {!loading && sounds && (
                <div className="grid grid-cols-4 gap-4 p-4">
                    {sounds.map((sound, idx) => {
                        const labelPrefix = sound.finalStop ? 'Final Stop: '
                            : sound.nextStop ? 'Next Stop: '
                                : sound.forStop ? 'Tram For: '
                                    : 'This Is: ';
                        const content = `${labelPrefix}${formatName(sound.name)}`;

                        return (
                            <button
                                key={sound.url ?? idx}
                                className="p-4 rounded align-middle netGreen-bg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={(e) => {
                                    const btn = e.currentTarget as HTMLButtonElement;
                                    btn.disabled = true;}}
                            >
                                <p className="text-white font-bold text-center">{content}</p>
                            </button>
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

export default Bingo;
