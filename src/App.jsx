/**
 * src/App.jsx
 *
 * Root orchestrator with React Router DOM real path routing.
 *
 * Routes:
 *   /           → HomePage (Title Screen on first visit, then Main Menu with EmbersBackdrop)
 *   /about      → About Me
 *   /toolkit    → Toolkit
 *   /games      → My Games
 *   /games/:id  → Case Study Detail
 *   /journey    → Journey
 *   /contact    → Say Hello
 *   *           → Redirects to /
 *
 * Performance:
 *   All pages are lazy-loaded with React.lazy + Suspense dark skeleton fallback.
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppStateProvider } from './state/AppState';

/* ── Lazy Loaded Pages ──────────────────────────────────────────────────── */
const HomePage       = lazy(() => import('./pages/HomePage'));
const AboutPage      = lazy(() => import('./pages/AboutPage'));
const ToolkitPage    = lazy(() => import('./pages/ToolkitPage'));
const GamesPage      = lazy(() => import('./pages/GamesPage'));
const GameDetailPage = lazy(() => import('./pages/GameDetailPage'));
const JourneyPage    = lazy(() => import('./pages/JourneyPage'));
const ContactPage    = lazy(() => import('./pages/ContactPage'));
const ResumePage     = lazy(() => import('./pages/ResumePage'));

/* ── Dark Skeleton Loading Fallback ─────────────────────────────────────── */
function PageFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen bg-bg text-text flex items-center justify-center p-6 select-none"
    >
      <div className="card p-6 border border-border flex items-center gap-3">
        <span className="w-2.5 h-2.5 bg-accent animate-pulse" aria-hidden="true" />
        <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
          INITIALIZING VIEW…
        </span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/toolkit" element={<ToolkitPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/games/space-go" element={<Navigate to="/games?game=pursuit" replace />} />
            <Route path="/games/:id" element={<GameDetailPage />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppStateProvider>
  );
}
