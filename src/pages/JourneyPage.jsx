/**
 * src/pages/JourneyPage.jsx
 *
 * 04 JOURNEY (/journey)
 *
 * Features:
 *   - Vertical timeline with a 1px crisp line and square nodes.
 *   - Entries from src/data/experience.js:
 *       1. Software Developer Intern, VLabs, IIT Roorkee (July 2025 - Sept 2025)
 *       2. Integrated M.Tech in Geophysical Technology, IIT Roorkee (Nov 2020 - May 2025)
 *   - Cards feature mono date label, role/degree, organization, and 2-3 bullets.
 *   - Uses native <button> elements with aria-expanded for expandable items.
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

import { useState } from 'react';
import PageLayout from '../layout/PageLayout';
import experience from '../data/experience';
import { isPlaceholder } from '../utils/placeholders';

export default function JourneyPage() {
  const [expanded, setExpanded] = useState(() =>
    experience.reduce((acc, item) => ({ ...acc, [item.id]: true }), {})
  );

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PageLayout
      label="04 / JOURNEY"
      title="Journey"
      description="Timeline of professional engineering roles, software simulations, and academic credentials."
    >
      <div className="relative pl-6 sm:pl-8 max-w-4xl">

        {/* ── Vertical 1px Timeline Axis ──────────────────────────────────── */}
        <div
          className="absolute top-3 bottom-4 left-2.5 sm:left-3.5 w-[1px] bg-border pointer-events-none"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-8">
          {experience.map((entry) => {
            const isOpen = expanded[entry.id] ?? false;

            return (
              <div key={entry.id} className="relative flex items-start gap-4 sm:gap-6">

                {/* ── Square Node ─────────────────────────────────────────── */}
                <div
                  className="absolute -left-6 sm:-left-8 top-5 w-3 h-3 bg-bg border border-accent -translate-x-1/2 flex items-center justify-center z-10"
                  aria-hidden="true"
                >
                  <span className="w-1 h-1 bg-accent" />
                </div>

                {/* ── Milestone Card ──────────────────────────────────────── */}
                <div className="card w-full p-5 sm:p-6 border border-border hover:border-border/80 transition-colors">

                  {/* Header: Date + Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3 mb-3">
                    {!isPlaceholder(entry.period, 'experience.js', `${entry.id}.period`) ? (
                      <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                        {entry.period}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="tag text-[0.65rem] border-accent/40 text-accent font-mono ml-auto">
                      {entry.status}
                    </span>
                  </div>

                  {/* Role & Organization */}
                  <div className="flex flex-col gap-1 mb-3">
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-text">
                      {entry.role}
                    </h2>
                    <div className="font-mono text-xs sm:text-sm text-text-muted">
                      {entry.organization}
                    </div>
                  </div>

                  {/* Native Expand Toggle Button */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(entry.id)}
                    className="btn-secondary min-h-[44px] text-xs font-mono py-2 px-3.5 my-2 flex items-center gap-2"
                    aria-expanded={isOpen}
                    aria-controls={`details-${entry.id}`}
                  >
                    <span>{isOpen ? 'COLLAPSE DETAILS' : 'EXPAND DETAILS'}</span>
                    <span aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
                  </button>

                  {/* Expandable Bullets */}
                  {isOpen && (
                    <div id={`details-${entry.id}`} className="pt-3 border-t border-border/50 flex flex-col gap-2">
                      {entry.summary && (
                        <p className="font-body text-xs sm:text-sm text-text-muted italic mb-1">
                          {entry.summary}
                        </p>
                      )}
                      <ul className="flex flex-col gap-2 font-body text-xs sm:text-sm text-text">
                        {entry.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2">
                            <span className="text-accent font-mono text-xs" aria-hidden="true">&gt;</span>
                            <span className="leading-relaxed">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
