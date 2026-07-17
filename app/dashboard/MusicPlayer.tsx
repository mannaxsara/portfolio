import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const songs = [
    {
        title: "You Give Love A Bad Name",
        artist: "Bon Jovi",
        url: "https://open.spotify.com/track/0rmGAIH9LNJewFw7nKzZnc?si=3ae479350c3a4318",
        preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/15/3f/80/153f8055-1bc2-d175-a256-0551a72e1300/mzaf_7956543147956949979.plus.aac.p.m4a",
        cover: "/covers/music/bon_jovi.png",
    },
    {
        title: "Show Me How to Live",
        artist: "Audioslave",
        url: "https://open.spotify.com/track/1Qdnvn4XlmZANCVy3XjrQo?si=2ffd98190ea44361",
        preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/58/f5/ee/58f5ee56-03ab-79a8-2e25-d0e7f3adecd7/mzaf_11434766527149095597.plus.aac.p.m4a",
        cover: "/covers/music/audioslave.png",
    },
    {
        title: "Lover, You Should've Come Over",
        artist: "Jeff Buckley",
        url: "https://open.spotify.com/track/6Jv7kjGkhY2fT4yuBF3aTz?si=2e1d1e06d78640e0",
        preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/db/0c/4e/db0c4edc-9daa-e262-55b9-89984c3f6aa6/mzaf_16142695276315265640.plus.aac.p.m4a",
        cover: "/covers/music/jeff_buckley.png",
    },
    {
        title: "No One Wants To Die Alone",
        artist: "Benjamin Steer",
        url: "https://open.spotify.com/track/54Lie66KFAGm0g2GDXOVtg?si=6e4486b27da54457",
        preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/13/4c/e5/134ce59e-fa98-85ee-aa24-999993f46e15/mzaf_13339350165642401525.plus.aac.p.m4a",
        cover: "/covers/music/benjamin_steer.png",
    },
    {
        title: "Running In Circles",
        artist: "Dead Poet Society",
        url: "https://open.spotify.com/track/4pEU0NT64oiem9lDT7nuJn?si=d5673ccddb4241c4",
        preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/90/99/63/90996381-334e-b536-d769-a18ce30f8ba4/mzaf_3116663834459015610.plus.aac.p.m4a",
        cover: "/covers/music/dead_poet.png",
    },
];

