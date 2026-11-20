/**
 * GLOZA Futuristic Web Audio Synthesizer
 * Generates custom cybernetic sound effects using the native Web Audio API
 * No external mp3 or wav files required!
 */

class GlozaAudio {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('gloza_sound') === 'true'; // default false until user enables or clicks sound button
    this.masterGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.init();
    this.enabled = !this.enabled;
    localStorage.setItem('gloza_sound', this.enabled ? 'true' : 'false');
    if (this.enabled) {
      this.playPowerOn();
    }
    return this.enabled;
  }

  playHover() {
    if (!this.enabled) return;
    this.init();
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.04);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.045);
    } catch (e) {
      // AudioContext handling
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.06);

      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.065);
    } catch (e) {}
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    try {
      const t = this.ctx.currentTime;
      [
        { freq: 523.25, time: 0 },
        { freq: 659.25, time: 0.08 },
        { freq: 1046.5, time: 0.16 }
      ].forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, t + note.time);

        gain.gain.setValueAtTime(0.08, t + note.time);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.time + 0.22);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t + note.time);
        osc.stop(t + note.time + 0.23);
      });
    } catch (e) {}
  }

  playScan() {
    if (!this.enabled) return;
    this.init();
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.linearRampToValueAtTime(1600, t + 0.18);
      osc.frequency.linearRampToValueAtTime(800, t + 0.35);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.36);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.37);
    } catch (e) {}
  }

  playPowerOn() {
    if (!this.enabled) return;
    this.init();
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.25);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.3);
    } catch (e) {}
  }
}

window.glozaAudio = new GlozaAudio();
