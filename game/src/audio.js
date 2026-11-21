// Night Market — Cari Bedanya!  Tiny synth sounds via WebAudio, no assets.

let audioCtx = null;

export function ensureAudio() {
  if (!audioCtx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    } catch (e) {
      audioCtx = null;
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, startAt, dur, type, vol) {
  const ac = ensureAudio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + dur + 0.05);
}

export function playFind() {
  tone(880, 0, 0.18, 'sine', 0.25);
  tone(1318, 0.08, 0.22, 'sine', 0.22);
}

export function playWrong() {
  tone(160, 0, 0.22, 'sawtooth', 0.12);
  tone(110, 0.1, 0.25, 'sawtooth', 0.1);
}

export function playHint() {
  tone(660, 0, 0.12, 'triangle', 0.18);
  tone(990, 0.1, 0.15, 'triangle', 0.15);
}

export function playSceneClear() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.09, 0.2, 'triangle', 0.2));
}

export function playWin() {
  [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => tone(f, i * 0.11, 0.28, 'triangle', 0.2));
}

export function playClick() {
  tone(440, 0, 0.06, 'square', 0.08);
}
