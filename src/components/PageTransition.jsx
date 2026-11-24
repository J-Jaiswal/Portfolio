/**
 * src/components/PageTransition.jsx
 *
 * Game-menu page transition wrapper.
 *
 * Features:
 *   - AnimatePresence mode="wait" keyed on location.pathname.
 *   - Enter: opacity 0→1, x 40→0 over 260ms (easing [0.22, 1, 0.36, 1]).
 *   - Exit:  opacity →0, x →-24 over 160ms.
 *   - POP navigation (back) reverses x direction.
 *   - Amber accent bar fixed at viewport top: sweeps scaleX 0→1 then fades, ~450ms total.
 *   - Reduced motion: 120ms opacity-only fade, no slide, no bar.
 *   - Resets scroll to top on each route change.
 */

import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/* ── Accent Progress Bar ─────────────────────────────────────────────────── */
function AccentBar({ triggerKey }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      key={triggerKey}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'var(--color-accent)',
        transformOrigin: 'left center',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{
        scaleX: [0, 1, 1],
        opacity: [1, 1, 0],
        transition: {
          duration: 0.45,
          times: [0, 0.65, 1],
          ease: 'easeOut',
        },
      }}
    />
  );
}

/* ── Page Transition Wrapper ─────────────────────────────────────────────── */
export default function PageTransition({ children }) {
  const location     = useLocation();
  const navType      = useNavigationType();
  const shouldReduce = useReducedMotion();

  // Reset scroll on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  /* Direction: POP = back (reverse), PUSH/REPLACE = forward */
  const isBack = navType === 'POP';
  const xIn    = isBack ? -40 : 40;
  const xOut   = isBack ? 24  : -24;

  const motionProps = shouldReduce
    ? {
        initial:    { opacity: 0 },
        animate:    { opacity: 1, transition: { duration: 0.12 } },
        exit:       { opacity: 0, transition: { duration: 0.12 } },
      }
    : {
        initial:    { opacity: 0, x: xIn },
        animate:    {
          opacity: 1,
          x: 0,
          transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
        },
        exit:       {
          opacity: 0,
          x: xOut,
          transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <>
      <AccentBar triggerKey={location.pathname} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          {...motionProps}
          style={{ willChange: 'opacity, transform' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
