/**
 * src/pages/GameDetailPage.jsx
 *
 * Detailed Case Study view for /games/:id.
 *
 * Layout Structure:
 *   - PageLayout header provides breadcrumb ("03 / GAMES / BUDDY"), title, and tagline.
 *   - "← BACK TO GAMES" button sits directly below the header divider.
 *   - On desktop (>= 1024px, lg:): Two-column layout:
 *       • Left column (8/12): Media block (VideoPlayer + screenshot column) and Overview.
 *       • Right column (4/12, sticky): Platform chips, Action bar, Device note, Quick facts, Tech stack.
 *   - On mobile (< 1024px): Stacks in order: Media block, Overview, Platform chips, Action bar,
 *     Device note, Quick facts, Tech stack, Footer.
 *   - Footer row: Previous game, centered "01 / 03" counter, Next game.
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
import projects from '../data/projects';
import PlatformChips from '../components/PlatformChips';
import VideoPlayer from '../components/VideoPlayer';
import Icon from '../components/Icon';
import {
  detectPlatform,
  isPlaySupported,
  isDownloadSupported,
  getPlatformIncompatibilityNotice,
} from '../utils/platform';
import { isPlaceholder, stripPlaceholders } from '../utils/placeholders';

/* ── Fullscreen Accessible Lightbox Component ───────────────────────────── */
function Lightbox({ screenshots, initialIndex, onClose, triggerRefs }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState(null);
  const lightboxRef = useRef(null);
  const closeBtnRef = useRef(null);

  const total = screenshots.length;
  const current = screenshots[currentIndex] || {};

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handleClose = useCallback(() => {
    onClose();
    requestAnimationFrame(() => {
      triggerRefs?.current?.[initialIndex]?.focus();
    });
  }, [onClose, triggerRefs, initialIndex]);

  /* Keyboard listener for lightbox */
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleClose, handlePrev, handleNext]);

  /* Focus management: Focus close button on mount */
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  /* Focus trap */
  useEffect(() => {
    function trap(e) {
      if (e.key !== 'Tab' || !lightboxRef.current) return;
      const focusables = Array.from(
        lightboxRef.current.querySelectorAll('button:not([disabled])')
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener('keydown', trap);
    return () => window.removeEventListener('keydown', trap);
  }, []);

  /* Touch swipe */
  const onTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) handleNext();
    else if (diff < -45) handlePrev();
    setTouchStartX(null);
  };

  return (
    <div
      ref={lightboxRef}
      role="dialog"
      aria-modal="true"
      aria-label="Screenshot preview modal"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="fixed inset-0 z-50 bg-bg/95 backdrop-blur-none flex flex-col justify-between p-4 sm:p-6 select-none"
    >
      {/* Top Bar: Counter & Close Button */}
      <div className="w-full flex items-center justify-between border-b border-border pb-3 max-w-6xl mx-auto">
        <span className="font-mono text-xs text-text-muted">
          IMAGE {currentIndex + 1} OF {total}
        </span>
        <button
          ref={closeBtnRef}
          type="button"
          onClick={handleClose}
          className="btn-secondary min-h-[44px] min-w-[44px] px-3 font-mono text-sm uppercase"
          aria-label="Close screenshot preview"
        >
          CLOSE [ESC]
        </button>
      </div>

      {/* Main Image View */}
      <div className="relative flex-1 flex items-center justify-center max-w-6xl w-full mx-auto my-4 overflow-hidden">
        {total > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 z-10 btn-secondary min-h-[44px] min-w-[44px] p-2 flex items-center justify-center cursor-pointer"
            aria-label="Previous screenshot"
          >
            <Icon name="chevron-left" size={18} />
          </button>
        )}

        <img
          src={current.src}
          alt={current.alt || `Screenshot ${currentIndex + 1}`}
          className="max-h-[72vh] max-w-full object-contain border border-border"
        />

        {total > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 z-10 btn-secondary min-h-[44px] min-w-[44px] p-2 flex items-center justify-center cursor-pointer"
            aria-label="Next screenshot"
          >
            <Icon name="chevron-right" size={18} />
          </button>
        )}
      </div>

      {/* Caption Bar (hidden if empty or only TODO) */}
      {(() => {
        const cleanCaption = stripPlaceholders(
          current.caption || '',
          'projects.js',
          `screenshot[${currentIndex}].caption`
        );
        if (!cleanCaption) return null;

        return (
          <div className="w-full max-w-4xl mx-auto text-center border-t border-border pt-3">
            <p className="font-mono text-xs text-text-muted leading-relaxed">
              {cleanCaption}
            </p>
          </div>
        );
      })()}
    </div>
  );
}

