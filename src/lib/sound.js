/**
 * src/lib/sound.js
 *
 * Singleton sound manager for portfolio UI effects.
 *
 * Audio files expected in public/audio/:
 *   - /audio/move.mp3    — hover/focus tick (throttled 80ms)
 *   - /audio/select.mp3  — click confirmation
 *   - /audio/nav.mp3     — page navigation (forward & back)
 *
 * Rules:
 *   - Volume 0.35 for all sounds.
 *   - No playback before first user gesture (unlock on first pointerdown).
 *   - Files are preloaded only after unlock.
 *   - No playback when document.hidden.
 *   - move is throttled to one play per 80ms.
 *   - Mute state persisted in localStorage (key: 'uiSoundMuted').
 *   - ALL errors fail completely silently — no console noise.
 *   - subscribe(fn) returns an unsubscribe function.
 */

const SOUND_FILES = {
  move:   '/audio/move.mp3',
  select: '/audio/select.mp3',
  nav:    '/audio/nav.mp3',
};

const VOLUME   = 0.35;
const THROTTLE = 80; // ms between move sounds

/* ── State ──────────────────────────────────────────────────────────────── */
let unlocked     = false;
let audioCache   = {};
let subscribers  = [];
let lastMoveTime = 0;

function readMuted() {
  try {
    return localStorage.getItem('uiSoundMuted') === 'true';
  } catch {
    return false;
  }
}

function writeMuted(val) {
  try {
    localStorage.setItem('uiSoundMuted', String(val));
  } catch { /* noop */ }
}

let muted = readMuted();

function notify() {
  subscribers.forEach((fn) => { try { fn(muted); } catch { /* noop */ } });
}

/* ── Preload after unlock ────────────────────────────────────────────────── */
function preload() {
  Object.entries(SOUND_FILES).forEach(([name, src]) => {
    if (audioCache[name]) return;
    try {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume  = VOLUME;
      audioCache[name] = audio;
    } catch { /* noop */ }
  });
}

/* ── Public API ──────────────────────────────────────────────────────────── */
export function unlock() {
  if (unlocked) return;
  unlocked = true;
  preload();
}

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = Boolean(value);
  writeMuted(muted);
  notify();
}

export function toggleMuted() {
  setMuted(!muted);
}

export function subscribe(fn) {
  subscribers.push(fn);
  return () => {
    subscribers = subscribers.filter((s) => s !== fn);
  };
}

export function play(name) {
  if (muted)        return;
  if (!unlocked)    return;
  if (typeof document !== 'undefined' && document.hidden) return;

  /* Throttle move sound */
  if (name === 'move') {
    const now = Date.now();
    if (now - lastMoveTime < THROTTLE) return;
    lastMoveTime = now;
  }

  const original = audioCache[name];
  if (!original) return;

  try {
    // Clone so overlapping calls trigger cleanly
    const clone = original.cloneNode ? original.cloneNode() : original;
    clone.volume = VOLUME;
    const promise = clone.play();
    if (promise !== undefined) {
      promise.catch(() => { /* noop */ });
    }
  } catch { /* noop */ }
}

export default { play, unlock, isMuted, setMuted, toggleMuted, subscribe };
