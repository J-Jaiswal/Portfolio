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
```

---

## Route Structure

Full separate pages with real browser paths:

| Route | Section Name | Description |
|---|---|---|
| `/` | System Menu | Root launcher view (Title Screen on first visit, then Main Menu with embers backdrop) |
| `/about` | About Me | Profile photo frame, bio paragraph, stat metrics, availability notice, "HOW I WORK" principle cards, and recommendations |
| `/toolkit` | Toolkit | Technical stack, engine capabilities, and game filter (Buddy, DeathFire, Pursuit) |
| `/games` | My Games | Centered looping carousel showing exactly min(N, 3) project cards (flex centered, 16px gap, overflow: hidden, no edge slivers), video previews, 44px chevron buttons, and 44x24px dots |
| `/games/:id` | Case Study | Extended two-column view (desktop): media block (YouTube facade / MP4 video with screenshot thumbnails beside it), overview, platform chips, action buttons (Play, Download, GitHub), device note, quick facts, tech stack, and footer navigation |
| `/journey` | Journey | Career timeline, research, and education |
| `/contact` | Say Hello | Direct email contact, availability notice, and verified profiles |
| `/resume` | Resume | Document-only view rendered via `pdfjs-dist` on canvas with devicePixelRatio sharpness, responsive width (max 794px), 16px page gaps, 44px action buttons ("OPEN IN NEW TAB", "DOWNLOAD PDF"), and missing-file fallback |

Legacy route `/games/space-go` automatically redirects to `/games?game=pursuit`. Unknown paths redirect to `/`.

---

## Icon System (`src/components/Icon.jsx`)

Centralized inline SVG icon component with zero external dependencies, zero icon fonts, and zero emoji:
- Platform icons: `windows`, `android`, `apple`, `web`
- Action icons: `play`, `download`, `github`
- Navigation icons: `arrow-left`, `arrow-right`, `chevron-left`, `chevron-right`
- UI icons: `menu`, `alert`

Icons inherit `currentColor`, are marked `aria-hidden="true"`, and support custom `size` and `className` properties.

---

## Content Editing Guide

All copy lives strictly inside `src/data/`. Pages do not hard-code content:

| Section | Data File | What to Edit |
|---|---|---|
| **Global Positioning** | `src/data/about.js` | `POSITIONING` constant (updates subtitle across title screen, menu, About header, and SEO tags) |
| **Availability Notice** | `src/data/about.js` | `AVAILABILITY` constant (displays status line on About and Say Hello pages) |
| **About Me** | `src/data/about.js` | Bio paragraph, stat metrics, `howIWork` principles, and `recommendations` array |
| **Toolkit** | `src/data/skills.js` | Skill groups, descriptions, used-in game associations, and `CURRENTLY_LEARNING` items |
| **My Games** | `src/data/projects.js` | Titles, taglines, `coreSystem`, overviews, video/poster paths, screenshot captures (presented beside or below the video), target platforms (`platforms`), and links (`play`, `download`, `github`, `webglEmbed`) |
| **Journey** | `src/data/experience.js` | Career milestones, roles, institutions, dates, and accomplishment bullets |
| **Say Hello** | `src/data/links.js` | Public profile URLs and handles (`github`, `githubHandle`, `linkedin`, `linkedinHandle`, `itchio`, `itchioHandle`) |

---

## Checklist: Marked TODOs to Fill In

| File | Line | Description |
|---|---|---|
| `src/data/about.js` | Lines 37–46 | `howIWork`: Replace TODO placeholders with up to 3 core principles / workflow steps (section remains hidden until non-TODO text is provided) |
| `src/data/about.js` | Line 53 | `recommendations`: Add `{ quote, name, role }` objects when testimonials are received (section remains hidden while empty) |
| `src/data/skills.js` | Lines 23, 29, 35, 41, 47, 53, 59, 65, 77, 83, 89, 95, 101, 113, 119, 125, 131, 143, 149, 155, 161 | `tier`: Select proficiency badge for each skill item |
| `src/data/skills.js` | Lines 150, 156, 162 | Fill in descriptions for Git, GitHub, and Vercel tools |
| `src/data/skills.js` | Line 168 | Update `CURRENTLY_LEARNING` array with active learning topics when desired |
| `src/data/projects.js` | Lines 37, 85, 128 | Verify target platforms in `platforms` array (`['Windows']` currently configured) |
| `src/data/projects.js` | Lines 39, 87, 130 | Verify developer `role` |
| `src/data/projects.js` | Lines 40, 88, 131 | Verify `team` structure |
| `src/data/projects.js` | Lines 41, 89, 132 | Add `duration` development time estimates |
| `src/data/projects.js` | Lines 67, 126, 179 | `media.gameplayVideo`: Replace placeholder video with each game's dedicated gameplay video URL |
| `src/data/projects.js` | Lines 87, 146, 199 | Add WebGL embed URLs (`webglEmbed`) if playable in browser |
| `index.html` | Line 12 | Replace placeholder canonical URL with your production domain |
| `index.html` | Line 44 | Drop 1200×630 `public/media/og-image.png` for social cards |

---

## Checklist: Files to Add to `public/` & Media Configuration

### 1. Resume Location & Plain Document Rendering
- **Location:** `public/media/resume.pdf`
- **Verification:** The `/resume` page proactively verifies this file via HEAD (with GET Range fallback) and validates its PDF MIME type.
- **Rendering:** Uses `pdfjs-dist` loaded via a dynamic `import()` to ensure it stays completely out of the main bundle and all other chunks.
- **Display:** Each page of the PDF renders to its own `<canvas>` element using `window.devicePixelRatio` for sharpness on Retina/HiDPI screens.
- **Layout:** Centered in the container with `min(container width, 794px)`, white page background, 1px border (`#2A2D33`), and 16px between pages. No toolbars, sidebar, or zoom chrome. Automatically re-renders on window resize (debounced).
- **Actions:** Two 44px buttons directly below the document ("OPEN IN NEW TAB" and "DOWNLOAD PDF"), stacking to full width on mobile devices.
- **Missing State:** If the PDF is missing, a "Resume Coming Soon" fallback card is displayed.

