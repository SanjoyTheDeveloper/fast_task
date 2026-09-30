"use client";

import * as React from "react";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  CloudRain,
  Flame,
  Brain,
  Wind,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Sliders,
  ChevronDown,
} from "lucide-react";
import { ZenSoundEngine, SoundType } from "@/lib/zen-sound-engine";
import type { Task } from "@/types/task";
import { toast } from "sonner";

export type ZenTheme = "cosmic" | "rain" | "hearth" | "obsidian";
export type ZenTimerMode = "25m" | "50m" | "90m" | "5m" | "stopwatch";

interface ZenFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks?: Task[];
  initialTask?: Task | null;
  onCompleteTask?: (task: Task) => void;
}

const MANTRAS = [
  "One problem at a time. Total flow.",
  "Deep work is the superpower of the 21st century.",
  "Focus is about saying no to distractions to make room for mastery.",
  "Discipline today equals freedom tomorrow.",
  "Breathe in calm, exhale doubt.",
  "Consistent small efforts compound into academic excellence.",
];

export function ZenFlowModal({
  isOpen,
  onClose,
  tasks = [],
  initialTask = null,
  onCompleteTask,
}: ZenFlowModalProps) {
  // Theme & State
  const [theme, setTheme] = React.useState<ZenTheme>("cosmic");
  const [timerMode, setTimerMode] = React.useState<ZenTimerMode>("25m");
  const [isRunning, setIsRunning] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(25 * 60);
  const [totalSeconds, setTotalSeconds] = React.useState(25 * 60);
  const [elapsedStopwatch, setElapsedStopwatch] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Active Focus Task
  const [currentTask, setCurrentTask] = React.useState<Task | null>(initialTask);
  const [isTaskSelectorOpen, setIsTaskSelectorOpen] = React.useState(false);

  // Sound Engine State
  const soundEngineRef = React.useRef<ZenSoundEngine | null>(null);
  const [soundStates, setSoundStates] = React.useState<Record<SoundType, boolean>>({
    rain: false,
    campfire: false,
    binaural: false,
    wind: false,
  });
  const [soundVolumes, setSoundVolumes] = React.useState<Record<SoundType, number>>({
    rain: 0.6,
    campfire: 0.5,
    binaural: 0.35,
    wind: 0.4,
  });
  const [isSoundPanelOpen, setIsSoundPanelOpen] = React.useState(false);
  const [masterVolume, setMasterVolume] = React.useState(0.8);
  const [mantraIndex, setMantraIndex] = React.useState(0);

  // Initialize Sound Engine
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      soundEngineRef.current = new ZenSoundEngine();
    }
    return () => {
      soundEngineRef.current?.stopAll();
    };
  }, []);

  // Update initialTask if changed
  React.useEffect(() => {
    if (initialTask) setCurrentTask(initialTask);
  }, [initialTask]);

  // Rotate mantras periodically
  React.useEffect(() => {
    const mantraInterval = setInterval(() => {
      setMantraIndex((prev) => (prev + 1) % MANTRAS.length);
    }, 24000);
    return () => clearInterval(mantraInterval);
  }, []);

  // Mode change handler
  const handleModeChange = (mode: ZenTimerMode) => {
    setTimerMode(mode);
    setIsRunning(false);
    let dur = 25 * 60;
    if (mode === "25m") dur = 25 * 60;
    else if (mode === "50m") dur = 50 * 60;
    else if (mode === "90m") dur = 90 * 60;
    else if (mode === "5m") dur = 5 * 60;
    else if (mode === "stopwatch") dur = 0;

    setSecondsLeft(dur);
    setTotalSeconds(dur);
    setElapsedStopwatch(0);
  };

  // Timer countdown / countup
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (timerMode === "stopwatch") {
          setElapsedStopwatch((prev) => prev + 1);
        } else {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              setIsRunning(false);
              playChime();
              toast.success("Focus block completed! Great session 🎉");
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timerMode]);

  // Audio Chime on finish
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.3); // E5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      }
    } catch {}
  };

  // Sound Track Toggles
  const handleToggleSound = (type: SoundType) => {
    if (!soundEngineRef.current) return;
    const isNowPlaying = soundEngineRef.current.toggleTrack(type);
    setSoundStates((prev) => ({ ...prev, [type]: isNowPlaying }));
  };

  // Sound Volume Change
  const handleVolumeChange = (type: SoundType, vol: number) => {
    if (!soundEngineRef.current) return;
    soundEngineRef.current.setTrackVolume(type, vol);
    setSoundVolumes((prev) => ({ ...prev, [type]: vol }));
  };

  // Stop all sounds on modal exit
  const handleClose = () => {
    soundEngineRef.current?.stopAll();
    setSoundStates({ rain: false, campfire: false, binaural: false, wind: false });
    setIsRunning(false);
    onClose();
  };

  // Keyboard shortcut listener (Space = Pause/Play, Esc = Close)
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Toggle Fullscreen browser mode
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  if (!isOpen) return null;

  // Format Time
  const displaySeconds = timerMode === "stopwatch" ? elapsedStopwatch : secondsLeft;
  const minutes = Math.floor(displaySeconds / 60);
  const seconds = displaySeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // SVG Radial Progress Calculations
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const progressRatio =
    timerMode === "stopwatch" ? 1 : totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Theme Styles
  const themeClasses: Record<ZenTheme, { bg: string; text: string; ring: string; glow: string }> = {
    cosmic: {
      bg: "bg-[#090A1A] text-slate-100",
      text: "text-indigo-400",
      ring: "stroke-indigo-500",
      glow: "from-indigo-600/20 via-purple-600/15 to-transparent",
    },
    rain: {
      bg: "bg-[#0B131E] text-slate-100",
      text: "text-cyan-400",
      ring: "stroke-cyan-500",
      glow: "from-cyan-600/20 via-blue-600/15 to-transparent",
    },
    hearth: {
      bg: "bg-[#18110B] text-slate-100",
      text: "text-amber-400",
      ring: "stroke-amber-500",
      glow: "from-amber-600/20 via-orange-600/15 to-transparent",
    },
    obsidian: {
      bg: "bg-[#050505] text-slate-100",
      text: "text-white",
      ring: "stroke-white",
      glow: "from-white/10 to-transparent",
    },
  };

  const activeTheme = themeClasses[theme];
  const hasActiveSounds = Object.values(soundStates).some(Boolean);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-between p-4 sm:p-8 select-none transition-colors duration-700 overflow-hidden ${activeTheme.bg}`}
    >
      {/* Dynamic Ambient Background Breathing Aura */}
      <div
        className={`pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br ${activeTheme.glow} blur-[120px] animate-pulse`}
        style={{ animationDuration: "6s" }}
      />
      <div
        className={`pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-tl ${activeTheme.glow} blur-[140px] animate-pulse`}
        style={{ animationDuration: "8s" }}
      />

      {/* --- TOP BAR: Task in Focus, Sound Panel Toggle, Theme Picker & Exit --- */}
      <header className="relative z-10 w-full flex items-center justify-between gap-4">
        {/* Left: Task in Focus Chip */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsTaskSelectorOpen(!isTaskSelectorOpen)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-md text-xs font-semibold text-slate-200 shadow-sm transition-all cursor-pointer group"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-400 hidden sm:inline">Focusing on:</span>
            <span className="font-bold text-white max-w-[220px] sm:max-w-[280px] truncate">
              {currentTask ? currentTask.title : "Deep Study Session"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-white transition-colors" />
          </button>

          {/* Task Dropdown Menu */}
          {isTaskSelectorOpen && (
            <div className="absolute left-0 mt-2 w-80 max-h-72 overflow-y-auto rounded-2xl bg-slate-900/95 border border-white/15 shadow-2xl backdrop-blur-xl p-2 z-50 space-y-1">
              <p className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400">
                Select Academic Task
              </p>
              {tasks.length > 0 ? (
                tasks.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setCurrentTask(t);
                      setIsTaskSelectorOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      currentTask?.id === t.id
                        ? "bg-indigo-600/40 text-white border border-indigo-500/40"
                        : "text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <span className="truncate pr-2">{t.title}</span>
                    {t.course && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 shrink-0">
                        {t.course}
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-xs text-slate-400">No active tasks loaded.</p>
              )}
            </div>
          )}
        </div>

        {/* Right Actions: Sound Mixer, Themes, Fullscreen & Exit */}
        <div className="flex items-center gap-2">
          {/* Soundscapes Mixer Button */}
          <button
            type="button"
            onClick={() => setIsSoundPanelOpen(!isSoundPanelOpen)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md transition-all cursor-pointer ${
              hasActiveSounds
                ? "bg-indigo-600/30 border-indigo-400/50 text-indigo-300 shadow-md shadow-indigo-500/20"
                : "bg-white/10 border-white/10 text-slate-300 hover:bg-white/15"
            }`}
            title="Ambient Soundscapes Studio"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Soundscapes</span>
            {hasActiveSounds && (
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            )}
          </button>

          {/* Theme Palette Dropdown */}
          <div className="flex items-center p-0.5 rounded-xl bg-white/10 border border-white/10">
            {(["cosmic", "rain", "hearth", "obsidian"] as ZenTheme[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  theme === t ? "bg-white/25 text-white shadow-xs" : "text-slate-400 hover:text-white"
                }`}
                title={`Switch to ${t} theme`}
              >
                {t[0].toUpperCase()}
              </button>
            ))}
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>

          {/* Exit Zen Button */}
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 hover:text-rose-100 text-xs font-bold transition-all cursor-pointer"
            title="Exit Zen Mode (Esc)"
          >
            <X className="h-3.5 w-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* --- AMBIENT SOUNDSCAPES STUDIO DRAWER --- */}
      {isSoundPanelOpen && (
        <div className="absolute top-20 right-4 sm:right-8 z-50 w-80 rounded-3xl bg-slate-900/95 border border-white/15 p-5 shadow-2xl backdrop-blur-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-white">Synthesized Ambient Audio</h4>
            </div>
            <button
              type="button"
              onClick={() => setIsSoundPanelOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Procedural multi-track audio synthesized live in your browser. Blend rain, fire, and alpha waves.
          </p>

          <div className="space-y-3">
            {/* 1. Rain */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleToggleSound("rain")}
                className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  soundStates.rain
                    ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-300"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <CloudRain className="h-3.5 w-3.5" />
                <span>Rain</span>
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundVolumes.rain}
                onChange={(e) => handleVolumeChange("rain", parseFloat(e.target.value))}
                className="w-32 accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* 2. Campfire */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleToggleSound("campfire")}
                className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  soundStates.campfire
                    ? "bg-amber-500/20 border-amber-400/60 text-amber-300"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Campfire</span>
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundVolumes.campfire}
                onChange={(e) => handleVolumeChange("campfire", parseFloat(e.target.value))}
                className="w-32 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* 3. Binaural Alpha Beats */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleToggleSound("binaural")}
                className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  soundStates.binaural
                    ? "bg-purple-500/20 border-purple-400/60 text-purple-300"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <Brain className="h-3.5 w-3.5" />
                <span>Alpha Waves</span>
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundVolumes.binaural}
                onChange={(e) => handleVolumeChange("binaural", parseFloat(e.target.value))}
                className="w-32 accent-purple-400 cursor-pointer"
              />
            </div>

            {/* 4. Forest Wind */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleToggleSound("wind")}
                className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  soundStates.wind
                    ? "bg-emerald-500/20 border-emerald-400/60 text-emerald-300"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <Wind className="h-3.5 w-3.5" />
                <span>Forest Wind</span>
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundVolumes.wind}
                onChange={(e) => handleVolumeChange("wind", parseFloat(e.target.value))}
                className="w-32 accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- CENTER DISPLAY: Radial SVG Timer & Play Button --- */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto space-y-7">
        {/* Mode Selector Chips */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
          {(["25m", "50m", "90m", "5m", "stopwatch"] as ZenTimerMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleModeChange(m)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timerMode === m
                  ? "bg-white text-slate-900 shadow-md font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {m === "stopwatch" ? "Stopwatch" : m}
            </button>
          ))}
        </div>

        {/* Circular SVG Progress Ring */}
        <div className="relative flex items-center justify-center">
          <svg className="w-72 h-72 sm:w-80 sm:h-80 -rotate-90 transform" viewBox="0 0 320 320">
            {/* Background Track */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              className="stroke-white/10 fill-transparent"
              strokeWidth="6"
            />
            {/* Animated Progress Track */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              className={`${activeTheme.ring} fill-transparent transition-all duration-1000 ease-linear`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Time & Big Play Action Inside Ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-2">
            <span className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md">
              {formattedTime}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              {isRunning
                ? "Flowing in Depth"
                : timerMode === "stopwatch"
                ? "Stopwatch Paused"
                : "Ready to Focus"}
            </span>

            {/* Main Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className="h-12 w-12 rounded-full bg-white text-slate-900 hover:bg-slate-100 flex items-center justify-center shadow-xl shadow-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label={isRunning ? "Pause" : "Play"}
              >
                {isRunning ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleModeChange(timerMode)}
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Task Complete Checkmark Action (if task selected) */}
        {currentTask && onCompleteTask && (
          <button
            type="button"
            onClick={() => {
              onCompleteTask(currentTask);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 hover:text-emerald-100 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Mark &quot;{currentTask.title}&quot; Complete</span>
          </button>
        )}
      </main>

      {/* --- BOTTOM FOOTER: Motivational Mantra & Ambient Sound Indicator --- */}
      <footer className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <p className="italic text-slate-300 transition-opacity duration-500">
            &ldquo;{MANTRAS[mantraIndex]}&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
          <span>Press Space to toggle timer</span>
          <span>•</span>
          <span>Esc to exit</span>
        </div>
      </footer>
    </div>
  );
}
