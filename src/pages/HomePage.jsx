/**
 * src/pages/HomePage.jsx
 *
 * Root launcher page at "/".
 * Manages TitleScreen vs MainMenu presentation.
 *
 * Rules:
 *   - TitleScreen is shown once per browser session (tracked via sessionStorage).
 *   - EmbersBackdrop sits behind TitleScreen and MainMenu on "/" only.
 *   - Direct visits to other paths (e.g. /about) skip TitleScreen completely.
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EmbersBackdrop from '../backdrop/EmbersBackdrop';
import TitleScreen from '../screens/TitleScreen';
import MainMenu from '../screens/MainMenu';

const SESSION_KEY = 'portfolio_title_seen';

function checkTitleSeen() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

function markTitleSeen() {
  try {
    sessionStorage.setItem(SESSION_KEY, 'true');
  } catch {
    /* noop */
  }
}

export default function HomePage() {
  const [hasSeenTitle, setHasSeenTitle] = useState(() => checkTitleSeen());

  useEffect(() => {
    document.title = 'Jayesh Jaiswal | Unity developer building AI-powered game experiences';
  }, []);

  const handleTitleComplete = () => {
    markTitleSeen();
    setHasSeenTitle(true);
  };

  return (
    <div className="relative min-h-screen bg-bg text-text overflow-hidden">
      {/* ── Embers Canvas Backdrop (Exclusive to "/") ─────────────────── */}
      <EmbersBackdrop isMobileStrip={hasSeenTitle} />

      {/* ── Screen Orchestrator (TitleScreen vs MainMenu) ─────────────── */}
      <AnimatePresence mode="wait">
        {!hasSeenTitle ? (
          <motion.div
            key="title-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="w-full min-h-screen flex items-center justify-center"
          >
            <TitleScreen onComplete={handleTitleComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="main-menu"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full min-h-screen"
          >
            <MainMenu />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
