/**
 * src/state/AppState.jsx
 *
 * Global state for sound preferences and menu selection persistence.
 * Persists user choices across session and route navigation.
 */

import { useState, useCallback } from 'react';
import { useAmbientSound } from '../hooks/useSound';
import { AppContext } from './context';

function readStorage(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
}

export function AppStateProvider({ children }) {
  const [soundOn, setSoundOn] = useState(() => readStorage('soundOn', false));
  /* Preserves the highlighted menu index when returning to the root menu */
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);

  /* Quiet background ambient audio */
  useAmbientSound(soundOn);

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      writeStorage('soundOn', next);
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        soundOn,
        toggleSound,
        selectedMenuIndex,
        setSelectedMenuIndex,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