const MusicPlayer = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isLooping, setIsLooping] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressBarRef = useRef<HTMLDivElement | null>(null);
    const currentSong = songs[currentIndex];
    const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Smooth volume fade helper (fadeDuration in ms)
    const fadeVolume = (targetVolume: number, fadeDuration: number, callback?: () => void) => {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        if (!audioRef.current) {
            if (callback) callback();
            return;
        }

        const startVolume = audioRef.current.volume;
        const steps = 15;
        const stepTime = fadeDuration / steps;
        const volumeStep = (targetVolume - startVolume) / steps;
        let currentStep = 0;

        fadeIntervalRef.current = setInterval(() => {
            if (!audioRef.current) {
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
                return;
            }
            currentStep++;
            const nextVol = startVolume + volumeStep * currentStep;
            audioRef.current.volume = Math.max(0, Math.min(1, nextVol));

            if (currentStep >= steps) {
                audioRef.current.volume = targetVolume;
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
                fadeIntervalRef.current = null;
                if (callback) callback();
            }
        }, stepTime);
    };

    // Load source on track change
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = currentSong.preview;
            audioRef.current.load();
            setCurrentTime(0);
            
            if (isPlaying) {
                // Play at 0 volume and fade up
                audioRef.current.volume = 0;
                audioRef.current.play().then(() => {
                    fadeVolume(volume, 400);
                }).catch((err) => {
                    console.log("Autoplay blocked:", err);
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.volume = volume;
            }
        }
    }, [currentIndex]);

    // Play/Pause handler with volume fading
    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            fadeVolume(0, 400, () => {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.volume = volume; // Restore to target volume for next play
                }
                setIsPlaying(false);
            });
        } else {
            audioRef.current.volume = 0;
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                fadeVolume(volume, 400);
            }).catch((err) => {
                console.log("Playback failed:", err);
            });
        }
    };

    const handleNext = () => {
        if (isPlaying) {
            fadeVolume(0, 250, () => {
                setCurrentIndex((prev) => (prev + 1) % songs.length);
            });
        } else {
            setCurrentIndex((prev) => (prev + 1) % songs.length);
        }
    };

    const handlePrev = () => {
        if (isPlaying) {
            fadeVolume(0, 250, () => {
                setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
            });
        } else {
            setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
        }
    };

    const handleEnded = () => {
        if (isLooping && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.volume = 0;
            audioRef.current.play().then(() => {
                fadeVolume(volume, 300);
            }).catch((err) => {
                console.log("Loop playback failed:", err);
            });
        } else {
            handleNext();
        }
    };

    // Seek track on progress click
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressBarRef.current || !audioRef.current || duration === 0) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = pct * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    // Volume change handler (clears active fade interval)
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }
        if (audioRef.current) {
            audioRef.current.volume = newVol;
        }
    };

    // Format seconds to mm:ss
    const formatTime = (time: number) => {
        if (isNaN(time)) return "00:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="w-full font-body cute-card overflow-hidden transition-all">
            <audio
                ref={audioRef}
                onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                onEnded={handleEnded}
            />

            {/* Custom Embedded CSS mapping directly to the theme variables for perfect cohesion */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes eq-bounce-1 {
                    0%, 100% { height: 4px; }
                    50% { height: 18px; }
                }
                @keyframes eq-bounce-2 {
                    0%, 100% { height: 16px; }
                    50% { height: 6px; }
                }
                @keyframes eq-bounce-3 {
                    0%, 100% { height: 8px; }
                    50% { height: 20px; }
                }
                @keyframes eq-bounce-4 {
                    0%, 100% { height: 18px; }
                    50% { height: 4px; }
                }
                @keyframes eq-bounce-5 {
                    0%, 100% { height: 10px; }
                    50% { height: 16px; }
                }
                .animate-eq-1 { animation: eq-bounce-1 0.7s steps(4) infinite; }
                .animate-eq-2 { animation: eq-bounce-2 0.9s steps(4) infinite; }
                .animate-eq-3 { animation: eq-bounce-3 0.6s steps(4) infinite; }
                .animate-eq-4 { animation: eq-bounce-4 0.8s steps(4) infinite; }
                .animate-eq-5 { animation: eq-bounce-5 0.7s steps(4) infinite; }

                /* Pixel Art Player Buttons matching website theme colors */
                .pixel-player-btn-play {
                    width: 50px;
                    height: 50px;
                    background-color: var(--color-light-pink, #f4e2ea);
                    border: 3px solid var(--color-rosewood, #af7491);
                    border-radius: 50%;
                    color: var(--color-raspberry, #773957);
                    box-shadow: 3px 3px 0px var(--color-shadow-color, #d489a8);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.1s ease-out;
                    outline: none;
                }
                .pixel-player-btn-play:hover {
                    background-color: var(--color-light-pink, #f4e2ea);
                    border-color: var(--color-raspberry, #773957);
                    transform: scale(1.05);
                }
                .pixel-player-btn-play:active {
                    transform: translate(2px, 2px);
                    box-shadow: 1px 1px 0px var(--color-shadow-color, #d489a8);
                }

                .pixel-player-btn-skip {
                    width: 36px;
                    height: 36px;
                    background-color: var(--color-light-pink, #f4e2ea);
                    border: 3px solid var(--color-rosewood, #af7491);
                    border-radius: 6px;
                    color: var(--color-rosewood, #af7491);
                    box-shadow: 2px 2px 0px var(--color-shadow-color, #d489a8);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.1s ease-out;
                    outline: none;
                }
                .pixel-player-btn-skip:hover {
                    background-color: var(--color-light-pink, #f4e2ea);
                    border-color: var(--color-raspberry, #773957);
                    color: var(--color-raspberry, #773957);
                }
                .pixel-player-btn-skip:active {
                    transform: translate(1px, 1px);
                    box-shadow: 1px 1px 0px var(--color-shadow-color, #d489a8);
                }

                /* Retro volume slider */
                .pixel-volume-slider {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 100%;
                    height: 8px;
                    background: var(--color-light-pink, #f4e2ea);
                    border: 2px solid var(--color-rosewood, #af7491);
                    border-radius: 2px;
                    outline: none;
                }
                .pixel-volume-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    background: var(--color-raspberry, #773957);
                    border: 2px solid var(--color-rosewood, #af7491);
                    border-radius: 1px;
                    cursor: pointer;
                }
                .pixel-volume-slider::-moz-range-thumb {
                    width: 12px;
                    height: 12px;
                    background: var(--color-raspberry, #773957);
                    border: 2px solid var(--color-rosewood, #af7491);
                    border-radius: 1px;
                    cursor: pointer;
                }

                /* High-contrast theme progress bar */
                .pixel-progress-bar {
                    height: 16px;
                    border: 3px solid var(--color-rosewood, #af7491);
                    background-color: var(--color-light-pink, #f4e2ea);
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    box-shadow: inset 2px 2px 0px rgba(0,0,0,0.05);
                }
                .pixel-progress-fill {
                    height: 100%;
                    background: repeating-linear-gradient(90deg, var(--color-raspberry, #773957) 0px, var(--color-raspberry, #773957) 4px, var(--color-rosewood, #af7491) 4px, var(--color-rosewood, #af7491) 8px);
                }
            `}} />

            {/* Titlebar */}
            <div 
                onDoubleClick={() => setIsMinimized(!isMinimized)}
                className="flex items-center justify-between px-3 py-1.5 bg-border-accent cursor-row-resize select-none"
                title="Double click to shade minimize/expand"
            >
                <span className="text-cream text-[11px] tracking-widest inline-flex items-center gap-1.5">
                    <i className="hn hn-music-solid" style={{ fontSize: 11 }} aria-hidden="true" />
                    music.exe
                </span>
                <div className="flex items-center gap-1.5">
                    <span className="text-cream text-[8px] font-bold opacity-75 font-mono mr-1">
                        {isMinimized ? "[+]" : "[-]"}
                    </span>
                    <span 
                        onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                        className="w-3 h-3 bg-cream border border-white/30 cursor-pointer hover:brightness-110 active:scale-95" 
                    />
                    <span className="w-3 h-3 bg-blush border border-white/30"></span>
                    <span className="w-3 h-3 bg-raspberry border border-white/30"></span>
                </div>
            </div>

            {/* Main content grid */}
            <div className={`transition-all duration-300 ease-in-out origin-top overflow-hidden ${
                isMinimized ? "max-h-0 opacity-0 scale-y-95 pointer-events-none p-0" : "max-h-[800px] opacity-100 scale-y-100"
            }`}>
                <div className="flex flex-col md:flex-row">
                
                {/* ── Player panel ── */}
                <div className="flex-1 p-5 flex flex-col gap-4 min-w-0">
                    <div className="text-highlight-color tracking-widest flex items-center gap-2 pixel-heading font-jersey text-2xl uppercase">
                        <i className="hn hn-music-solid" style={{ fontSize: 16 }} aria-hidden="true" />
                        <span>now playing</span>
                        <span className="flex-1 h-px bg-border-accent opacity-40"></span>
                        
                        {/* 16-bit Pixel Equalizer Visualizer */}
                        <span className="flex items-end gap-[2px] h-[22px] px-1 bg-black/10 border-2 border-rosewood/20 rounded-[2px] pointer-events-none">
                            <span 
                                className="w-[3px] bg-gradient-to-t from-green-500 via-yellow-400 to-red-500 animate-eq-1"
                                style={{ animationPlayState: isPlaying ? "running" : "paused" }}
                            />
                            <span 
                                className="w-[3px] bg-gradient-to-t from-green-500 via-yellow-400 to-red-500 animate-eq-2"
                                style={{ animationPlayState: isPlaying ? "running" : "paused" }}
                            />
                            <span 
                                className="w-[3px] bg-gradient-to-t from-green-500 via-yellow-400 to-red-500 animate-eq-3"
                                style={{ animationPlayState: isPlaying ? "running" : "paused" }}
                            />
                            <span 
                                className="w-[3px] bg-gradient-to-t from-green-500 via-yellow-400 to-red-500 animate-eq-4"
                                style={{ animationPlayState: isPlaying ? "running" : "paused" }}
                            />
                            <span 
                                className="w-[3px] bg-gradient-to-t from-green-500 via-yellow-400 to-red-500 animate-eq-5"
                                style={{ animationPlayState: isPlaying ? "running" : "paused" }}
                            />
                        </span>
                    </div>

                    {/* Cover + song info row */}
                    <div className="flex gap-4 items-center">
                        {/* Album art */}
                        <div className="flex-shrink-0 border-2 border-border-accent shadow-[3px_3px_0_var(--shadow-color)] overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSong.title}
                                    initial={{ x: 40, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -40, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Image
                                        src={currentSong.cover}
                                        alt={currentSong.title}
                                        width={110}
                                        height={110}
                                        className="block object-cover h-auto w-auto"
                                        style={{ width: "auto", height: "auto", maxWidth: 110 }}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Title + artist + Spotify linkout */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSong.title + "-info"}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-col gap-2 min-w-0 flex-1"
                            >
                                <div>
                                    <p className="pixel-heading font-jersey text-highlight-color leading-snug text-2xl truncate uppercase">
                                        {currentSong.title}
                                    </p>
                                    <p className="text-[11px] text-text-muted mt-1 truncate">
                                        {currentSong.artist}
                                    </p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span
                                        className="text-text-muted text-[9px] px-2 tracking-wide whitespace-nowrap border-y-[1.5px] border-border-accent"
                                    >
                                        30s preview
                                    </span>
                                    <a
                                        href={currentSong.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[9px] text-highlight-color hover:text-blush underline flex items-center gap-1 focus:outline-none"
                                    >
                                        {/* Spotify link out */}
                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.894-.982-.336.076-.67-.135-.746-.47-.076-.337.135-.67.472-.747 3.852-.878 7.144-.506 9.822 1.135.296.18.387.563.206.857zm1.225-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.08-1.182-.413.125-.85-.107-.975-.52-.125-.413.107-.85.52-.975 3.66-1.11 8.225-.563 11.35 1.358.367.226.487.707.26 1.074zm.107-2.846C14.474 8.71 8.79 8.52 5.5 9.52c-.51.155-1.047-.134-1.202-.644-.156-.51.134-1.047.644-1.202 3.793-1.15 10.063-.933 14.1 1.464.458.273.608.863.336 1.32-.27.458-.86.608-1.32.336z" />
                                        </svg>
                                        <span>Spotify</span>
                                    </a>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Progress bar + time display */}
                    <div className="flex flex-col gap-1.5 mt-1">
                        <div
                            ref={progressBarRef}
                            onClick={handleSeek}
                            className="pixel-progress-bar"
                        >
                            {/* Dithered theme-matching stripes progress fill */}
                            <div
                                className="pixel-progress-fill transition-all duration-100"
                                style={{
                                    width: `${progressPct}%`,
                                }}
                            />
                        </div>
                        {/* Time digital readout */}
                        <div className="flex justify-between items-center text-[10px] text-text-muted font-mono tracking-wide px-0.5">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Controls row: SkipPrev, Play/Pause, SkipNext, Volume */}
                    <div className="flex items-center justify-between gap-4 mt-2">
                        {/* Back, Play, Next, Loop */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrev}
                                className="pixel-player-btn-skip"
                                title="Previous Song"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M6 6h2v12H6zm12 12V6l-8.5 6 8.5 6z" />
                                </svg>
                            </button>
                            <button
                                onClick={togglePlay}
                                className="pixel-player-btn-play"
                                title={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? (
                                    /* Pause Icon */
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                    </svg>
                                ) : (
                                    /* Play Icon */
                                    <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>
                            <button
                                onClick={handleNext}
                                className="pixel-player-btn-skip"
                                title="Next Song"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M6 6v12l8.5-6L6 6zm10 0h2v12h-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setIsLooping(!isLooping)}
                                className={`pixel-player-btn-skip transition-all ${
                                    isLooping
                                        ? "text-highlight-color border-highlight-color bg-peach/40 shadow-[1px_1px_0_var(--shadow-color)] translate-x-[1px] translate-y-[1px]"
                                        : ""
                                }`}
                                title={isLooping ? "Loop: ON" : "Loop: OFF"}
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                                </svg>
                            </button>
                        </div>

                        {/* Pixelated Volume Slider */}
                        <div className="flex items-center gap-2 flex-1 max-w-[120px]">
                            {/* Speaker Icon */}
                            <svg className="w-4 h-4 fill-text-muted flex-shrink-0" viewBox="0 0 24 24">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                            </svg>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="pixel-volume-slider"
                            />
                        </div>
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="md:hidden h-px mx-5 bg-border-accent/40" />
                <div className="hidden md:block w-px self-stretch flex-shrink-0 bg-border-accent/40" />

                {/* ── Queue panel ── */}
                <div className="md:w-44 flex-shrink-0 p-5 flex flex-col gap-3">
                    <p className="text-highlight-color text-[12px] tracking-widest flex items-center gap-2">
                        <span className="pixel-heading font-jersey text-highlight-color text-xl uppercase tracking-widest">queue</span>
                        <span className="flex-1 h-px bg-border-accent opacity-40"></span>
                    </p>

                    <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-1 md:pb-0">
                        {songs.map((song, i) => {
                            const isActive = i === currentIndex;
                            return (
                                <button
                                    key={song.title}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`flex md:flex-row gap-2.5 items-center p-2 border-2 text-left
                                                transition-all focus:outline-none active:scale-95
                                                flex-shrink-0 md:flex-shrink md:w-full
                                                flex-col w-20
                                                ${isActive
                                                    ? "bg-peach/60 dark:bg-highlight-color/25 border-border-accent shadow-[2px_2px_0_var(--shadow-color)]"
                                                    : "bg-cream/70 dark:bg-bg-base border-border-accent/70 opacity-70 hover:opacity-100 hover:border-border-accent"
                                                }`}
                                >
                                    <div className="flex-shrink-0 border border-border-accent overflow-hidden">
                                        <Image
                                            src={song.cover}
                                            alt={song.title}
                                            width={32}
                                            height={32}
                                            className="block object-cover h-auto w-auto"
                                            style={{ width: "auto", height: "auto", maxWidth: 32 }}
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1 hidden md:block">
                                        <p className="text-[10px] text-text-base leading-snug truncate">
                                            {song.title}
                                        </p>
                                        <p className="text-[9px] text-text-muted mt-0.5 truncate">
                                            {song.artist}
                                        </p>
                                        {isActive && (
                                            <p className="text-[9px] text-highlight-color mt-0.5 tracking-wide">
                                                {isPlaying ? "▶ playing" : "⏸ paused"}
                                            </p>
                                        )}
                                    </div>

                                    <p className="md:hidden text-[6px] text-text-base text-center leading-snug w-full truncate">
                                        {song.title}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;