/**
 * Cosmic Narration Engine
 * Integrates Web Speech API with rate/pitch control, voice detection, and boundary callbacks.
 */

type NarrationStateCallback = (state: {
  isSpeaking: boolean;
  isPaused: boolean;
  currentText: string;
  charIndex: number;
}) => void;

class NarrationService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private isPaused = false;
  private currentText = '';
  private rate = 0.95;
  private pitch = 0.92;
  private listeners: Set<NarrationStateCallback> = new Set();
  private fallbackTimer: number | null = null;
  private keepAliveTimer: number | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    try {
      this.cachedVoices = this.synth.getVoices();
    } catch {
      this.cachedVoices = [];
    }
  }

  public subscribe(cb: NarrationStateCallback): () => void {
    this.listeners.add(cb);
    this.notify();
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify(charIndex = 0) {
    const state = {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
      currentText: this.currentText,
      charIndex,
    };
    this.listeners.forEach(cb => cb(state));
  }

  public speak(text: string, onEnd?: () => void) {
    this.stop();
    this.currentText = text;

    if (!this.synth) {
      // Fallback simulation mode
      this.isSpeaking = true;
      this.isPaused = false;
      this.notify(0);
      const words = text.split(' ').length;
      const durationMs = (words / 2.5) * 1000;
      this.fallbackTimer = window.setTimeout(() => {
        this.isSpeaking = false;
        this.notify();
        if (onEnd) onEnd();
      }, durationMs);
      return;
    }

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    // Pick best English natural voice
    const voices = this.cachedVoices.length > 0 ? this.cachedVoices : this.synth.getVoices();
    const naturalVoice = voices.find(
      v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Alex'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      this.notify(0);
      this.startKeepAlive();
    };

    utterance.onboundary = (event) => {
      this.notify(event.charIndex);
    };

    utterance.onpause = () => {
      this.isPaused = true;
      this.notify();
    };

    utterance.onresume = () => {
      this.isPaused = false;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.stopKeepAlive();
      this.notify();
      if (onEnd) onEnd();
    };

    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      console.error('Narration error:', event.error);
      this.isSpeaking = false;
      this.isPaused = false;
      this.stopKeepAlive();
      this.notify();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  // Workaround for Chrome bug where SpeechSynthesis pauses after ~14 seconds
  private startKeepAlive() {
    this.stopKeepAlive();
    this.keepAliveTimer = window.setInterval(() => {
      if (this.synth && this.isSpeaking && !this.isPaused) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 10000);
  }

  private stopKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  public pause() {
    if (this.synth && this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notify();
    }
  }

  public stop() {
    this.stopKeepAlive();
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
    this.notify();
  }

  public setRate(newRate: number) {
    this.rate = Math.max(0.7, Math.min(1.5, newRate));
    // When rate changes while speaking, update without jumping back to 0
    if (this.isSpeaking && this.synth && this.currentUtterance) {
      // Chrome requires re-speaking to update rate
      const remaining = this.currentText;
      this.speak(remaining);
    }
  }

  public getRate(): number {
    return this.rate;
  }
}

export const narrationAudio = new NarrationService();
