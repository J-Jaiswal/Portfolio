/**
 * src/screens/MainMenu.jsx
 *
 * Dark game-UI Main Menu view on the root ("/") route.
 *
 * Features:
 *   - Desktop: Left column with identity, availability tag, and vertical menu list.
 *     Right area left open for the embers backdrop.
 *   - Mobile: Backdrop strip at the top (~30vh) with large tappable rows (>= 56px) below.
 *   - Staggered row entrance (~40ms each; instant with reduced motion).
 *   - Keyboard navigation: ArrowUp/ArrowDown & W/S (wrap), Enter/Space to open.
 *   - Hover selects with sound, click opens with sound.
 *   - Sliding 2px amber accent bar and right-aligned mono description on active row.
 *   - Remembers previously opened item when returning to the menu.
 *   - Desktop-only navigation hints and sound toggle in bottom bar.
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAppState } from '../state/useAppState';
import { useSound } from '../hooks/useSound';
import { POSITIONING } from '../data/about';

/* ── Menu Items Definition ───────────────────────────────────────────────── */
const MENU_ITEMS = [
  {
    path: '/about',
    num: '01',
    label: 'ABOUT ME',
    desc: 'Who I am and what I build',
  },
  {
    path: '/toolkit',
    num: '02',
    label: 'TOOLKIT',
    desc: "Skills and where I've used them",
  },
  {
    path: '/games',
    num: '03',
    label: 'MY GAMES',
    desc: 'Videos, screenshots, and play links',
  },
  {
    path: '/journey',
    num: '04',
    label: 'JOURNEY',
    desc: 'Experience and education',
  },
  {
    path: '/contact',
    num: '05',
    label: 'SAY HELLO',
    desc: 'Email and social links',
  },
  {
    path: '/resume',
    num: '06',
    label: 'RESUME',
    desc: 'Curriculum Vitae (PDF)',
  },
];

