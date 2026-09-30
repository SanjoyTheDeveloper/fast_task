/**
 * Procedural Web Audio API sound generator for Zen Flow ambient soundscapes.
 * Generates realistic Rain, Campfire Crackle, Binaural Alpha Waves, and Forest Wind
 * completely client-side without external MP3 audio file dependencies.
 */

export type SoundType = "rain" | "campfire" | "binaural" | "wind";

interface SoundTrackState {
  isPlaying: boolean;
  volume: number; // 0.0 to 1.0
  gainNode: GainNode | null;
  nodes: (AudioNode | number)[] | null;
}

export class ZenSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private tracks: Map<SoundType, SoundTrackState> = new Map();

  constructor() {
    this.tracks.set("rain", { isPlaying: false, volume: 0.6, gainNode: null, nodes: null });
    this.tracks.set("campfire", { isPlaying: false, volume: 0.5, gainNode: null, nodes: null });
    this.tracks.set("binaural", { isPlaying: false, volume: 0.4, gainNode: null, nodes: null });
    this.tracks.set("wind", { isPlaying: false, volume: 0.4, gainNode: null, nodes: null });
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMasterVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.05);
    }
  }

  public setTrackVolume(sound: SoundType, vol: number) {
    const track = this.tracks.get(sound);
    if (!track) return;
    track.volume = Math.max(0, Math.min(1, vol));
    if (track.gainNode && this.ctx) {
      track.gainNode.gain.setTargetAtTime(track.volume, this.ctx.currentTime, 0.05);
    }
  }

  public toggleTrack(sound: SoundType): boolean {
    const track = this.tracks.get(sound);
    if (!track) return false;
    if (track.isPlaying) {
      this.stopTrack(sound);
      return false;
    } else {
      this.startTrack(sound);
      return true;
    }
  }

  public isTrackPlaying(sound: SoundType): boolean {
    return !!this.tracks.get(sound)?.isPlaying;
  }

  public getTrackVolume(sound: SoundType): number {
    return this.tracks.get(sound)?.volume ?? 0.5;
  }

  public startTrack(sound: SoundType) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const track = this.tracks.get(sound);
    if (!track || track.isPlaying) return;

    const trackGain = this.ctx.createGain();
    trackGain.gain.setValueAtTime(track.volume, this.ctx.currentTime);
    trackGain.connect(this.masterGain);
    track.gainNode = trackGain;

    if (sound === "rain") {
      track.nodes = this.createRainNodes(trackGain);
    } else if (sound === "campfire") {
      track.nodes = this.createCampfireNodes(trackGain);
    } else if (sound === "binaural") {
      track.nodes = this.createBinauralNodes(trackGain);
    } else if (sound === "wind") {
      track.nodes = this.createWindNodes(trackGain);
    }

    track.isPlaying = true;
  }

  public stopTrack(sound: SoundType) {
    const track = this.tracks.get(sound);
    if (!track || !track.isPlaying) return;

    if (track.nodes) {
      for (const node of track.nodes) {
        if (typeof node === "number") {
          window.clearInterval(node);
        } else if (typeof (node as any).stop === "function") {
          try {
            (node as any).stop();
          } catch {}
        }
      }
    }

    track.gainNode?.disconnect();
    track.gainNode = null;
    track.nodes = null;
    track.isPlaying = false;
  }

  public stopAll() {
    for (const key of this.tracks.keys()) {
      this.stopTrack(key);
    }
  }

  // --- Procedural Audio Generators ---

  /**
   * Generates continuous rain noise with pink/white noise and bandpass resonance.
   */
  private createRainNodes(destination: AudioNode): (AudioNode | number)[] {
    if (!this.ctx) return [];
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to sound like rain
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(destination);
    whiteNoise.start();

    return [whiteNoise, filter];
  }

  /**
   * Generates warm campfire crackles & embers using randomized pop impulses.
   */
  private createCampfireNodes(destination: AudioNode): (AudioNode | number)[] {
    if (!this.ctx) return [];

    // Background low warmth hum
    const osc = this.ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(65, this.ctx.currentTime);
    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    osc.connect(oscGain);
    oscGain.connect(destination);
    osc.start();

    // Crackle impulse interval
    const intervalId = window.setInterval(() => {
      if (!this.ctx || Math.random() > 0.65) return;
      try {
        const crackleBuffer = this.ctx.createBuffer(1, 800, this.ctx.sampleRate);
        const data = crackleBuffer.getChannelData(0);
        for (let i = 0; i < 800; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 120);
        }
        const source = this.ctx.createBufferSource();
        source.buffer = crackleBuffer;

        const crackleFilter = this.ctx.createBiquadFilter();
        crackleFilter.type = "bandpass";
        crackleFilter.frequency.setValueAtTime(800 + Math.random() * 2400, this.ctx.currentTime);

        const crackleGain = this.ctx.createGain();
        crackleGain.gain.setValueAtTime(0.15 + Math.random() * 0.35, this.ctx.currentTime);

        source.connect(crackleFilter);
        crackleFilter.connect(crackleGain);
        crackleGain.connect(destination);
        source.start();
      } catch {}
    }, 90);

    return [osc, oscGain, intervalId];
  }

  /**
   * Generates 40Hz Alpha/Gamma Binaural Beats for deep cognitive focus & memory retention.
   */
  private createBinauralNodes(destination: AudioNode): (AudioNode | number)[] {
    if (!this.ctx) return [];

    // Left Ear: 216 Hz
    const oscL = this.ctx.createOscillator();
    oscL.type = "sine";
    oscL.frequency.setValueAtTime(216, this.ctx.currentTime);

    // Right Ear: 226 Hz (10 Hz Alpha beat frequency difference for relaxed alertness)
    const oscR = this.ctx.createOscillator();
    oscR.type = "sine";
    oscR.frequency.setValueAtTime(226, this.ctx.currentTime);

    const merger = this.ctx.createChannelMerger(2);
    oscL.connect(merger, 0, 0); // Left channel
    oscR.connect(merger, 0, 1); // Right channel

    const binauralGain = this.ctx.createGain();
    binauralGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    merger.connect(binauralGain);
    binauralGain.connect(destination);

    oscL.start();
    oscR.start();

    return [oscL, oscR, merger, binauralGain];
  }

  /**
   * Generates soft forest wind / gentle breeze with an oscillating LFO filter.
   */
  private createWindNodes(destination: AudioNode): (AudioNode | number)[] {
    if (!this.ctx) return [];

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.12;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);
    filter.frequency.setValueAtTime(350, this.ctx.currentTime);

    // Slow LFO to modulate wind gusts
    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(220, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(destination);

    noise.start();
    lfo.start();

    return [noise, filter, lfo, lfoGain];
  }
}

export const zenAudio = typeof window !== "undefined" ? new ZenSoundEngine() : null;
