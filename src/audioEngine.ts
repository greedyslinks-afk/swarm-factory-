import { SignProfile } from './voiceProfiles';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private ambientGain: GainNode | null = null;
  private droneOscillators: OscillatorNode[] = [];
  private isMuted: boolean = false;
  private isInitialized: boolean = false;
  private synth: SpeechSynthesis | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];

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
    this.availableVoices = this.synth.getVoices();
  }

  public async initAudio(): Promise<boolean> {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return true;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.initAmbientDrone();
      this.isInitialized = true;
      return true;
    } catch (err) {
      console.warn('AudioContext initialization failed or blocked:', err);
      return false;
    }
  }

  private initAmbientDrone() {
    if (!this.ctx || !this.masterGain) return;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.025, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);

    const droneFreqs = [108, 162, 216];
    droneFreqs.forEach((freq) => {
      if (!this.ctx || !this.ambientGain) return;
      const osc = this.ctx.createOscillator();
      const panner = this.ctx.createStereoPanner();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      panner.pan.value = (Math.random() - 0.5) * 0.4;
      osc.connect(panner);
      panner.connect(this.ambientGain);
      osc.start();
      this.droneOscillators.push(osc);
    });
  }

  public playSignHarmonic(sign: SignProfile, durationSec: number = 1.4) {
    if (this.isMuted) return;
    if (!this.ctx || !this.masterGain) {
      this.initAudio();
      if (!this.ctx || !this.masterGain) return;
    }

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner();

      switch (sign.element) {
        case 'AI':
          osc.type = 'sine';
          break;
        case 'Spatial':
          osc.type = 'triangle';
          break;
        case 'Security':
          osc.type = 'sine';
          break;
        case 'Cloud':
          osc.type = 'triangle';
          break;
        default:
          osc.type = 'sine';
      }

      osc.frequency.setValueAtTime(sign.harmonicFreq, now);
      osc.frequency.exponentialRampToValueAtTime(sign.harmonicFreq * 1.05, now + durationSec * 0.5);

      const rad = (sign.angleDeg * Math.PI) / 180;
      const panValue = Math.sin(rad);
      panner.pan.setValueAtTime(Math.max(-0.85, Math.min(0.85, panValue)), now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.15, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + durationSec);
    } catch (e) {
      console.warn('Harmonic play error:', e);
    }
  }

  public playGuitarNote(freq: number = 261.63, durationSec: number = 1.2) {
    if (this.isMuted) return;
    this.initAudio().then(() => {
      if (!this.ctx || !this.masterGain) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        subOsc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        subOsc.frequency.setValueAtTime(freq * 2, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.22, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

        osc.connect(gain);
        subOsc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        subOsc.start(now);
        osc.stop(now + durationSec);
        subOsc.stop(now + durationSec);
      } catch (e) {
        console.warn('Guitar note error:', e);
      }
    });
  }

  public playGuitarChord(freqs: number[]) {
    freqs.forEach((f, idx) => {
      setTimeout(() => {
        this.playGuitarNote(f, 1.5);
      }, idx * 65);
    });
  }

  public speak(
    text: string,
    sign: SignProfile,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (this.isMuted || !this.synth) {
      if (onStart) onStart();
      setTimeout(() => {
        if (onEnd) onEnd();
      }, Math.min(2400, Math.max(1000, text.length * 25)));
      return;
    }

    try {
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = sign.speechPitch;
      utterance.rate = sign.speechRate;

      if (this.availableVoices.length > 0) {
        const englishVoices = this.availableVoices.filter((v) => v.lang.startsWith('en'));
        const pool = englishVoices.length > 0 ? englishVoices : this.availableVoices;
        const index =
          Math.abs(sign.name.charCodeAt(0) + sign.name.charCodeAt(1)) % pool.length;
        utterance.voice = pool[index];
      }

      utterance.onstart = () => {
        this.playSignHarmonic(sign, 1.8);
        if (onStart) onStart();
      };

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      this.synth.speak(utterance);
    } catch {
      if (onStart) onStart();
      setTimeout(() => {
        if (onEnd) onEnd();
      }, 1200);
    }
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime);
    }
    if (this.isMuted && this.synth) {
      this.synth.cancel();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(32);
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

export const audioEngine = new AudioEngine();
