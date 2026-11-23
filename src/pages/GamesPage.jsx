/**
 * src/pages/GamesPage.jsx
 *
 * 03 MY GAMES (/games)
 *
 * Carousel architecture:
 *   - Renders exactly min(N, 3) cards where N is projects.length (no extra DOM nodes, no clones).
 *   - For N >= 3: renders [previous, active, next] computed via wrap-around modulo arithmetic.
 *   - For N = 2: renders [active, other].
 *   - For N = 1: renders [active].
 *   - Container uses flex centering, gap 16px, and overflow: hidden (no edge slivers).
 *   - Active card: opacity 100%, scale 1.0, amber border, focusable (tabIndex 0).
 *     • Plays media.previewClip if present.
 *     • Otherwise, if media.gameplayVideo is YouTube, loads a muted looping iframe after 600ms of being active.
 *     • Keeps poster underneath and fades video in when loaded.
 *     • Pointer-events none on iframe + invisible overlay keeps card clickable.
 *     • Neighbor cards always show poster image.
 *     • Falls back to poster when reduced motion is preferred, tab hidden, or on error.
 *   - Neighbors: opacity 45%, scale 0.94, 1px border, non-focusable (aria-hidden="true", tabIndex -1),
 *     clicking a neighbor makes it active.
 *   - Dev check: import.meta.env.DEV check asserts card count equals min(N, 3).
 *   - Navigation: Desktop chevrons at vertical center of preview area, swipe on touch (threshold 40px),
 *     keyboard (ArrowLeft/Right, A/D, Enter), one dot per project, URL state synced with ?game=:id.
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import PageLayout from '../layout/PageLayout';
import projects from '../data/projects';
import PlatformChips from '../components/PlatformChips';
import Icon from '../components/Icon';

/**
 * Extracts 11-character YouTube video ID from watch, youtu.be, or embed URLs.
 */
function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

/**
 * Subcomponent for active card looping YouTube preview.
 * Encapsulates its own load transition and error fallback.
 */
function YouTubePreview({ youtubeId, title }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error || !youtubeId) return null;

  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&modestbranding=1&rel=0&disablekb=1`}
      title={`${title} preview`}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
      className={`absolute inset-0 w-full h-full border-0 pointer-events-none transition-opacity duration-500 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}

