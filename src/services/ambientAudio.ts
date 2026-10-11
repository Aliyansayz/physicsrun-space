/**
 * Procedural Space Ambient Synthesizer using Web Audio API
 * Generates selectable cosmic soundscapes: Deep Space Drone, Magnetosphere Whistling Waves, and Solar Wind.
 */

export type SoundscapePreset = 'cosmic-drone' | 'magnetosphere' | 'solar-wind';

class AmbientAudioService {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private oscs: OscillatorNode[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;
  private lfo: OscillatorNode | null = null;
  private currentPreset: SoundscapePreset = 'cosmic-drone';
  private volume = 0.25;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public async start(preset: SoundscapePreset = this.currentPreset): Promise<boolean> {
    this.initContext();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        return false;
      }
    }

    if (this.isPlaying) {
      if (this.currentPreset === preset) return true;
      this.stopImmediate();
    }

    this.currentPreset = preset;

    try {
      const now = this.ctx.currentTime;
      this.masterGain = this.ctx.createGain();
      const targetVol = Math.max(0.0001, this.volume);
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(targetVol, now + 1.8);
      this.masterGain.connect(this.ctx.destination);

      if (preset === 'cosmic-drone') {
        // Preset 1: Deep Warm Cosmic Drone
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(220, now);
        filter.Q.setValueAtTime(2.5, now);
        filter.connect(this.masterGain);

        this.lfo = this.ctx.createOscillator();
        this.lfo.frequency.setValueAtTime(0.08, now);
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(90, now);
        this.lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        this.lfo.start(now);

        // Sub Root (55 Hz)
        const oscSub = this.ctx.createOscillator();
        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(55, now);
        const subGain = this.ctx.createGain();
        subGain.gain.setValueAtTime(0.4, now);
        oscSub.connect(subGain);
        subGain.connect(filter);
        oscSub.start(now);
        this.oscs.push(oscSub);

        // Fifth (82.4 Hz)
        const oscFifth = this.ctx.createOscillator();
        oscFifth.type = 'triangle';
        oscFifth.frequency.setValueAtTime(82.4, now);
        const fifthGain = this.ctx.createGain();
        fifthGain.gain.setValueAtTime(0.25, now);
        oscFifth.connect(fifthGain);
        fifthGain.connect(filter);
        oscFifth.start(now);
        this.oscs.push(oscFifth);

        // Detuned octave (110.3 Hz)
        const oscDetune = this.ctx.createOscillator();
        oscDetune.type = 'sine';
        oscDetune.frequency.setValueAtTime(110.3, now);
        const detuneGain = this.ctx.createGain();
        detuneGain.gain.setValueAtTime(0.18, now);
        oscDetune.connect(detuneGain);
        detuneGain.connect(filter);
        oscDetune.start(now);
        this.oscs.push(oscDetune);

        this.startPinkNoise(0.06, 380, 1.2);

      } else if (preset === 'magnetosphere') {
        // Preset 2: Jupiter/Saturn Plasma Radio Wave Whistlers Simulation
        // Simulates NASA Voyager/Juno chorus plasma wave recordings
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, now);
        filter.Q.setValueAtTime(5.0, now);
        filter.connect(this.masterGain);

        // Whistling FM oscillator
        const whistleOsc = this.ctx.createOscillator();
        whistleOsc.type = 'sine';
        whistleOsc.frequency.setValueAtTime(520, now);

        const whistleLFO = this.ctx.createOscillator();
        whistleLFO.type = 'sawtooth';
        whistleLFO.frequency.setValueAtTime(0.35, now); // Slow downward chirps typical of magnetospheric whistlers

        const whistleLfoGain = this.ctx.createGain();
        whistleLfoGain.gain.setValueAtTime(320, now);
        whistleLFO.connect(whistleLfoGain);
        whistleLfoGain.connect(whistleOsc.frequency);
        whistleLFO.start(now);
        this.lfo = whistleLFO;

        const whistleGain = this.ctx.createGain();
        whistleGain.gain.setValueAtTime(0.35, now);
        whistleOsc.connect(whistleGain);
        whistleGain.connect(filter);
        whistleOsc.start(now);
        this.oscs.push(whistleOsc);

        // Ambient low hum
        const subHum = this.ctx.createOscillator();
        subHum.type = 'sine';
        subHum.frequency.setValueAtTime(73, now);
        const humGain = this.ctx.createGain();
        humGain.gain.setValueAtTime(0.25, now);
        subHum.connect(humGain);
        humGain.connect(this.masterGain);
        subHum.start(now);
        this.oscs.push(subHum);

        this.startPinkNoise(0.05, 520, 2.0);

      } else {
        // Preset 3: Solar Wind & Particle Flux
        this.startPinkNoise(0.18, 620, 0.8);

        // Soft breath drone
        const windOsc = this.ctx.createOscillator();
        windOsc.type = 'triangle';
        windOsc.frequency.setValueAtTime(65, now);
        const windGain = this.ctx.createGain();
        windGain.gain.setValueAtTime(0.18, now);
        windOsc.connect(windGain);
        windGain.connect(this.masterGain);
        windOsc.start(now);
        this.oscs.push(windOsc);
      }

      this.isPlaying = true;
      return true;
    } catch {
      return false;
    }
  }

  private startPinkNoise(volume: number, freq: number, q: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.04;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(freq, now);
    noiseFilter.Q.setValueAtTime(q, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(volume, now);

    this.noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    this.noiseNode.start(now);
  }

  private stopImmediate() {
    this.oscs.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch {}
    });
    this.oscs = [];

    if (this.noiseNode) {
      try { this.noiseNode.stop(); this.noiseNode.disconnect(); } catch {}
      this.noiseNode = null;
    }

    if (this.lfo) {
      try { this.lfo.stop(); this.lfo.disconnect(); } catch {}
      this.lfo = null;
    }
    this.isPlaying = false;
  }

  public stop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    try {
      this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);

      setTimeout(() => {
        this.stopImmediate();
      }, 1050);
    } catch {
      this.stopImmediate();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(this.currentPreset);
      return true;
    }
  }

  public setPreset(preset: SoundscapePreset) {
    this.currentPreset = preset;
    if (this.isPlaying) {
      this.start(preset);
    }
  }

  public getPreset(): SoundscapePreset {
    return this.currentPreset;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && this.isPlaying) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.volume, now);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const ambientAudio = new AmbientAudioService();
