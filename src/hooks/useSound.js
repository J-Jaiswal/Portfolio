/**
 * src/hooks/useSound.js
 *
 * Thin React wrapper around the src/lib/sound.js singleton.
 * Provides play() for one-shot sound effects.
 *
 * Audio assets expected in public/audio/:
 *   - /audio/move.mp3    — hover/focus tick (throttled 80ms)
 *   - /audio/select.mp3  — click / open
 *   - /audio/nav.mp3     — page navigation
 *
 * Rules:
 *   - Fails completely silently if file missing or playback blocked.
 *   - 'back', 'open' are aliased to existing sounds for backwards compatibility.
 */

import { useCallback } from 'react';
import { play as soundPlay } from '../lib/sound';

/* Map legacy sound names to the new simplified set */
const NAME_MAP = {
  move:   'move',
  select: 'select',
  open:   'select',   // alias: open → select
  back:   'nav',      // alias: back → nav
  nav:    'nav',
};

/* ── Hook: useSound ─────────────────────────────────────────────────────── */
export function useSound() {
  const play = useCallback((type) => {
    const mapped = NAME_MAP[type] ?? type;
    soundPlay(mapped);
  }, []);

  return { play };
}

export default useSound;
