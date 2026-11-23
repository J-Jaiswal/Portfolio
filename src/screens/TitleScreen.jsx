/**
 * src/screens/TitleScreen.jsx
 *
 * Intro screen displayed once per session on the root route ("/").
 *
 * Sequence (< 3s total):
 *   - "JAYESH JAISWAL" large in Barlow Condensed uppercase with wide tracking.
 *   - Thin amber accent divider.
 *   - "INDIE UNITY DEVELOPER" in monospace.
 *   - Thin 1s progress indicator line.
 *   - Quietly pulsing "PRESS START" (opacity pulse only).
 *   - Any keypress, click, or tap advances immediately to the Main Menu.
 *   - Instant display when prefers-reduced-motion is active.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useSound } from '../hooks/useSound';
import { POSITIONING } from '../data/about';

export default function TitleScreen({ onComplete }) {
  const shouldReduceMotion = useReducedMotion();
  const [showPressStart, setShowPressStart] = useState(false);
  const hasAdvanced = useRef(false);
  const { play } = useSound();

  const handleAdvance = useCallback(() => {
    if (hasAdvanced.current) return;
    hasAdvanced.current = true;
    play('open');
    onComplete();
  }, [onComplete, play]);

  // Show "PRESS START" after progress line (~1.2s or instant if reduced motion)
  useEffect(() => {
    const delay = shouldReduceMotion ? 50 : 1200;
    const timer = setTimeout(() => setShowPressStart(true), delay);
    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  // Listen for any keypress to advance
  useEffect(() => {
    function onKeyDown() {
      handleAdvance();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleAdvance]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Welcome screen. Press any key or tap to enter the main menu."
      onClick={handleAdvance}
      className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-accent"
    >
      <div className="flex flex-col items-center max-w-xl w-full">

        {/* ── Heading: JAYESH JAISWAL ───────────────────────────────────── */}
        <motion.h1
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="font-heading text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-widest text-text leading-none"
        >
          Jayesh Jaiswal
        </motion.h1>

        {/* ── Thin Accent Line ──────────────────────────────────────────── */}
        <motion.div
          initial={shouldReduceMotion ? { width: '100%' } : { width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: shouldReduceMotion ? 0 : 0.15 }}
          className="h-[1px] bg-accent my-3 sm:my-4 max-w-xs"
          aria-hidden="true"
        />

        {/* ── Subtitle: POSITIONING ───────────────────────────────────────── */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : 0.3 }}
          className="font-mono text-xs sm:text-sm uppercase tracking-widest text-text-muted max-w-md"
        >
          {POSITIONING}
        </motion.div>

        {/* ── Thin Progress Indicator (1 Second) ────────────────────────── */}
        <div
          className="w-36 sm:w-48 h-[1px] bg-border my-6 overflow-hidden relative"
          aria-hidden="true"
        >
          <motion.div
            initial={shouldReduceMotion ? { width: '100%' } : { width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: shouldReduceMotion ? 0.05 : 1.0,
              ease: 'easeInOut',
              delay: shouldReduceMotion ? 0 : 0.3,
            }}
            className="h-full bg-accent"
          />
        </div>

        {/* ── PRESS START (Quiet Opacity Pulse) ─────────────────────────── */}
        <div className="h-8 flex items-center justify-center">
          {showPressStart && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: [0.35, 1, 0.35] }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.1 }
                  : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
              }
              className="font-mono text-xs sm:text-sm uppercase tracking-widest text-accent font-semibold"
            >
              PRESS START
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}