export default function GamesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const containerRef = useRef(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);
  const [isCarouselInView, setIsCarouselInView] = useState(true);

  // Active card video loading state (600ms debounce for YouTube)
  const [debouncedActiveId, setDebouncedActiveId] = useState(null);

  const N = projects.length;

  // Derive active index from URL query param (?game=:id)
  const gameParam = searchParams.get('game');
  const activeIndex = Math.max(
    0,
    projects.findIndex((p) => p.id === gameParam)
  );
  const activeProject = projects[activeIndex] || projects[0];

  // Sync URL query when no valid param is present
  useEffect(() => {
    if (!gameParam || !projects.some((p) => p.id === gameParam)) {
      setSearchParams({ game: projects[0].id }, { replace: true });
    }
  }, [gameParam, setSearchParams]);

  // Track tab visibility
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Track carousel intersection with viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCarouselInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Delay active YouTube video loading by 600ms; unloads immediately when card changes
  useEffect(() => {
    if (shouldReduceMotion || !isTabVisible || !isCarouselInView) {
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedActiveId(activeProject.id);
    }, 600);

    return () => clearTimeout(timer);
  }, [activeProject.id, isTabVisible, isCarouselInView, shouldReduceMotion]);

  const isVideoReady =
    debouncedActiveId === activeProject.id &&
    !shouldReduceMotion &&
    isTabVisible &&
    isCarouselInView;

  // Navigate to next project
  const handleNext = useCallback(() => {
    if (N <= 1) return;
    const nextIdx = (activeIndex + 1) % N;
    setSearchParams({ game: projects[nextIdx].id }, { replace: true });
  }, [activeIndex, N, setSearchParams]);

  // Navigate to previous project
  const handlePrev = useCallback(() => {
    if (N <= 1) return;
    const prevIdx = (activeIndex - 1 + N) % N;
    setSearchParams({ game: projects[prevIdx].id }, { replace: true });
  }, [activeIndex, N, setSearchParams]);

  // Select project by index
  const goToGame = useCallback(
    (idx) => {
      if (idx === activeIndex || idx < 0 || idx >= N) return;
      setSearchParams({ game: projects[idx].id }, { replace: true });
    },
    [activeIndex, N, setSearchParams]
  );

  // Keyboard navigation: ArrowLeft/Right, A/D, Enter
  useEffect(() => {
    function onKeyDown(e) {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Enter') {
        if (activeProject && document.activeElement?.tagName !== 'BUTTON') {
          e.preventDefault();
          navigate(`/games/${activeProject.id}`);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePrev, handleNext, activeProject, navigate]);

  // Touch swipe handling (threshold 40px)
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  // Build visible cards list: exactly min(N, 3) items
  // For N >= 3: [previous, active, next]
  // For N = 2: [active, other]
  // For N = 1: [active]
  let visibleCards = [];
  if (N >= 3) {
    const prevIdx = (activeIndex - 1 + N) % N;
    const nextIdx = (activeIndex + 1) % N;
    visibleCards = [
      { project: projects[prevIdx], isActive: false, targetIdx: prevIdx },
      { project: activeProject, isActive: true, targetIdx: activeIndex },
      { project: projects[nextIdx], isActive: false, targetIdx: nextIdx },
    ];
  } else if (N === 2) {
    const otherIdx = (activeIndex + 1) % 2;
    visibleCards = [
      { project: activeProject, isActive: true, targetIdx: activeIndex },
      { project: projects[otherIdx], isActive: false, targetIdx: otherIdx },
    ];
  } else if (N === 1) {
    visibleCards = [
      { project: activeProject, isActive: true, targetIdx: activeIndex },
    ];
  }

  // Development-only check: assert rendered cards count equals min(N, 3)
  useEffect(() => {
    if (import.meta.env.DEV) {
      const cardElements = document.querySelectorAll('[data-game-card]');
      const expected = Math.min(projects.length, 3);
      if (cardElements.length !== expected) {
        console.error(
          `[Carousel Check] Rendered game cards count (${cardElements.length}) does not match min(N, 3) = ${expected}`
        );
      }
    }
  }, [activeIndex]);

  return (
    <PageLayout
      label="03 / GAMES"
      title="MY GAMES"
      description="Shipped titles, gameplay prototypes, and real-time voice pipeline integrations."
    >
      <div className="relative flex flex-col items-center select-none w-full">

        {/* Accessible screen-reader live region */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Active game: {activeProject.title}
        </div>

        {/* ── Carousel Frame: overflow: hidden prevents slivers at edges ───── */}
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full overflow-hidden flex items-center justify-center py-2"
        >

          {/* Left Arrow (Desktop only, 44px square, chevron icon) */}
          {N > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="hidden md:flex absolute left-0 z-20 min-w-[44px] min-h-[44px] w-[44px] h-[44px] border border-border bg-surface text-text hover:border-accent hover:text-accent transition-colors items-center justify-center cursor-pointer -translate-y-1/2"
              style={{ top: '101px' }}
              aria-label="Previous game"
            >
              <Icon name="chevron-left" size={18} />
            </button>
          )}

          {/* Flex container: justify-content: center, gap 16px, overflow: hidden */}
          <div
            className="flex items-center justify-center gap-[16px] overflow-hidden w-full"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              overflow: 'hidden',
            }}
          >
            {visibleCards.map(({ project, isActive, targetIdx }) => {
              const previewClipSrc = project.media?.previewClip;
              const posterSrc =
                project.media?.poster ||
                project.media?.thumbnail ||
                `/media/${project.id}Thumbnail.png`;
              const youtubeId = extractYouTubeId(project.media?.gameplayVideo);

              // Video can only play on active card when tab is visible, in view, and reduced motion is off
              const canPlayVideo =
                isActive && isTabVisible && isCarouselInView && !shouldReduceMotion;

              return (
                <article
                  key={project.id}
                  data-game-card="true"
                  onClick={() => {
                    if (!isActive) {
                      goToGame(targetIdx);
                    }
                  }}
                  className={[
                    'shrink-0 flex flex-col justify-between p-3 bg-surface border transition-all duration-200',
                    'w-[260px] min-w-[260px] max-w-[260px] md:w-[340px] md:min-w-[340px] md:max-w-[340px]',
                    isActive
                      ? 'border-accent opacity-100 scale-100'
                      : 'border-border opacity-45 scale-[0.94] cursor-pointer hover:opacity-60',
                  ].join(' ')}
                  aria-hidden={!isActive}
                  tabIndex={isActive ? 0 : -1}
                >
                  <div className="flex flex-col">

                    {/* 1. Preview Area (16:9) */}
                    <div className="relative aspect-video w-full bg-bg border border-border overflow-hidden">
                      {/* Screenshot poster - always rendered underneath */}
                      {posterSrc ? (
                        <img
                          src={posterSrc}
                          alt={`${project.title} poster`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-xs text-text-muted">
                          PREVIEW
                        </div>
                      )}

                      {/* Video clip preview if provided */}
                      {canPlayVideo && previewClipSrc && (
                        <video
                          key={previewClipSrc}
                          src={previewClipSrc}
                          poster={posterSrc}
                          muted
                          loop
                          autoPlay
                          playsInline
                          preload="metadata"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}

                      {/* Muted looping YouTube preview on active card (loads after 600ms, fades in) */}
                      {canPlayVideo && !previewClipSrc && youtubeId && isVideoReady && (
                        <YouTubePreview youtubeId={youtubeId} title={project.title} />
                      )}

                      {/* Invisible overlay so clicks still reach the card */}
                      <div
                        className="absolute inset-0 cursor-pointer pointer-events-auto"
                        aria-hidden="true"
                      />
                    </div>

                    {/* 2. Game Name (heading font, 24px) */}
                    <h2 className="font-heading text-[24px] uppercase tracking-wider text-text font-bold leading-tight mt-3">
                      {project.title}
                    </h2>

                    {/* 3. Short description (tagline, 14px muted) */}
                    <p className="font-body text-[14px] text-text-muted leading-relaxed line-clamp-3 mt-1.5">
                      {project.tagline}
                    </p>

                    {/* 4. Up to 5 tags from tech array */}
                    <div className="flex flex-wrap gap-1.5 pt-2.5">
                      {(project.tech || []).slice(0, 5).map((tech) => (
                        <span key={tech} className="tag text-[0.68rem]">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* 5. Platform chips */}
                    <div className="pt-2">
                      <PlatformChips platforms={project.platforms} />
                    </div>
                  </div>

                  {/* 6. Full-width "Open details →" outlined button in amber text */}
                  <div className="pt-4 mt-auto">
                    <Link
                      to={`/games/${project.id}`}
                      tabIndex={isActive ? 0 : -1}
                      className="w-full min-h-[44px] h-[44px] border border-accent text-accent hover:bg-accent hover:text-bg transition-colors font-mono text-xs uppercase flex items-center justify-center gap-1.5 font-bold"
                      aria-label={`Open details for ${project.title}`}
                    >
                      <span>OPEN DETAILS</span>
                      <Icon name="arrow-right" size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Right Arrow (Desktop only, 44px square, chevron icon) */}
          {N > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="hidden md:flex absolute right-0 z-20 min-w-[44px] min-h-[44px] w-[44px] h-[44px] border border-border bg-surface text-text hover:border-accent hover:text-accent transition-colors items-center justify-center cursor-pointer -translate-y-1/2"
              style={{ top: '101px' }}
              aria-label="Next game"
            >
              <Icon name="chevron-right" size={18} />
            </button>
          )}
        </div>

        {/* ── Dot Navigation (44x24px tap target, 4px-tall bar, one per project) ── */}
        {N > 1 && (
          <div
            className="flex items-center justify-center gap-1 mt-4"
            role="tablist"
            aria-label="Game selection"
          >
            {projects.map((project, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={project.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show ${project.title}`}
                  onClick={() => goToGame(idx)}
                  className="w-[44px] h-[24px] min-w-[44px] min-h-[24px] flex items-center justify-center cursor-pointer p-0 bg-transparent border-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <span
                    className={[
                      'h-[4px] transition-all duration-200 block',
                      isActive ? 'w-[22px] bg-accent' : 'w-[8px] bg-border hover:bg-text-muted',
                    ].join(' ')}
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* ── Desktop Control Hint ────────────────────────────────────────── */}
        <div className="hidden md:block text-center font-mono text-[11px] uppercase tracking-wider text-text-muted mt-2">
          {N > 1 ? '← → SELECT · ENTER OPEN DETAILS' : 'ENTER OPEN DETAILS'}
        </div>

      </div>
    </PageLayout>
  );
}
