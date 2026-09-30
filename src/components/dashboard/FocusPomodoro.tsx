"use client";

import * as React from "react";
import {
  Target,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export type PomodoroMode = "25m Focus" | "5m Break" | "15m Rest";

export interface FocusPomodoroProps {
  onOpenZenMode?: () => void;
}

export function FocusPomodoro({ onOpenZenMode }: FocusPomodoroProps = {}) {
  const [mode, setMode] = React.useState<PomodoroMode>("25m Focus");
  const [isRunning, setIsRunning] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(25 * 60);
  const [isMuted, setIsMuted] = React.useState(false);

  // Set time based on mode
  const handleModeChange = (newMode: PomodoroMode) => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === "25m Focus") setTimeLeft(25 * 60);
    else if (newMode === "5m Break") setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  // Timer interval
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Play sound if not muted
      if (!isMuted && typeof window !== "undefined") {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
          osc.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.3);
        } catch {
          // AudioContext unsupported
        }
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isMuted]);

  // Format mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A1020] text-white p-5 border border-slate-800 shadow-xl overflow-hidden space-y-4">
      {/* Decorative ambient dark cyan/blue glow */}
      <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-blue-500/15 blur-xl" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-xs">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-tight">
              Focus Pomodoro
            </h3>
            <p className="text-[10px] text-slate-400">
              25m study blocks / 5m breaks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="h-7 w-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
            title={isMuted ? "Unmute timer" : "Mute timer"}
            aria-label="Toggle mute"
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              handleModeChange(mode);
            }}
            className="h-7 w-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
            title="Reset timer"
            aria-label="Reset timer"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Mode selection tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-900/80 border border-white/10 text-center">
        {(["25m Focus", "5m Break", "15m Rest"] as PomodoroMode[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => handleModeChange(tab)}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              mode === tab
                ? "bg-[#315BFF] text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Center Display: Timer & Big Play Button */}
      <div className="pt-2 pb-1 flex flex-col items-center justify-center space-y-3">
        {/* Large Play/Pause Circular Action */}
        <button
          type="button"
          onClick={() => setIsRunning(!isRunning)}
          className="relative h-14 w-14 rounded-full bg-[#315BFF] hover:bg-[#254BE3] text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-blue-500/20"
          aria-label={isRunning ? "Pause session" : "Start session"}
        >
          {isRunning ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="h-5 w-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Status text or live timer display */}
        <div className="text-center">
          <p className="text-xs font-bold text-white tracking-wide">
            {isRunning ? formattedTime : "Start Focus Session"}
          </p>
          {isRunning && (
            <p className="text-[10px] text-blue-300 font-medium animate-pulse mt-0.5">
              • Session in progress
            </p>
          )}
        </div>
      </div>

      {/* Unique Feature: Zen Flow Mode Fullscreen Launcher */}
      {onOpenZenMode && (
        <div className="pt-1 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onOpenZenMode}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 hover:from-indigo-500/30 hover:via-purple-500/30 hover:to-pink-500/30 border border-indigo-400/30 hover:border-indigo-400/60 text-white flex items-center justify-between text-xs font-bold transition-all shadow-md group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-indigo-500/30 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform">
                <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              </div>
              <span className="text-slate-200 group-hover:text-white tracking-wide text-[11px]">
                Zen Flow Mode
              </span>
            </div>
            <span className="text-[10px] font-semibold text-indigo-300/90 bg-indigo-900/50 px-2 py-0.5 rounded-full border border-indigo-400/20">
              Lo-Fi & Timer 🎧
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
