import { useState } from "react";
import { ostData } from "../../constants/pages/exhibits/originalSoundtracks";
import { pages } from "../../constants/pages/pages";
import { GetPagesExcept } from "../../components/Pages";
import AudioPlayer from "../../components/effects/AudioPlayer";
import SEO from "../../components/effects/SEO";

export default function OriginalSoundtracksPage() {
    const Pages = GetPagesExcept(pages.ost, false)
    const [activeTrack, setActiveTrack] = useState<{categoryIndex: number, trackIndex: number} | null>(null)
 
    return (<>
        <SEO title="OST" description="Some of my original soundtracks"/>
        <div>
            <div className="min-h-screen w-full flex flex-col items-center px-6 py-16 text-white">
                <h1 className="text-4xl font-bold mb-4">Original Soundtracks</h1>
                <p className="text-white/70 mb-10 text-center max-w-xl">
                    A collection of some of my compositions
                </p>

                <div className="w-full max-w-3xl flex flex-col gap-12">
                    {ostData.map((category, cIndex) => (
                    <div key={category.name}>
                        {/* Category Title */}
                        <h2 className="text-2xl font-semibold mb-4 text-blue-100/90">
                        {category.name}
                        </h2>
                        <h3 key={category.name} className="pb-[25px] text-white/90">
                            {category.description}
                        </h3>

                        <div className="flex flex-col gap-4">
                        {category.tracks.map((track, tIndex) =>  {
                            const isActive = activeTrack?.categoryIndex === cIndex && activeTrack?.trackIndex === tIndex
                            return <div className={`border border-white/10 rounded-xl p-4 hover:bg-white/10 transition ${isActive ? "bg-blue-100/20" : "bg-white/5"}`}>
                                <div>
                                    <h3 className="text-lg font-medium">{track.title}</h3>

                                    {track.description && (
                                    <p className="text-white/60 text-sm">
                                        {track.description}
                                    </p>
                                    )}
                                </div>

                                <AudioPlayer
                                    src={track.file}
                                    isActive={isActive}
                                    onPlay={() =>
                                        setActiveTrack({ categoryIndex: cIndex, trackIndex: tIndex })
                                    }
                                    onStop={() => setActiveTrack(null)}
                                />
                            </div>
                        })}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            <Pages/>
        </div>
    </>);
}