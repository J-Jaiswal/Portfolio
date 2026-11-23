/**
 * src/hooks/useSound.js
 *
 * Audio manager for portfolio sound effects and background ambient track.
 * Uses plain HTML5 Audio without any external libraries.
 *
 * Audio assets expected in public/audio/:
 *   - /audio/move.mp3    — soft tick when navigating items (↑↓/WS/Arrows)
 *   - /audio/select.mp3  — soft click on hover or focus
 *   - /audio/open.mp3    — warm chime when opening a panel or case study
 *   - /audio/back.mp3    — subtle whoosh/pop when closing or navigating back
 *   - /audio/ambient.mp3 — quiet warm background ambient loop (played at 20% volume)
 *
 * Rules:
 *   - Sound NEVER autoplays on first visit (persisted soundOn defaults to false).
 *   - Audio starts ONLY after the user explicitly enables the sound toggle.
 *   - Ambient track loops quietly when soundOn is true, pauses when false.
 *   - If any audio file is missing or blocked by browser policies, it fails completely silently.
 */

import { useRef, useCallback, useEffect } from 'react';
import { useAppState } from '../state/useAppState';

/* ── Audio File Map ──────────────────────────────────────────────────────── */
const SOUND_FILES = {
  move:    '/audio/move.mp3',
  select:  '/audio/select.mp3',
  open:    '/audio/open.mp3',
  back:    '/audio/back.mp3',
  ambient: '/audio/ambient.mp3',
};

/* ── Audio cache for sound effects ───────────────────────────────────────── */
const audioCache = new Map();

function getAudio(type) {
  const src = SOUND_FILES[type];
  if (!src) return null;
  if (!audioCache.has(type)) {
    try {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audioCache.set(type, audio);
    } catch {
      return null;
    }
  }
  return audioCache.get(type);
}

/* ── Global ambient audio reference ──────────────────────────────────────── */
let ambientAudioInstance = null;

function getAmbientAudio() {
  if (typeof window === 'undefined') return null;
  if (!ambientAudioInstance) {
    try {
      ambientAudioInstance = new Audio(SOUND_FILES.ambient);
      ambientAudioInstance.loop = true;
      ambientAudioInstance.volume = 0.2; // quiet ambient background
      ambientAudioInstance.preload = 'none';
    } catch {
      ambientAudioInstance = null;
    }
  }
  return ambientAudioInstance;
}

/* ── Hook: useSound ──────────────────────────────────────────────────────── */
export function useSound() {
  const { soundOn } = useAppState();
  const soundOnRef = useRef(soundOn);

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  /**
   * Play a one-shot sound effect ('move' | 'select' | 'open' | 'back').
   * Fails silently if audio is disabled, file is missing, or play() rejects.
   */
  const play = useCallback((type) => {
    if (!soundOnRef.current) return;
    try {
      const original = getAudio(type);
      if (!original) return;

      // Clone or reset time so overlapping sounds trigger cleanly
      const sound = original.cloneNode ? original.cloneNode() : original;
      sound.volume = type === 'move' ? 0.35 : 0.5;
      const playPromise = sound.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          /* Fail silently if file missing or autoplay blocked */
        });
      }
    } catch {
      /* Fail silently */
    }
  }, []);

  return { play };
}

/* ── Ambient Audio Controller (used by AppStateProvider) ──────────────────── */
export function useAmbientSound(soundOn) {
  useEffect(() => {
    const ambient = getAmbientAudio();
    if (!ambient) return;

    if (soundOn) {
      const playPromise = ambient.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          /* Fail silently if ambient.mp3 is missing or blocked */
        });
      }
    } else {
      ambient.pause();
    }
  }, [soundOn]);
}

export default useSound;
