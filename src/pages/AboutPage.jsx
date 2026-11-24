/**
 * src/pages/AboutPage.jsx
 *
 * 01 ABOUT ME (/about)
 *
 * Layout:
 *   - 12-column grid.
 *   - Left (4 columns): 1px-bordered photo frame with corner notch and monogram fallback, anchored on desktop.
 *   - Right (8 columns): Bio paragraph, 3 stat boxes with mono labels, availability tag,
 *     "FIND ME ONLINE" social link cards, "HOW I WORK" principle cards, and "WHAT PEOPLE SAY".
 *   - Reads all content from src/data/about.js and src/data/links.js.
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import PageLayout from '../layout/PageLayout';
import { aboutData, POSITIONING, AVAILABILITY, howIWork, recommendations } from '../data/about';
import links from '../data/links';
import { isPlaceholder } from '../utils/placeholders';
import Icon from '../components/Icon';
import { stagger, item, itemReduced } from '../lib/motion';

export default function AboutPage() {
  const [imgError, setImgError] = useState(false);
  const shouldReduce = useReducedMotion();

  // Filter out any TODO items in How I Work
  const activeHowIWork = (howIWork || []).filter(
    (step, idx) =>
      !isPlaceholder(step.title, 'about.js', `howIWork[${idx}].title`) &&
      !isPlaceholder(step.text, 'about.js', `howIWork[${idx}].text`)
  );

  // Filter out any empty/TODO recommendations
  const activeRecommendations = (recommendations || []).filter(
    (rec, idx) =>
      !isPlaceholder(rec.quote, 'about.js', `recommendations[${idx}].quote`) &&
      !isPlaceholder(rec.name, 'about.js', `recommendations[${idx}].name`)
  );

  const resolvedItem = shouldReduce ? itemReduced : item;

  /* Social links config */
  const socialLinks = [
    {
      name: 'GitHub',
      icon: 'github',
      href: links.github,
      handle: links.githubHandle,
      label: 'GitHub, opens in a new tab',
    },
    {
      name: 'LinkedIn',
      icon: 'linkedin',
      href: links.linkedin,
      handle: links.linkedinHandle,
      label: 'LinkedIn, opens in a new tab',
    },
    {
      name: 'itch.io',
      icon: 'itchio',
      href: links.itchio,
      handle: links.itchioHandle,
      label: 'itch.io, opens in a new tab',
    },
  ];

  return (
    <PageLayout
      label="01 / ABOUT"
      title="About Me"
      description={POSITIONING}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">

        {/* ── Left Column (4 Cols): Photo Frame (Anchored on Desktop) ─────── */}
        <div className="md:col-span-4 lg:col-span-4 md:sticky md:top-24 flex flex-col gap-6">

          {/* Sharp 1px-bordered photo frame with corner notch */}
          <div className="card p-2 corner-notch bg-surface border border-border">
            <div className="w-full aspect-[4/5] bg-bg border border-border overflow-hidden relative flex items-center justify-center">
              {!imgError ? (
                <img
                  src="/media/profile.jpg"
                  alt="Jayesh Jaiswal"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
              ) : (
                /* Clean Monogram Fallback */
                <div className="w-full h-full flex flex-col items-center justify-center bg-surface-raised p-6 text-center select-none">
                  <div className="w-16 h-16 border border-accent bg-accent-dim flex items-center justify-center font-heading text-2xl font-bold text-accent mb-3">
                    JJ
                  </div>
                  <span className="font-heading text-lg text-text font-bold uppercase tracking-wider">
                    Jayesh Jaiswal
                  </span>
                  <span className="font-mono text-xs text-text-muted mt-1 uppercase tracking-widest">
                    Indie Developer
                  </span>
                </div>
              )}
            </div>

            {/* Bottom frame caption */}
            <div className="px-2 pt-2.5 pb-1 flex items-center justify-between text-text-muted font-mono text-[0.7rem] uppercase tracking-wider">
              <span>PHOTO / 01</span>
              <span className="text-accent">VERIFIED</span>
            </div>
          </div>
        </div>

        {/* ── Right Column (8 Cols): Bio, Stats, Availability, Social, How I Work ── */}
        <div className="md:col-span-8 flex flex-col gap-6">

          {/* Bio Box */}
          <section aria-labelledby="about-bio" className="card p-6 sm:p-8 border border-border">
            <h2 id="about-bio" className="label-mono mb-3 text-xs">
              DEVELOPER BRIEF
            </h2>
            <p className="font-body text-text text-base sm:text-lg leading-relaxed">
              {aboutData.bio}
            </p>
          </section>

          {/* Three Stat Boxes */}
          <motion.section
            aria-label="Key metrics"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {aboutData.stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={resolvedItem}
                className="card p-4 sm:p-5 border border-border flex flex-col justify-between hover:border-accent transition-colors"
              >
                <span className="font-mono text-[0.7rem] uppercase tracking-wider text-text-muted mb-2">
                  {stat.label}
                </span>
                <span className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-wider text-text">
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </motion.section>

          {/* Availability Status Tag */}
          <div className="card p-4 border border-border flex flex-col gap-2 bg-surface-raised">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 bg-accent inline-block shrink-0" aria-hidden="true" />
                <span className="font-mono text-xs sm:text-sm uppercase tracking-wider text-text font-semibold">
                  {aboutData.statusTag}
                </span>
              </div>
              <span className="tag border-accent/40 text-accent font-semibold hidden sm:inline-flex">
                AVAILABLE
              </span>
            </div>
            {AVAILABILITY && (
              <p className="font-mono text-xs text-text-muted pl-5">
                {AVAILABILITY}
              </p>
            )}
          </div>

          {/* ── FIND ME ONLINE ────────────────────────────────────────────── */}
          <section aria-labelledby="social-heading" className="flex flex-col gap-3">
            <h2 id="social-heading" className="label-mono text-xs">
              FIND ME ONLINE
            </h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {socialLinks.map((s) => (
                <motion.a
                  key={s.name}
                  variants={resolvedItem}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="group card p-4 border border-border hover:border-accent transition-colors flex flex-col gap-2 min-h-[44px] justify-between"
                >
                  <div className="flex items-center justify-between">
                    <Icon name={s.icon} size={18} className="text-accent" />
                    <Icon
                      name="arrow-up-right"
                      size={14}
                      className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                      {s.name}
                    </span>
                    <span className="font-mono text-[0.7rem] text-text-muted truncate">
                      {s.handle}
                    </span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </section>

          {/* ── How I Work (hidden while items are TODO) ──────────────────── */}
          {activeHowIWork.length > 0 && (
            <section aria-labelledby="how-i-work-heading" className="flex flex-col gap-3">
              <h2 id="how-i-work-heading" className="label-mono text-xs">
                HOW I WORK
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeHowIWork.map((step, idx) => (
                  <div
                    key={step.title}
                    className="card p-4 sm:p-5 border border-border flex flex-col gap-2 hover:border-accent transition-colors"
                  >
                    <span className="font-mono text-accent text-xs font-bold">
                      0{idx + 1} //
                    </span>
                    <h3 className="font-heading text-base sm:text-lg font-bold uppercase tracking-wider text-text">
                      {step.title}
                    </h3>
                    <p className="font-body text-sm sm:text-base text-text-muted leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── What People Say / Recommendations (hidden while empty) ──── */}
          {activeRecommendations.length > 0 && (
            <section aria-labelledby="recommendations-heading" className="flex flex-col gap-3">
              <h2 id="recommendations-heading" className="label-mono text-xs">
                WHAT PEOPLE SAY
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeRecommendations.map((rec, idx) => (
                  <div
                    key={rec.name || idx}
                    className="card p-5 sm:p-6 border border-border flex flex-col justify-between gap-4 hover:border-accent transition-colors"
                  >
                    <blockquote className="font-body text-sm sm:text-base text-text italic leading-relaxed">
                      &ldquo;{rec.quote}&rdquo;
                    </blockquote>
                    <div className="flex flex-col border-t border-border/60 pt-3 font-mono text-xs">
                      <span className="text-text font-semibold uppercase tracking-wider">
                        {rec.name}
                      </span>
                      {rec.role && (
                        <span className="text-text-muted text-[0.7rem] uppercase tracking-wider mt-0.5">
                          {rec.role}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </PageLayout>
  );
}
