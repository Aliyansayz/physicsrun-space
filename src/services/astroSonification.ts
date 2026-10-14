import { SpectralWavelength } from '../types/astrolens';

class AstroSonificationService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeFilter: BiquadFilterNode | null = null;
  private isContinuousRunning: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.08, this.ctx.currentTime, 0.05);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Play an audible acoustic sweep or pulse when switching electromagnetic bands
   */
  public playWavelengthShiftTone(wavelength: SpectralWavelength, baseFreqHz: number = 220) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Spectral wavelength specific frequency shaping
      let targetFreq = baseFreqHz;
      let oscType: OscillatorType = 'sine';

      switch (wavelength) {
        case 'radio':
          targetFreq = Math.max(55, baseFreqHz * 0.4); // Deep subterranean low frequency
          oscType = 'triangle';
          break;
        case 'infrared':
          targetFreq = baseFreqHz * 0.75; // Warm mellow tone
          oscType = 'sine';
          break;
        case 'optical':
          targetFreq = baseFreqHz; // Balanced harmonic
          oscType = 'sine';
          break;
        case 'ultraviolet':
          targetFreq = baseFreqHz * 1.5; // High crystalline shimmer
          oscType = 'triangle';
          break;
        case 'xray':
          targetFreq = baseFreqHz * 2.4; // Intense energetic ionization tone
          oscType = 'sawtooth';
          break;
        case 'composite':
          targetFreq = baseFreqHz * 1.2;
          oscType = 'sine';
          break;
      }

      osc.type = oscType;
      osc.frequency.setValueAtTime(targetFreq * 0.8, now);
      osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.12);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      // Lowpass filter to keep sound warm and futuristic
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(wavelength === 'xray' ? 1800 : 800, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Audio safety fallback
    }
  }

  /**
   * Play localized acoustic telemetry blip when hovering or clicking a celestial hotspot
   */
  public playHotspotPing(type: string) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = type === 'pulsar' ? 880 : type === 'shockwave' ? 340 : type === 'core' ? 220 : 540;
      osc.type = type === 'pulsar' ? 'square' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Safe fallback
    }
  }

  /**
   * Play realistic dual-action camera shutter sound effect for astrophotography capture
   */
  public playShutterSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      
      // Stage 1: Mirror flap / mechanical curtain opening
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(800, now);
      osc1.frequency.exponentialRampToValueAtTime(140, now + 0.04);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc1.connect(gain1);
      gain1.connect(this.masterGain);
      osc1.start(now);
      osc1.stop(now + 0.05);

      // Stage 2: Second curtain transit click
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(450, now + 0.09);
      osc2.frequency.exponentialRampToValueAtTime(80, now + 0.15);
      gain2.gain.setValueAtTime(0.06, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.17);
    } catch {
      // Safe fallback
    }
  }

  /**
   * Play high-tech astrophotography sensor calibration / readout chime
   */
  public playSensorLockTone() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5
      osc.frequency.setValueAtTime(1318.5, now + 0.16); // E6

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.02);
      gain.gain.setValueAtTime(0.05, now + 0.20);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // Safe fallback
    }
  }
}

export const astroSonification = new AstroSonificationService();
