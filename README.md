# Jayesh Jaiswal | Unity gameplay programmer focused on enemy AI and AI-integrated systems — Portfolio

A dark, sharp, organized **game-UI portfolio** engineered for a Unity gameplay programmer and AI systems engineer.
Features a crisp 12-column grid, real-path routing via `react-router-dom`, tactile game-UI components, and full accessibility.

**Stack:** React 19 · React Router 7 · Vite 8 · Tailwind CSS v4 · Framer Motion 14

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run locally (Vite dev server)
npm run dev        # → http://localhost:5173

# 3. Build for production
npm run build      # compiles into /dist with route-based code-splitting

# 4. Preview production build locally
npm run preview    # → http://localhost:4173

# 5. Lint
npm run lint
```

---

## Route Structure

Full separate pages with real browser paths:

| Route | Section Name | Description |
|---|---|---|
| `/` | System Menu | Root launcher view (Title Screen on first visit, then Main Menu with embers backdrop). Mobile: content aligns below the backdrop strip with `min-h-dvh` to prevent 100vh overflow. |
| `/about` | About Me | Profile photo frame, bio paragraph, stat metrics, availability notice, **FIND ME ONLINE** social cards (GitHub, LinkedIn, itch.io), "HOW I WORK" principle cards, and recommendations. |
| `/toolkit` | Toolkit | Technical stack, engine capabilities, and game filter (Buddy, DeathFire, Pursuit). |
| `/games` | My Games | Centered looping carousel, video previews, 44px chevron buttons, and project dots. |
| `/games/:id` | Case Study | Extended view: media block, overview, platform chips, action buttons, tech stack, and footer navigation. |
| `/journey` | Journey | Career timeline with **type filter** (ALL / FULL-TIME / INTERN / EDUCATION) and TypeTag chips beside each role. |
| `/contact` | Say Hello | Direct email contact (EMAIL ME + COPY EMAIL buttons), availability notice, and a link to profiles on /about. |
| `/resume` | Resume | Document-only view rendered via `pdfjs-dist` on canvas with devicePixelRatio sharpness. |

Legacy route `/games/space-go` automatically redirects to `/games?game=pursuit`. Unknown paths redirect to `/`.

---

## Sound & Transitions

### Page Transitions (`src/components/PageTransition.jsx`)

Wraps `<Routes>` in `App.jsx` with `AnimatePresence mode="wait"` keyed on `location.pathname`.

- **Enter:** opacity `0 → 1`, `x: 40px → 0` over 260ms, easing `[0.22, 1, 0.36, 1]`.
- **Exit:** opacity `→ 0`, `x → -24px` over 160ms.
- **Back navigation (POP):** direction is reversed (enters from left, exits right).
- **Accent bar:** a 2px amber bar fixed at the viewport top sweeps `scaleX: 0 → 1` then fades out over ~450ms on each route change. `aria-hidden`, `pointer-events: none`.
- **Reduced motion:** 120ms opacity-only fade; no slide, no bar.
- Scroll resets to top on every route change via `useEffect`.

### Sound Manager (`src/lib/sound.js`)

A singleton that manages three UI sound effects:

| File | Trigger |
|---|---|
| `public/audio/move.mp3` | Hover / focus on interactive elements (throttled to once per 80ms) |
| `public/audio/select.mp3` | Click on buttons / links |
| `public/audio/nav.mp3` | Every route change (forward and back) |

Rules:
- Volume fixed at **0.35** for all sounds.
- **No playback before first user gesture** — audio is unlocked on first `pointerdown` and files preloaded then.
- No playback when `document.hidden`.
- Mute state persisted in `localStorage` (key: `uiSoundMuted`).
- Missing files or playback errors **fail completely silently** — no console noise.

### Sound Provider (`src/components/SoundProvider.jsx`)

Mounted once in `App.jsx`. Uses delegated event listeners:
- `click` on `button, a, [role=button]` → plays `select` (internal links with `href` starting `/` are skipped — route change plays `nav` instead).
- `pointerover` / `focusin` on those elements → plays `move` (only when `matchMedia('(hover: hover)')` is true).
- Every route change after first render → plays `nav`.

### Sound Toggle

The existing audio toggle button (in `MainMenu` and `PageLayout` footer) is connected to the singleton. It toggles mute/unmute of all UI sounds using `Icon` SVGs (`volume` / `volume-off`) with `aria-pressed` and proper `aria-label` ("Mute UI sounds" / "Unmute UI sounds").

**Audio files you need to add manually:**

```
public/audio/move.mp3     — hover/focus tick (soft, short)
public/audio/select.mp3   — click confirmation (soft click)
public/audio/nav.mp3      — page navigation swish
```

The app works fine without them (silent mode).

---

## Icon System (`src/components/Icon.jsx`)

Centralized inline SVG icon component with zero external dependencies:

- Platform: `windows`, `android`, `apple`/`ios`, `web`
- Action: `play`, `download`, `github`
- Navigation: `arrow-left`, `arrow-right`, `arrow-up-right`, `chevron-left`, `chevron-right`
- UI: `menu`, `alert`, `check`, `copy`
- Contact: `mail`/`email`, `phone`, `whatsapp`, `linkedin`, `itch`/`itchio`
- Sound: **`volume`**, **`volume-off`** (new — used by sound toggle)

---

## Content Editing Guide

All copy lives strictly inside `src/data/`. Pages do not hard-code content:

| Section | Data File | What to Edit |
|---|---|---|
| **Global Positioning** | `src/data/about.js` | `POSITIONING` constant |
| **Availability Notice** | `src/data/about.js` | `AVAILABILITY` constant |
| **About Me** | `src/data/about.js` | Bio paragraph, stat metrics, `howIWork`, `recommendations` |
| **Social Links** | `src/data/links.js` | `github`, `githubHandle`, `linkedin`, `linkedinHandle`, `itchio`, `itchioHandle` — now shown on the **About** page under "FIND ME ONLINE". |
| **Toolkit** | `src/data/skills.js` | Skill groups, proficiency tiers, used-in game associations |
| **My Games** | `src/data/projects.js` | Titles, media, links, platform chips |
| **Journey** | `src/data/experience.js` | Timeline entries — each requires a **`type`** field (see below) |
| **Contact** | _(no data file)_ | Email is split in-code for safety; availability from `about.js` |

### Journey `type` Field

Each entry in `src/data/experience.js` now has a required `type` field:

```js
{
  id: 'my-role',
  type: 'full-time', // 'full-time' | 'intern' | 'education'
  role: '...',
  ...
}
```

This drives the `TypeTag` chip (FULL-TIME / INTERN / EDUCATION) and the filter row on the Journey page. Only filter buttons for types that exist in the data are shown.

### Social Links on About (not Contact)

GitHub, LinkedIn, and itch.io now appear on the **About** page under "FIND ME ONLINE". The Contact page links back to About for social profiles. Both pages read from `src/data/links.js` as the single source of truth.

---

## Checklist: Marked TODOs to Fill In

| File | Description |
|---|---|
| `src/data/about.js` | `howIWork`: Replace TODO placeholders (section hidden until real content provided) |
| `src/data/about.js` | `recommendations`: Add `{ quote, name, role }` objects (section hidden while empty) |
| `src/data/skills.js` | Fill skill descriptions, proficiency tiers, and used-in game associations |
| `public/media/profile.jpg` | Profile portrait for About Me (monogram fallback shown if missing) |
| `public/audio/move.mp3` | Hover/focus sound effect |
| `public/audio/select.mp3` | Click sound effect |
| `public/audio/nav.mp3` | Page navigation sound effect |

---

## Media Configuration

### Resume
- **Location:** `public/media/resume.pdf`
- Rendered via `pdfjs-dist` on `<canvas>` elements at `devicePixelRatio` sharpness.
- Missing file shows a "Resume Coming Soon" fallback card.

### Gameplay Videos
In `src/data/projects.js`, each project's `media` object supports:
- `media.gameplayVideo` — YouTube URL or MP4 path; YouTube facade loads iframe on click.
- `media.previewClip` — Short muted MP4 that autoplays on the active carousel card.

### Screenshots
Placed in `public/media/` as `buddy1.png`, `deathfire1.png`, `pursuit1.png`, etc.

---

## Design System: Dark Game-UI

Configured in `src/index.css` via Tailwind v4 `@theme` tokens:

| Token | Value | Role |
|---|---|---|
| `--color-bg` | `#0E0F11` | Primary dark viewport background |
| `--color-surface` | `#16181B` | Card surfaces |
| `--color-surface-raised` | `#1D2024` | Active / hovered surface |
| `--color-border` | `#2A2D33` | 1px crisp dividers |
| `--color-text` | `#E8E6E1` | High-contrast body text |
| `--color-text-muted` | `#8B8F97` | Secondary text |
| `--color-accent` | `#D9A441` | Game-UI amber accent |
| `--color-accent-dim` | `rgba(217,164,65,0.15)` | Subtle accent highlights |
| `--font-heading` | Barlow Condensed | Bold uppercase headings |
| `--font-body` | Inter | Body text |
| `--font-mono` | JetBrains Mono | Labels, tags, mono text |

---

## Deployment to Vercel

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## License

MIT — Jayesh Jaiswal.