### 2. Gameplay Video & Preview Clip Configuration
In `src/data/projects.js`, each project's `media` object supports:
- **`media.gameplayVideo`**:
  - **YouTube URL**: supports standard watch links (`https://www.youtube.com/watch?v=<id>`), short links (`https://youtu.be/<id>`), and embed links (`https://www.youtube.com/embed/<id>`).
  - Displays YouTube's thumbnail (`https://i.ytimg.com/vi/<id>/hqdefault.jpg`, with poster fallback on error) with a centered play button and "WATCH GAMEPLAY" label.
  - Clicking loads the privacy-friendly `https://www.youtube-nocookie.com/embed/<id>?autoplay=1&rel=0` iframe with autoplay.
  - **MP4 Path**: standard HTML5 video path (e.g., `/media/buddy-gameplay.mp4`) with automatic pause when scrolled out of view.
  - **Empty/Null**: displays only the poster image with zero broken overlays.
- **`media.previewClip`**:
  - Optional short muted MP4 path (e.g. `/media/buddy-clip.mp4`) that autoplays on loop on the active carousel card. If null or empty, the carousel card shows the poster image.

### 3. Action Links & Platform Rules
In `src/data/projects.js`, each project's `links` object specifies:
- `play`: Browser-playable build URL (e.g., itch.io WebGL). Works on all desktop browsers (Windows, macOS, Linux). Mobile visitors on Android/iOS without a mobile build see guidance to open on Windows.
- `download`: Executable download link (e.g., itch.io Windows installer/zip). Opens for visitors whose platform matches the game's supported platforms.
- `github`: Source repository URL. Always opens directly.
- `webglEmbed`: Optional iframe player URL embedded inside the page.

### 3. Screenshot Naming Convention
Screenshots are placed in `public/media/` using exact names (case-sensitive on Linux/Vercel):
- **Buddy**: `public/media/buddy1.png`, `buddy2.png`, `buddy3.png`
- **DeathFire**: `public/media/deathfire1.png`, `deathfire2.png`, `deathfire3.png`
- **Pursuit**: `public/media/pursuit1.png`, `pursuit2.png`, `pursuit3.png`

Each project's `media.poster` and `media.thumbnail` point to its first screenshot by default until custom poster art is supplied.

### 4. Other Media & Audio
- `public/media/profile.jpg` — Profile portrait for **About Me** (clean monogram fallback renders if missing).
- `public/media/og-image.png` — 1200×630 screenshot of the title screen or menu for social previews.
- `public/audio/` — *Optional UI sound effects (`move.mp3`, `select.mp3`, `open.mp3`, `back.mp3`, `ambient.mp3`); system fails silently if omitted.*

---

## Design System: Dark Game-UI

Configured in `src/index.css` via Tailwind v4 `@theme` tokens:

| Token | Hex / Value | Role |
|---|---|---|
| `--color-bg` | `#0E0F11` | Primary dark viewport background |
| `--color-surface` | `#16181B` | Card surfaces and panels |
| `--color-surface-raised` | `#1D2024` | Active / hovered card surface |
| `--color-border` | `#2A2D33` | 1px crisp dividers and borders |
| `--color-text` | `#E8E6E1` | High-contrast primary body text |
| `--color-text-muted` | `#8B8F97` | Secondary text (> 5:1 contrast against bg) |
| `--color-accent` | `#D9A441` | Game-UI amber accent |
| `--color-accent-dim` | `rgba(217,164,65,0.15)` | Subtle accent highlights |
| `--font-heading` | Barlow Condensed | Bold, uppercase, tracking-wider headings |
| `--font-body` | Inter | Clean, legible body text |
| `--font-mono` | JetBrains Mono | Monospace section labels and tags |

---

## Deployment to Vercel

Configured for client-side routing on [Vercel](https://vercel.com):

`vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
All deep routes (e.g. `https://domain.com/games/pursuit` or `https://domain.com/resume`) are rewritten to `index.html`, where `react-router-dom` renders the matching page component.

---

## License

MIT — Jayesh Jaiswal.