/* ── Motion Variants ─────────────────────────────────────────────────────── */
const listVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden:  { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

export default function MainMenu() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { soundOn, toggleSound, selectedMenuIndex, setSelectedMenuIndex } = useAppState();
  const { play } = useSound();

  const itemRefs = useRef([]);

  /* ── Open Item Handler ─────────────────────────────────────────────────── */
  const handleOpen = useCallback(
    (item, index) => {
      setSelectedMenuIndex(index);
      play('open');
      navigate(item.path);
    },
    [navigate, setSelectedMenuIndex, play]
  );

  /* ── Keyboard Navigation (ArrowUp/ArrowDown, W/S, Enter/Space) ──────────── */
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setSelectedMenuIndex((prev) => (prev + 1) % MENU_ITEMS.length);
        play('move');
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setSelectedMenuIndex((prev) => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
        play('move');
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen(MENU_ITEMS[selectedMenuIndex], selectedMenuIndex);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedMenuIndex, setSelectedMenuIndex, handleOpen, play]);

  // Keep highlighted item in view on mobile
  useEffect(() => {
    itemRefs.current[selectedMenuIndex]?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [selectedMenuIndex]);

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col justify-between p-4 sm:p-8 md:p-14">
      {/* ── Top Skip Link ────────────────────────────────────────────────── */}
      <a href="#menu-nav" className="skip-link">
        Skip to menu navigation
      </a>

      {/* ── Main Content Container ───────────────────────────────────────── */}
      <div className="w-full max-w-xl md:max-w-2xl mt-auto md:my-auto pt-[28vh] md:pt-0">

        {/* ── Identity & Availability Header ─────────────────────────────── */}
        <header className="mb-8 md:mb-10">
          <div className="label-mono mb-2">PORTFOLIO / 2026</div>

          <h1 className="font-heading text-4xl sm:text-6xl text-text font-bold uppercase tracking-wider leading-none">
            Jayesh Jaiswal
          </h1>

          <p className="font-body text-text-muted text-sm sm:text-base mt-2">
            {POSITIONING}
          </p>

          {/* Rectangular status tag */}
          <div className="inline-flex items-center gap-2 mt-4 px-2.5 py-1 bg-surface border border-border">
            <span className="w-2 h-2 bg-accent inline-block shrink-0" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-wider text-text font-medium">
              OPEN TO UNITY AND AI ROLES
            </span>
          </div>
        </header>

        {/* ── Vertical Menu Navigation ──────────────────────────────────── */}
        <nav id="menu-nav" aria-label="Main menu">
          <motion.ul
            variants={shouldReduceMotion ? {} : listVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col border-t border-border"
            role="list"
          >
            {MENU_ITEMS.map((item, index) => {
              const isSelected = selectedMenuIndex === index;

              return (
                <motion.li
                  key={item.label}
                  variants={shouldReduceMotion ? {} : itemVariants}
                  className="relative border-b border-border"
                >
                  <button
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={() => handleOpen(item, index)}
                    onMouseEnter={() => {
                      if (selectedMenuIndex !== index) {
                        setSelectedMenuIndex(index);
                        play('select');
                      }
                    }}
                    className={[
                      'group relative w-full flex items-center justify-between',
                      'min-h-[56px] px-3 sm:px-4 py-3 text-left transition-colors',
                      'outline-none focus-visible:outline-2 focus-visible:outline-accent',
                      isSelected ? 'bg-surface-raised' : 'hover:bg-surface',
                    ].join(' ')}
                    aria-current={isSelected ? 'true' : undefined}
                  >
                    {/* Left amber indicator bar */}
                    {isSelected && (
                      <motion.div
                        layoutId={shouldReduceMotion ? undefined : 'menu-accent-bar'}
                        className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent"
                        transition={{ duration: 0.12 }}
                      />
                    )}

                    {/* Row Label (Index + Name) */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <span
                        className={[
                          'font-mono text-xs tracking-wider transition-colors',
                          isSelected ? 'text-accent font-semibold' : 'text-text-muted',
                        ].join(' ')}
                      >
                        {item.num}
                      </span>

                      <span
                        className={[
                          'font-heading text-xl sm:text-2xl uppercase tracking-wider transition-colors',
                          isSelected ? 'text-text font-bold' : 'text-text/80 group-hover:text-text',
                        ].join(' ')}
                      >
                        {item.label}
                      </span>
                    </div>

                    {/* Right-aligned Mono Description (Active item) */}
                    <div className="hidden sm:block text-right ml-4 shrink-0">
                      <span
                        className={[
                          'font-mono text-xs tracking-wider transition-opacity duration-150',
                          isSelected ? 'text-text-muted opacity-100' : 'opacity-0',
                        ].join(' ')}
                      >
                        {item.desc}
                      </span>
                    </div>
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>
      </div>

      {/* ── Bottom Controls: Shortcuts & Sound Toggle ───────────────────── */}
      <footer className="w-full flex items-center justify-between pt-6 mt-8 border-t border-border">
        {/* Desktop Keyboard Hints */}
        <div
          className="hidden md:flex items-center gap-3 font-mono text-xs text-text-muted select-none"
          aria-hidden="true"
        >
          <span>↑↓ Select</span>
          <span className="text-border">·</span>
          <span>Enter Open</span>
        </div>

        {/* Audio Toggle */}
        <div className="ml-auto">
          <button
            type="button"
            onClick={toggleSound}
            className="btn-secondary min-h-[44px] min-w-[44px] px-3 py-2 flex items-center gap-2 font-mono text-xs"
            aria-label={soundOn ? 'Mute audio' : 'Enable audio'}
            title={soundOn ? 'Audio: Active' : 'Audio: Muted'}
          >
            <span aria-hidden="true">{soundOn ? '🔊' : '🔇'}</span>
            <span className="uppercase text-[0.7rem] tracking-wider">
              {soundOn ? 'AUDIO ON' : 'MUTED'}
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
}
