import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  isActive: boolean;
  onPlay: () => void;
  onStop: () => void;
};

export default function AudioPlayer({
  src,
  isActive,
  onPlay,
  onStop,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loop, setLoop] = useState(false);

  // Format time: m:ss
  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Sync play/pause with parent state
  useEffect(() => {
    if (!audioRef.current) return;

    if (isActive) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isActive]);

  const togglePlay = () => {
    if (isActive) {
      onStop();
    } else {
      onPlay();
    }
  };

  // Progress tracking
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  // Volume
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const v = Number(e.target.value);
    audioRef.current.volume = v;
    setVolume(v);
  };

  return (
    <div className="mt-3 flex flex-col gap-3">
      <audio
        ref={audioRef}
        src={src}
        loop={loop}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={onStop}
      />

      {/* Controls Row */}
      <div className="flex items-center gap-3">
        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 transition text-sm"
        >
          {isActive ? "Pause" : "Play"}
        </button>

        {/* Loop Toggle */}
        <button
          onClick={() => setLoop(!loop)}
          className={`px-2 py-1 rounded-md text-sm transition ${
            loop
              ? "bg-blue-400/30 text-blue-200 border border-blue-300/30"
              : "bg-white/10"
          }`}
        >
          Loop
        </button>

        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={progress}
          onChange={handleSeek}
          className="flex-1 to-blue-50"
        />

        {/* Time */}
        <span className="text-xs text-white/60 tabular-nums w-24 text-right">
          {formatTime(progress)} / {formatTime(duration)}
        </span>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/60">Vol</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolume}
          className="w-32 to-blue-300"
        />
      </div>
    </div>
  );
}