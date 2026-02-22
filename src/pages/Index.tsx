import { useState, useRef, useCallback } from "react";
import { SkipBack, SkipForward, Play, Pause, Volume2, VolumeX } from "lucide-react";
import ReactPlayer from "react-player";
import logo from "@/assets/logo.png";
import cover1 from "@/assets/cover1.jpg";
import cover2 from "@/assets/cover2.jpg";
import cover3 from "@/assets/cover3.jpg";
import title1 from "@/assets/title1.jpg";
import title2 from "@/assets/title2.jpg";
import title3 from "@/assets/title3.jpg";

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  videoUrl: string;
  coverUrl: string;
  titleUrl: string;
  prototype: string;
}

const tracks: Track[] = [
  { id: 1, title: "Fast & Furious. Smooth. On-chain", artist: "MagicBlock", duration: "2:07", videoUrl: "https://www.youtube.com/watch?v=MI1hEPVODbA", coverUrl: cover1, titleUrl: title1, prototype: "Luis Fonsi - Despacito" },
  { id: 2, title: "Magic Moments", artist: "MagicBlock", duration: "2:34", videoUrl: "https://www.youtube.com/watch?v=ZmNj2tOAy5U", coverUrl: cover2, titleUrl: title2, prototype: "Perry Como - Magic Moments" },
  { id: 3, title: "Fast, Loud & On-Chain!", artist: "MagicBlock", duration: "2:07", videoUrl: "https://www.youtube.com/watch?v=oG1mDdZwQj0", coverUrl: cover3, titleUrl: title3, prototype: "The Offspring - The Kids Aren't Alright" },
];

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const Index = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [playKey, setPlayKey] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  const track = tracks[currentTrack ?? 0];

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => {
      if (!prev) {
        // Force remount player to bypass mobile autoplay restrictions
        setPlayKey((k) => k + 1);
      }
      return !prev;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentTrack((p) => (p ?? 0) === 0 ? tracks.length - 1 : (p ?? 0) - 1);
    setIsPlaying(true);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentTrack((p) => (p ?? 0) === tracks.length - 1 ? 0 : (p ?? 0) + 1);
    setIsPlaying(true);
  }, []);

  const handleTrackClick = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    const el = playerRef.current;
    if (el && el.duration) {
      el.currentTime = fraction * el.duration;
    }
    setProgress(fraction);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky top section */}
      <div className="sticky top-0 z-50 glass-panel border-b neon-border-solid">
        {/* Header */}
        <header className="flex items-center justify-between px-4 md:px-8 py-3 md:py-2 border-b border-muted/30">
          <div className="flex items-center gap-3">
            <img src={logo} alt="MagicBlock Records" className="h-8 md:h-10 w-auto" />
          </div>
          <span className="text-muted-foreground text-xs md:text-sm transition-all duration-300 neon-hover-glow cursor-default">
            Created by Agrobaks
          </span>
        </header>

        {/* Control Center */}
        <div className="flex flex-col md:flex-row gap-3 p-3 md:p-2">
          {/* Left: Player Controls (40%) */}
          <div className="w-full md:w-[40%] flex-shrink-0 p-5 md:px-4 md:py-2 border border-muted/30 neon-border-solid rounded-lg flex flex-col justify-center">
            {/* Cover + Info */}
            <div className="flex gap-4">
              <img
                src={track.titleUrl}
                alt={track.title}
                className="w-28 h-28 md:w-[140px] md:h-[140px] rounded-lg object-cover shadow-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className="text-xs font-semibold tracking-widest text-neon-purple uppercase mb-1">Now Playing</p>
                <h2 className="text-lg md:text-2xl font-extrabold truncate">{track.title}</h2>
                <p className="text-sm md:text-base text-muted-foreground truncate">{track.artist}</p>
              </div>
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-5 md:gap-7 mt-4 md:mt-2 w-full pl-4">
              <button onClick={handlePrev} className="text-muted-foreground hover:text-foreground transition-colors">
                <SkipBack className="w-5 h-5 md:w-[30px] md:h-[30px]" />
              </button>
              <button
                onClick={handlePlayPause}
                className="w-10 h-10 md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center play-btn-glow text-primary-foreground transition-all flex-shrink-0"
              >
                {isPlaying ? <Pause className="w-[18px] h-[18px] md:w-[27px] md:h-[27px]" /> : <Play className="w-[18px] h-[18px] md:w-[27px] md:h-[27px] ml-0.5" />}
              </button>
              <button onClick={handleNext} className="text-muted-foreground hover:text-foreground transition-colors">
                <SkipForward className="w-5 h-5 md:w-[30px] md:h-[30px]" />
              </button>
              <div className="flex items-center gap-2 md:gap-3 ml-auto mr-4">
                <button onClick={() => setMuted(!muted)} className="text-muted-foreground hover:text-foreground transition-colors">
                  {muted || volume === 0 ? <VolumeX className="w-4 h-4 md:w-6 md:h-6" /> : <Volume2 className="w-4 h-4 md:w-6 md:h-6" />}
                </button>
                <input
                  type="range" min="0" max="1" step="0.01"
                  value={muted ? 0 : volume}
                  onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                  className="w-20 md:w-28 h-1 md:h-1.5 accent-neon-purple cursor-pointer"
                />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 md:mt-5 flex items-center gap-3 text-xs text-muted-foreground w-full">
              <span className="w-10 text-right tabular-nums">{formatTime(played)}</span>
              <div className="flex-1 h-1 md:h-1.5 bg-muted rounded-full cursor-pointer relative" onClick={handleSeek}>
                <div className="h-full progress-neon rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
              </div>
              <span className="w-10 tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Video Player (60%) */}
          <div className="w-full md:w-[60%] flex-shrink-0 border border-muted/30 neon-border-solid rounded-lg overflow-hidden">
            <div className="aspect-video">
              <ReactPlayer
                key={`${currentTrack}-${playKey}`}
                ref={playerRef}
                src={track.videoUrl}
                playing={isPlaying}
                volume={muted ? 0 : volume}
                onTimeUpdate={(e: React.SyntheticEvent<HTMLVideoElement>) => {
                  const el = e.currentTarget;
                  if (el.duration) {
                    setPlayed(el.currentTime);
                    setProgress(el.currentTime / el.duration);
                  }
                }}
                onLoadedMetadata={(e: React.SyntheticEvent<HTMLVideoElement>) => setDuration(e.currentTarget.duration)}
                onEnded={handleNext}
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="max-w-full">
        {/* Table header */}
        <div className="grid grid-cols-[3rem_1fr_5rem] md:grid-cols-[4rem_1fr_1fr_6rem] px-4 md:px-8 py-3 border-b border-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          <span>#</span>
          <span>Title</span>
          <span className="hidden md:block">Inspiration</span>
          <span className="text-right">Duration</span>
        </div>

        {/* Tracks */}
        {tracks.map((t, i) => (
          <div
            key={t.id}
            onClick={() => handleTrackClick(i)}
            className={`grid grid-cols-[3rem_1fr_5rem] md:grid-cols-[4rem_1fr_1fr_6rem] px-4 md:px-8 py-3 cursor-pointer transition-all duration-200 track-row-hover border-b border-muted/10 ${
              i === currentTrack ? "bg-muted/20" : ""
            }`}
          >
            <span className={`flex items-center text-sm tabular-nums ${i === currentTrack ? "text-neon-purple font-bold" : "text-muted-foreground"}`}>
              {i + 1}
            </span>
            <div className="flex items-center gap-3 min-w-0">
              <img src={t.titleUrl} alt={t.title} className="w-10 h-10 rounded object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className={`text-sm font-semibold truncate ${i === currentTrack ? "text-neon-purple" : ""}`}>{t.title}</p>
                <p className="text-xs text-muted-foreground truncate">{t.artist}</p>
              </div>
            </div>
            <span className="hidden md:flex items-center text-xs text-muted-foreground/70 truncate">{t.prototype}</span>
            <span className="flex items-center justify-end text-sm text-muted-foreground tabular-nums">{t.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
