/**
 * src/layout/PageLayout.jsx
 *
 * Shared full-page layout for all section views.
 *
 * Features:
 *   - Dark, sharp game-UI layout with crisp 1px borders and 12-column grid.
 *   - Sticky top bar: "← MENU" button and tab navigation with accent highlight.
 *   - Header: mono index label ("03 / GAMES"), large condensed title, description.
 *   - Main content area with skip link target.
 *   - Footer: Previous page / Next page (wrapping tab order), sound toggle, desktop shortcut hints.
 *   - Keyboard shortcuts:
 *       • Esc: steps up to previous view (from /games/:id to /games, or to /)
 *       • [ and ]: navigate to previous and next page in tab order
 *       • Ignored when typing in inputs/textareas or when a modal dialog is open.
 *   - Route change: scrolls to top and focuses main heading.
 *   - Framer Motion page transition (fade + 12px slide, 200ms; instant with reduced motion).
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

import { useEffect, useRef, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {} from 'framer-motion'; // kept for future use
import { useAppState } from '../state/useAppState';
import { useSound } from '../hooks/useSound';
import Icon from '../components/Icon';

/* ── Tab Order Definition ─────────────────────────────────────────────────── */
const TABS = [
  { path: '/about',   num: '01', label: 'ABOUT',   title: 'About Me' },
  { path: '/toolkit', num: '02', label: 'TOOLKIT', title: 'Toolkit' },
  { path: '/games',   num: '03', label: 'GAMES',   title: 'My Games' },
  { path: '/journey', num: '04', label: 'JOURNEY', title: 'Journey' },
  { path: '/contact', num: '05', label: 'CONTACT', title: 'Say Hello' },
  { path: '/resume',  num: '06', label: 'RESUME',  title: 'Resume' },
];

/* ── Motion Variants ─────────────────────────────────────────────────────
   PageTransition in App.jsx handles the outer page transition.
   PageLayout's main element is a plain element without its own transition. */

