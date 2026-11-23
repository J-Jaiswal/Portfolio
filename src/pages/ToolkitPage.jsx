/**
 * src/pages/ToolkitPage.jsx
 *
 * 02 TOOLKIT (/toolkit)
 *
 * Features:
 *   - Filter row of game chips ("Show skills used in: All / Buddy / DeathFire / Space GO")
 *     that dims rows not utilized in the selected game.
 *   - Sections for each skill category: Game Dev, AI & Backend, Web, Tools.
 *   - Table-like rows on desktop (Name, Proficiency, Description, Used-in links),
 *     responsive stacked cards on mobile.
 *   - Text-only proficiency badges ("Daily use" | "Comfortable" | "Learning", no bars or stars).
 *   - "Currently learning" list at the bottom.
 *   - Reads all data from src/data/skills.js.
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
import { SKILL_GROUPS, CURRENTLY_LEARNING } from '../data/skills';
import { isPlaceholder, cleanList } from '../utils/placeholders';

/* Game filter chip options */
const GAME_FILTERS = [
  { id: 'all',       label: 'All' },
  { id: 'buddy',     label: 'Buddy' },
  { id: 'deathfire', label: 'DeathFire' },
  { id: 'pursuit',   label: 'Pursuit' },
];

export default function ToolkitPage() {
  const [selectedGame, setSelectedGame] = useState('all');

  return (
    <PageLayout
      label="02 / TOOLKIT"
      title="Toolkit"
      description="Technical capabilities, engine architecture, and system integration tools."
    >
      <div className="flex flex-col gap-8 sm:gap-10">

        {/* ── Game Filter Row ─────────────────────────────────────────────── */}
        <div className="card p-4 sm:p-5 border border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-accent" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-wider text-text font-semibold">
              SHOW SKILLS USED IN:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {GAME_FILTERS.map((game) => {
              const isSelected = selectedGame === game.id;
              return (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => setSelectedGame(game.id)}
                  className={[
                    'font-mono text-xs uppercase tracking-wider px-3 py-1.5 border transition-all cursor-pointer min-h-[44px] flex items-center',
                    isSelected
                      ? 'bg-accent text-bg border-accent font-bold'
                      : 'bg-surface text-text-muted border-border hover:border-accent/60 hover:text-text',
                  ].join(' ')}
                  aria-pressed={isSelected}
                >
                  {game.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Skill Categories & Table Rows ───────────────────────────────── */}
        <div className="flex flex-col gap-10">
          {SKILL_GROUPS.map((group, groupIndex) => {
            const validSkills = group.skills.filter(
              (skill) => !isPlaceholder(skill.name, 'skills.js', `${group.id}.${skill.name}`)
            );
            if (validSkills.length === 0) return null;

            return (
              <section key={group.id} aria-labelledby={`group-${group.id}`} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <span className="font-mono text-xs text-accent">0{groupIndex + 1} //</span>
                  <h2 id={`group-${group.id}`} className="font-heading text-2xl font-bold uppercase tracking-wider text-text">
                    {group.name}
                  </h2>
                </div>

                {/* Table Header (Desktop Only) */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2 font-mono text-[0.7rem] uppercase tracking-wider text-text-muted border-b border-border/50">
                  <div className="col-span-3">SKILL NAME</div>
                  <div className="col-span-2">PROFICIENCY</div>
                  <div className="col-span-5">EXPERIENCE / USAGE</div>
                  <div className="col-span-2 text-right">USED IN</div>
                </div>

                {/* Skills List (Table Rows on desktop, stacked cards on mobile) */}
                <div className="flex flex-col gap-2">
                  {validSkills.map((skill) => {
                    const isDimmed =
                      selectedGame !== 'all' &&
                      !skill.usedIn.includes(selectedGame);

                    return (
                      <div
                        key={skill.name}
                        className={[
                          'card p-4 md:py-3.5 md:px-4 border border-border transition-all duration-200',
                          'grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center',
                          isDimmed
                            ? 'opacity-25 scale-[0.99] grayscale'
                            : 'opacity-100 hover:border-border hover:bg-surface-raised',
                        ].join(' ')}
                      >
                        {/* Name */}
                        <div className="md:col-span-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-accent/60 shrink-0" aria-hidden="true" />
                          <span className="font-heading text-lg sm:text-xl font-bold uppercase tracking-wider text-text">
                            {skill.name}
                          </span>
                        </div>

                        {/* Proficiency badge (text only, no bars or stars) */}
                        <div className="md:col-span-2">
                          {!isPlaceholder(skill.tier, 'skills.js', `${skill.name}.tier`) && (
                            <span className="tag text-[0.7rem] font-mono font-semibold border-border">
                              {skill.tier}
                            </span>
                          )}
                        </div>

                        {/* Description (hidden if placeholder) */}
                        <div className="md:col-span-5 font-body text-sm text-text-muted leading-relaxed">
                          {!isPlaceholder(skill.description, 'skills.js', `${skill.name}.description`) ? (
                            skill.description
                          ) : null}
                        </div>

                        {/* "Used in" Links to /games/:id (min-h-[44px] on touch devices) */}
                        <div className="md:col-span-2 flex flex-wrap md:justify-end gap-1.5">
                          {skill.usedIn.length > 0 ? (
                            skill.usedIn.map((gameId) => (
                              <Link
                                key={gameId}
                                to={`/games/${gameId}`}
                                className="tag text-[0.68rem] font-mono hover:border-accent hover:text-accent transition-colors cursor-pointer min-h-[44px] sm:min-h-0 flex items-center"
                                title={`View ${gameId} case study`}
                              >
                                {gameId} ↗
                              </Link>
                            ))
                          ) : (
                            <span className="font-mono text-xs text-text-muted/40">—</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* ── Currently Learning Section (hidden when empty) ──────────────── */}
        {(() => {
          const activeLearning = cleanList(
            CURRENTLY_LEARNING,
            (item) => item,
            'skills.js',
            'CURRENTLY_LEARNING'
          );
          if (activeLearning.length === 0) return null;

          return (
            <div className="card p-6 border border-border bg-surface-raised">
              <div className="label-mono mb-3 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent" aria-hidden="true" />
                <span>ACTIVE RESEARCH &amp; LEARNING FOCUS</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs text-text-muted mt-2">
                {activeLearning.map((item, idx) => (
                  <li
                    key={idx}
                    className="card p-3 border border-border bg-surface flex items-start gap-2"
                  >
                    <span className="text-accent font-bold" aria-hidden="true">&gt;</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}

      </div>
    </PageLayout>
  );
}
