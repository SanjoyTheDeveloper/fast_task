"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Coffee,
  Brain,
  Timer,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Mode = "focus" | "shortBreak" | "longBreak";

const MODE_CONFIG = {
  focus: {
    label: "Focus Study",
    duration: 25 * 60,
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
    color: "from-indigo-600 to-violet-600",
    ringColor: "#6366f1",
    icon: Brain,
    description: "Deep work session (25 min)",
  },
  shortBreak: {
    label: "Short Break",
    duration: 5 * 60,
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    color: "from-emerald-500 to-teal-600",
    ringColor: "#10b981",
    icon: Coffee,
    description: "Stretch & hydrate (5 min)",
  },
  longBreak: {
    label: "Long Break",
    duration: 15 * 60,
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    color: "from-amber-500 to-orange-500",
    ringColor: "#f59e0b",
    icon: Coffee,
    description: "Walk & relax (15 min)",
  },
};

export function PomodoroWidget() {
  const [mode, setMode] = useState<Mode>("focus");
  const [timeLeft, setTimeLeft] = useState<number>(MODE_CONFIG.focus.duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(2);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // AudioContext not allowed or unsupported
    }
  };

  const handleComplete = () => {
    setIsRunning(false);
    playBeep();
    if (mode === "focus") {
      setCompletedSessions((prev) => prev + 1);
      // switch to short break automatically
      setMode("shortBreak");
      setTimeLeft(MODE_CONFIG.shortBreak.duration);
    } else {
      setMode("focus");
      setTimeLeft(MODE_CONFIG.focus.duration);
    }
  };

  const switchMode = (newMode: Mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_CONFIG[newMode].duration);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_CONFIG[mode].duration);
  };

  const togglePlay = () => {
    setIsRunning(!isRunning);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const currentConfig = MODE_CONFIG[mode];
  const progressPercent = ((currentConfig.duration - timeLeft) / currentConfig.duration) * 100;
  const ActiveIcon = currentConfig.icon;

  return (
    <div className="bg-white text-[#172033] border border-slate-200/80 shadow-xs rounded-2xl transition-all overflow-hidden relative">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl" />

      {/* Header Bar */}
      <div className="relative px-5 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/40">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-200/60 text-[#315BFF] flex items-center justify-center shadow-2xs">
            <Timer className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
              Focus Pomodoro
              <span className="relative flex h-2 w-2">
                {isRunning && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isRunning ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-slate-300"
                  }`}
                />
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {isRunning ? "Deep study timer running" : "25m study blocks / 5m breaks"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            title={soundEnabled ? "Mute chimes" : "Enable chimes"}
            aria-label="Toggle chime sound"
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5 text-slate-400" />}
          </button>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            title={isCollapsed ? "Expand widget" : "Collapse widget"}
            aria-label="Toggle collapse"
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Collapsed Mini Bar */}
      {isCollapsed ? (
        <div className="relative px-5 py-3.5 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold font-mono tracking-tight text-[#172033]">
              {formattedTime}
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${currentConfig.badge}`}>
              {currentConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={togglePlay}
              className={`p-2 rounded-xl text-white font-medium shadow-sm transition-all active:scale-95 ${
                isRunning
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-[#315BFF] hover:bg-[#254BE3]"
              }`}
            >
              {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
            </button>
          </div>
        </div>
      ) : (
        /* Expanded Full Body */
        <div className="relative p-5 space-y-5">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 border border-slate-200/60 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => switchMode("focus")}
              className={`py-1.5 px-2 rounded-lg transition-all text-center ${
                mode === "focus"
                  ? "bg-white text-[#172033] shadow-xs font-bold border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              25m Focus
            </button>
            <button
              type="button"
              onClick={() => switchMode("shortBreak")}
              className={`py-1.5 px-2 rounded-lg transition-all text-center ${
                mode === "shortBreak"
                  ? "bg-white text-[#172033] shadow-xs font-bold border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              5m Break
            </button>
            <button
              type="button"
              onClick={() => switchMode("longBreak")}
              className={`py-1.5 px-2 rounded-lg transition-all text-center ${
                mode === "longBreak"
                  ? "bg-white text-[#172033] shadow-xs font-bold border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              15m Rest
            </button>
          </div>

          {/* Clock Display */}
          <div className="text-center py-2 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center mb-4">
              {/* Radial circular progress bar indicator */}
              <div className="w-36 h-36 rounded-full border-4 border-slate-100 flex items-center justify-center relative shadow-inner">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(${currentConfig.ringColor} ${progressPercent}%, transparent ${progressPercent}% 100%)`,
                    mask: "radial-gradient(transparent 60px, black 61px)",
                    WebkitMask: "radial-gradient(transparent 60px, black 61px)",
                  }}
                />
                <div className="flex flex-col items-center z-10">
                  <span className="text-4xl font-black tracking-tight font-mono text-[#172033]">
                    {formattedTime}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 mt-0.5 flex items-center gap-1">
                    <ActiveIcon className="h-3 w-3 text-slate-400" />
                    {currentConfig.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 justify-center w-full max-w-[220px]">
              <button
                type="button"
                onClick={resetTimer}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[#172033] hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                title="Reset timer"
                aria-label="Reset timer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className={`flex-1 py-2.5 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
                  isRunning
                    ? "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"
                    : "bg-[#315BFF] hover:bg-[#254BE3] shadow-blue-500/25"
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" /> Start Focus
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Session Progress Tracker */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#315BFF]" />
              Today&apos;s Pomodoros:
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    i <= completedSessions
                      ? "bg-[#315BFF] shadow-[0_0_6px_rgba(49,91,255,0.5)]"
                      : "bg-slate-200"
                  }`}
                  title={`Session ${i}`}
                />
              ))}
              <span className="ml-1.5 font-bold text-[#172033]">
                {completedSessions} / 4
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