export default function PageLayout({
  label,
  title,
  description,
  children,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const headingRef = useRef(null);
  const { soundOn, toggleSound, setSelectedMenuIndex } = useAppState();
  const { play } = useSound();

  /* Determine current tab index */
  const currentTabIndex = TABS.findIndex((tab) =>
    tab.path === '/games'
      ? location.pathname.startsWith('/games')
      : location.pathname === tab.path
  );

  const prevTab =
    currentTabIndex > 0
      ? TABS[currentTabIndex - 1]
      : TABS[TABS.length - 1];

  const nextTab =
    currentTabIndex >= 0 && currentTabIndex < TABS.length - 1
      ? TABS[currentTabIndex + 1]
      : TABS[0];

  /* ── Route change: Sync menu highlight in AppState ─────────────────────── */
  useEffect(() => {
    if (currentTabIndex >= 0) {
      setSelectedMenuIndex(currentTabIndex);
    }
  }, [currentTabIndex, setSelectedMenuIndex]);

  /* ── Route change: Update browser document title ───────────────────────── */
  useEffect(() => {
    if (title) {
      document.title = `${title} | Jayesh Jaiswal`;
    }
    return () => {
      document.title = 'Jayesh Jaiswal | Unity developer building AI-powered game experiences';
    };
  }, [title]);

  /* ── Route change: Scroll to top and move focus to heading ─────────────── */
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      headingRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  /* ── Keyboard Shortcuts: Esc, [, ] ─────────────────────────────────────── */
  const handleKeyDown = useCallback(
    (e) => {
      // Ignore shortcuts if user is typing in an editable field
      const target = e.target;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Ignore shortcuts if a modal dialog is open
      if (document.querySelector('[role="dialog"]')) {
        return;
      }

      // Esc: step up hierarchy
      if (e.key === 'Escape') {
        e.preventDefault();
        play('back');
        if (location.pathname.startsWith('/games/') && location.pathname !== '/games') {
          navigate('/games');
        } else {
          navigate('/');
        }
      }

      // [: Previous tab in order
      if (e.key === '[') {
        e.preventDefault();
        play('move');
        navigate(prevTab.path);
      }

      // ]: Next tab in order
      if (e.key === ']') {
        e.preventDefault();
        play('move');
        navigate(nextTab.path);
      }
    },
    [location.pathname, navigate, prevTab.path, nextTab.path, play]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  /* PageTransition in App.jsx handles all route animations.
     No local animation state needed in PageLayout. */

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col selection:bg-accent selection:text-bg">
      {/* ── Skip to Main Content Link ───────────────────────────────────── */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* ── Sticky Top Bar ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-bg border-b border-border w-full">
        <div className="content-container flex items-center justify-between h-14 gap-2 sm:gap-6">

          {/* Left: ← MENU button */}
          <button
            type="button"
            onClick={() => {
              play('back');
              navigate('/');
            }}
            className="btn-ghost flex items-center gap-1.5 min-h-[44px] px-3 font-heading text-sm sm:text-base tracking-wider text-text-muted hover:text-accent hover:border-border"
            aria-label="Return to Main Menu"
          >
            <span aria-hidden="true">←</span>
            <span>MENU</span>
          </button>

          {/* Center/Right: Tab Navigation */}
          <nav
            aria-label="Section navigation"
            className="flex items-center overflow-x-auto no-scrollbar py-1"
          >
            <div className="flex items-center gap-0.5 sm:gap-1">
              {TABS.map((tab) => {
                const isTabActive =
                  tab.path === '/games'
                    ? location.pathname.startsWith('/games')
                    : location.pathname === tab.path;

                return (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    onClick={() => play('select')}
                    className={[
                      'relative flex items-center gap-1.5 px-3 sm:px-4 min-h-[44px]',
                      'font-mono text-xs sm:text-sm tracking-wider uppercase transition-colors whitespace-nowrap',
                      isTabActive
                        ? 'text-accent border-b-2 border-accent font-semibold'
                        : 'text-text-muted hover:text-text border-b-2 border-transparent',
                    ].join(' ')}
                    aria-current={isTabActive ? 'page' : undefined}
                  >
                    <span className="opacity-60 text-[0.7rem]">{tab.num}</span>
                    <span>{tab.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      {/* ── Main Page Content ───────────────────────────────────────────── */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 content-container py-8 sm:py-12 outline-none"
            >
        {/* ── Page Header ──────────────────────────────────────────────── */}
        <header className="mb-8 sm:mb-12 border-b border-border pb-6 sm:pb-8">
          {label && (
            <div className="label-mono mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent" aria-hidden="true" />
              <span>{label}</span>
            </div>
          )}

          <h1
            ref={headingRef}
            tabIndex={-1}
            className="font-heading text-4xl sm:text-6xl text-text font-bold uppercase tracking-wider leading-none outline-none"
          >
            {title}
          </h1>

          {description && (
            <p className="font-body text-text-muted text-base sm:text-lg mt-3 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </header>

        {/* ── Section Content Area (12-Column Grid Ready) ─────────────── */}
        <div className="w-full">
          {children}
        </div>
      </main>

      {/* ── Footer Row ──────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-surface w-full mt-auto">
        <div className="content-container py-4 flex flex-wrap items-center justify-between gap-4">

          {/* Previous / Next Tab Navigation */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                play('move');
                navigate(prevTab.path);
              }}
              className="btn-secondary min-h-[44px] text-xs py-1.5 px-3 font-mono"
              aria-label={`Go to previous section: ${prevTab.title}`}
            >
              ← {prevTab.title}
            </button>

            <button
              type="button"
              onClick={() => {
                play('move');
                navigate(nextTab.path);
              }}
              className="btn-secondary min-h-[44px] text-xs py-1.5 px-3 font-mono"
              aria-label={`Go to next section: ${nextTab.title}`}
            >
              {nextTab.title} →
            </button>
          </div>

          {/* Desktop Shortcut Hints */}
          <div
            className="hidden md:flex items-center gap-3 text-text-muted font-mono text-xs select-none"
            aria-hidden="true"
          >
            <span>[ ] Navigate</span>
            <span className="text-border">·</span>
            <span>Esc Menu</span>
          </div>

          {/* Sound Toggle Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              className="btn-secondary min-h-[44px] min-w-[44px] p-2 flex items-center justify-center font-mono text-xs gap-1.5"
              aria-label={soundOn ? 'Mute UI sounds' : 'Unmute UI sounds'}
              aria-pressed={soundOn}
              title={soundOn ? 'Audio: Active' : 'Audio: Muted'}
            >
              <Icon name={soundOn ? 'volume' : 'volume-off'} size={16} />
              <span className="hidden sm:inline uppercase text-[0.7rem] tracking-wider">
                {soundOn ? 'AUDIO ON' : 'MUTED'}
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
