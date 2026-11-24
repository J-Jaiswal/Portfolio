/**
 * src/state/AppState.jsx
 *
 * Global state for sound preferences and menu selection persistence.
 * Persists user choices across session and route navigation.
 *
 * NOTE: Ambient/background audio has been removed. Sound is managed by
 *       src/lib/sound.js singleton. AppState only holds UI mute toggle
 *       state, keeping it in sync with the singleton.
 */

import { useState, useCallback, useEffect } from 'react';
import { AppContext } from './context';
import { isMuted, setMuted, subscribe } from '../lib/sound';

export function AppStateProvider({ children }) {
  /* Sync initial mute state from sound singleton */
  const [soundOn, setSoundOnState] = useState(() => !isMuted());

  /* Preserves the highlighted menu index when returning to the root menu */
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);

  /* Keep local state in sync when singleton changes (e.g. another tab) */
  useEffect(() => {
    const unsub = subscribe((mutedValue) => {
      setSoundOnState(!mutedValue);
    });
    return unsub;
  }, []);

  const toggleSound = useCallback(() => {
    const nextMuted = !isMuted();
    setMuted(nextMuted);
    setSoundOnState(!nextMuted);
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
