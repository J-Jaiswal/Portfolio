/**
 * src/lib/motion.js
 *
 * Shared Framer Motion variants for page-level stagger animations.
 *
 * Usage:
 *   import { stagger, item } from '../lib/motion';
 *   <motion.ul variants={stagger}>
 *     <motion.li variants={item}>...</motion.li>
 *   </motion.ul>
 *
 * - stagger: container variant that staggers children 40ms apart.
 * - item: child variant that fades + slides in from x: 16.
 * - Respects prefers-reduced-motion by keeping stagger timing
 *   but eliminating x offset (consumers should use useReducedMotion).
 */

export const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

export const item = {
  hidden:  { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Reduced-motion safe version of item — opacity only, no slide */
export const itemReduced = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.12 },
  },
};