/* ── Main Extended Case Study View ───────────────────────────────────────── */
export default function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadBrowserPlay, setLoadBrowserPlay] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [platformNotice, setPlatformNotice] = useState(null);
  const [prevId, setPrevId] = useState(id);
  const [brokenImages, setBrokenImages] = useState({});

  // Clear notice and reset browser player when route param id changes
  if (prevId !== id) {
    setPrevId(id);
    setPlatformNotice(null);
    setLoadBrowserPlay(false);
    setBrokenImages({});
  }

  const thumbRefs = useRef([]);
  const project = projects.find((p) => p.id === id);

  // Esc key steps back to /games?game=:id (when lightbox is closed)
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape' && !lightboxOpen && project) {
        e.preventDefault();
        navigate(`/games?game=${project.id}`);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, project, navigate]);

  // Early return if project ID is not found (after all hooks)
  if (!project) {
    return <Navigate to="/games" replace />;
  }

  const currentIndex = projects.findIndex((p) => p.id === project.id);
  const prevGame =
    currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1];
  const nextGame =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];

  const visitorPlatform = detectPlatform();
  const isPlayActionSupported = isPlaySupported(project.platforms, visitorPlatform);
  const isDownloadActionSupported = isDownloadSupported(project.platforms, visitorPlatform);

  // Handle Play button click
  const handlePlayClick = (e) => {
    if (!isPlayActionSupported) {
      e.preventDefault();
      setPlatformNotice(
        getPlatformIncompatibilityNotice('play', project.platforms)
      );
    } else {
      setPlatformNotice(null);
    }
  };

  // Handle Download button click
  const handleDownloadClick = (e) => {
    if (!isDownloadActionSupported) {
      e.preventDefault();
      setPlatformNotice(
        getPlatformIncompatibilityNotice('download', project.platforms)
      );
    } else {
      setPlatformNotice(null);
    }
  };

  // Handle GitHub click (always clears notice)
  const handleGitHubClick = () => {
    setPlatformNotice(null);
  };

  // Quick facts: Role, Core system, Engine, Duration. (Platform removed per spec).
  const quickFacts = [
    { label: 'Role', value: project.role, field: 'role' },
    { label: 'Core system', value: project.coreSystem, field: 'coreSystem' },
    { label: 'Engine', value: project.engine, field: 'engine' },
    { label: 'Duration', value: project.duration, field: 'duration' },
  ].filter(
    (fact) =>
      !isPlaceholder(fact.value, 'projects.js', `${project.id}.${fact.field}`)
  );

  const techStack = project.tech || [];

  // Filter out any placeholder / TODO screenshot entries
  const validScreenshots = (project.media?.screenshots || []).filter(
    (shot, idx) =>
      !isPlaceholder(shot.src, 'projects.js', `screenshot[${idx}].src`)
  );
  const totalScreenshots = validScreenshots.length;
  const displayCount = Math.min(totalScreenshots, 3);
  const visibleThumbnails = validScreenshots.slice(0, 3);

  const cleanOverview = stripPlaceholders(
    project.overview,
    'projects.js',
    `${project.id}.overview`
  );

  const formattedIndex = `0${currentIndex + 1} / 0${projects.length}`;

  const posterPath = `/media/${project.id}Thumbnail.png`;

  const hasPlayLink = !isPlaceholder(project.links?.play) && Boolean(project.links?.play);
  const hasDownloadLink = !isPlaceholder(project.links?.download) && Boolean(project.links?.download);
  const hasGitHubLink = !isPlaceholder(project.links?.github) && Boolean(project.links?.github);
  const hasWebglLink = !isPlaceholder(project.links?.webglEmbed) && Boolean(project.links?.webglEmbed);

  return (
    <PageLayout
      label={`03 / GAMES / ${project.id.toUpperCase()}`}
      title={project.title}
      description={project.tagline}
    >
      <div className="w-full flex flex-col items-start text-left">

        {/* ── 1. "← BACK TO GAMES" Button directly below header divider ────── */}
        <div className="mb-6 sm:mb-8">
          <Link
            to={`/games?game=${project.id}`}
            className="inline-flex items-center gap-2 min-h-[44px] h-[44px] px-4 border border-border bg-surface text-text font-mono text-xs uppercase hover:border-accent hover:text-accent transition-colors"
          >
            <Icon name="arrow-left" size={14} />
            <span>BACK TO GAMES</span>
          </Link>
        </div>

        {/* ── 2. Two-Column Layout on lg (>=1024px), Single Column below 1024px ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start w-full">

          {/* ══════════════════════════════════════════════════════════════════
              LEFT COLUMN (8/12 on lg): Media Block + Overview
             ══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 flex flex-col items-start w-full">

            {/* ── Media Block (Video + Screenshot Thumbnails) ──────────────── */}
            <section aria-label="Game media presentation" className="w-full max-w-[720px]">
              {totalScreenshots > 0 ? (
                /* Desktop (>= 640px): 2-column grid (video + 132px vertical column of up to 3 thumbnails)
                   Mobile (< 640px): video full width + 3-column row of up to 3 thumbnails directly below */
                <div className="flex flex-col sm:grid sm:grid-cols-[1fr_132px] gap-[6px] sm:gap-[12px] sm:items-stretch w-full">
                  {/* Gameplay Video Player */}
                  <VideoPlayer
                    videoUrl={project.media?.gameplayVideo}
                    poster={posterPath}
                    title={project.title}
                    resetKey={`${project.id}-${activePhotoIdx}-${lightboxOpen}`}
                  />

                  {/* Screenshot Thumbnails (132px column desktop, 3-col row mobile) */}
                  <div
                    className={[
                      'grid gap-[6px] sm:gap-[12px] w-full sm:w-[132px] sm:h-full',
                      displayCount === 1 ? 'grid-cols-1' : displayCount === 2 ? 'grid-cols-2' : 'grid-cols-3',
                      'sm:grid-cols-1',
                      displayCount === 1 ? 'sm:grid-rows-1' : displayCount === 2 ? 'sm:grid-rows-2' : 'sm:grid-rows-3',
                    ].join(' ')}
                  >
                    {visibleThumbnails.map((shot, idx) => {
                      const isThirdWithExtra = idx === 2 && totalScreenshots > 3;
                      const remainingCount = totalScreenshots - 3;
                      const isBroken = brokenImages[shot.src];

                      return (
                        <button
                          key={shot.src + idx}
                          ref={(el) => {
                            thumbRefs.current[idx] = el;
                          }}
                          type="button"
                          onClick={() => {
                            setActivePhotoIdx(idx);
                            setLightboxOpen(true);
                          }}
                          className="w-full h-full aspect-video sm:aspect-auto border border-border hover:border-accent transition-colors bg-surface relative overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-accent min-w-[44px]"
                          aria-label={
                            isThirdWithExtra
                              ? `View screenshot ${idx + 1} of ${totalScreenshots}, ${project.title} (+${remainingCount} more)`
                              : `View screenshot ${idx + 1} of ${totalScreenshots}, ${project.title}`
                          }
                        >
                          {!isBroken ? (
                            <img
                              src={shot.src}
                              alt={shot.alt || `${project.title} screenshot ${idx + 1}`}
                              width={132}
                              height={74}
                              loading="lazy"
                              onError={() =>
                                setBrokenImages((prev) => ({ ...prev, [shot.src]: true }))
                              }
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                            />
                          ) : (
                            /* Neutral placeholder tile when image fails to load */
                            <div
                              className="w-full h-full bg-surface-raised flex items-center justify-center font-mono text-[10px] text-text-muted select-none"
                              aria-hidden="true"
                            >
                              PREVIEW
                            </div>
                          )}

                          <div className="absolute inset-0 bg-bg/20 group-hover:bg-transparent transition-colors" />

                          {/* Dark 72% overlay with "+N" on 3rd thumbnail when total > 3 */}
                          {isThirdWithExtra && (
                            <div className="absolute inset-0 bg-bg/72 flex items-center justify-center select-none pointer-events-none">
                              <span className="font-heading text-xl sm:text-2xl font-bold text-text tracking-wider">
                                +{remainingCount}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* No screenshots: Video player uses full width */
                <VideoPlayer
                  videoUrl={project.media?.gameplayVideo}
                  poster={posterPath}
                  title={project.title}
                  resetKey={`${project.id}-${activePhotoIdx}-${lightboxOpen}`}
                />
              )}
            </section>

            {/* ── Overview Text directly below media block (15px body, line-height 1.6) ── */}
            {cleanOverview && (
              <p className="font-body text-[15px] leading-[1.6] text-text max-w-[720px] mt-[14px] whitespace-pre-line">
                {cleanOverview}
              </p>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              RIGHT COLUMN (4/12 on lg): Sticky Sidebar (chips, actions, facts)
             ══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 flex flex-col items-start w-full lg:sticky lg:top-20">

            {/* ── Platform Chips (16px space above on mobile, top of sidebar on desktop) ── */}
            {project.platforms && project.platforms.length > 0 && (
              <div className="mt-4 lg:mt-0 w-full">
                <PlatformChips platforms={project.platforms} />
              </div>
            )}

            {/* ── Action Bar (Play, Download, GitHub, Browser) ────────────────── */}
            {(hasPlayLink || hasDownloadLink || hasGitHubLink || hasWebglLink) && (
              <section aria-label="Game actions" className="mt-4 w-full">
                <div className="grid grid-cols-2 md:flex md:flex-row lg:flex-col gap-3 items-stretch w-full">
                  {/* Play Button (Solid amber, dark text) */}
                  {hasPlayLink && (
                    <a
                      href={isPlayActionSupported ? project.links.play : '#device-notice'}
                      target={isPlayActionSupported ? '_blank' : '_self'}
                      rel={isPlayActionSupported ? 'noopener noreferrer' : undefined}
                      onClick={handlePlayClick}
                      className="col-span-2 md:col-auto lg:w-full min-h-[44px] h-[44px] px-5 bg-accent text-bg border border-accent hover:bg-accent/90 transition-colors font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Icon name="play" size={14} />
                      <span>PLAY</span>
                    </a>
                  )}

                  {/* Download Button (1px border) */}
                  {hasDownloadLink && (
                    <a
                      href={isDownloadActionSupported ? project.links.download : '#device-notice'}
                      target={isDownloadActionSupported ? '_blank' : '_self'}
                      rel={isDownloadActionSupported ? 'noopener noreferrer' : undefined}
                      onClick={handleDownloadClick}
                      className="col-span-1 md:col-auto lg:w-full min-h-[44px] h-[44px] px-4 bg-surface text-text border border-border hover:border-accent transition-colors font-mono text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Icon name="download" size={14} />
                      <span>DOWNLOAD</span>
                    </a>
                  )}

                  {/* GitHub Button (1px border, always works) */}
                  {hasGitHubLink && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleGitHubClick}
                      className="col-span-1 md:col-auto lg:w-full min-h-[44px] h-[44px] px-4 bg-surface text-text border border-border hover:border-accent transition-colors font-mono text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Icon name="github" size={14} />
                      <span>GITHUB</span>
                    </a>
                  )}

                  {/* Play in browser button */}
                  {hasWebglLink && (
                    <button
                      type="button"
                      onClick={() => setLoadBrowserPlay((prev) => !prev)}
                      className="col-span-2 md:col-auto lg:w-full min-h-[44px] h-[44px] px-4 bg-surface text-text border border-border hover:border-accent transition-colors font-mono text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
                      aria-expanded={loadBrowserPlay}
                    >
                      <Icon name="play" size={14} />
                      <span>{loadBrowserPlay ? 'CLOSE BROWSER PLAYER' : 'PLAY IN BROWSER'}</span>
                    </button>
                  )}
                </div>

                {/* ── Device Note Area (role="status", directly under action bar) ── */}
                {platformNotice && (
                  <div
                    id="device-notice"
                    role="status"
                    className="mt-3 p-3 border border-accent bg-surface flex items-start gap-2.5 text-[14px] font-body text-text w-full"
                  >
                    <Icon name="alert" size={16} className="text-accent shrink-0 mt-0.5" />
                    <span className="leading-snug">{platformNotice}</span>
                  </div>
                )}

                {/* Embedded WebGL Player (Loaded on explicit user click) */}
                {loadBrowserPlay && project.links?.webglEmbed && (
                  <div className="w-full aspect-video bg-bg border border-border mt-3">
                    <iframe
                      src={project.links.webglEmbed}
                      title={`${project.title} WebGL player`}
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  </div>
                )}
              </section>
            )}

            {/* ── Quick Facts (1px top/bottom border, 4-col desktop, 2-col mobile; NO Platform) ── */}
            {quickFacts.length > 0 && (
              <section aria-labelledby="facts-heading" className="w-full border-y border-border py-4 my-6">
                <h2 id="facts-heading" className="sr-only">
                  Quick Facts
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                  {quickFacts.map((fact) => (
                    <div key={fact.label} className="flex flex-col">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted block mb-1">
                        {fact.label}
                      </span>
                      <span className="font-body text-[14px] text-text font-semibold block leading-tight">
                        {fact.value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Tech Stack (h2 mono "TECH STACK", full tech array) ────────── */}
            {techStack.length > 0 && (
              <section aria-labelledby="tech-heading" className="w-full mb-6">
                <h2 id="tech-heading" className="label-mono text-xs uppercase tracking-wider text-text-muted mb-2.5">
                  TECH STACK
                </h2>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span key={tech} className="tag text-xs font-mono py-1 px-2.5">
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}

          </div>

        </div>

        {/* ── 3. Footer Row: Previous, Centered "01 / 03" Counter, Next ───────── */}
        <footer className="border-t border-border pt-[12px] flex items-center justify-between gap-4 mt-10 w-full">
          <Link
            to={`/games/${prevGame.id}`}
            className="min-h-[44px] h-[44px] px-4 border border-border bg-surface text-text font-mono text-xs uppercase flex items-center gap-2 hover:border-accent hover:text-accent transition-colors"
          >
            <Icon name="arrow-left" size={14} />
            <span>{prevGame.title}</span>
          </Link>

          {/* Centered Index Counter */}
          <span className="font-mono text-xs text-accent font-semibold tracking-wider">
            {formattedIndex}
          </span>

          <Link
            to={`/games/${nextGame.id}`}
            className="min-h-[44px] h-[44px] px-4 border border-border bg-surface text-text font-mono text-xs uppercase flex items-center gap-2 hover:border-accent hover:text-accent transition-colors"
          >
            <span>{nextGame.title}</span>
            <Icon name="arrow-right" size={14} />
          </Link>
        </footer>

      </div>

      {/* ── Fullscreen Accessible Lightbox (includes all screenshots) ───── */}
      {lightboxOpen && (
        <Lightbox
          screenshots={validScreenshots}
          initialIndex={activePhotoIdx}
          onClose={() => setLightboxOpen(false)}
          triggerRefs={thumbRefs}
        />
      )}
    </PageLayout>
  );
}
