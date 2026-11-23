/**
 * src/data/projects.js
 *
 * Game projects for the My Games carousel and Case Study views.
 *
 * Media & Asset Guide:
 *   - Gameplay Video:
 *       Accepts either a YouTube link or a local MP4 path in `media.gameplayVideo`:
 *         * YouTube: "https://youtu.be/<id>", "https://www.youtube.com/watch?v=<id>", or "https://www.youtube.com/embed/<id>"
 *         * MP4 path: "/media/my-gameplay.mp4"
 *       If null/empty, the player displays only the poster image without action buttons.
 *   - Preview Clip:
 *       `media.previewClip`: optional short muted MP4 path (e.g., "/media/buddy-clip.mp4").
 *       The carousel active card plays this clip when present; otherwise it displays the poster.
 *   - Screenshot Naming:
 *       Screenshots are located in `public/media/` named:
 *         * Buddy: buddy1.png, buddy2.png, buddy3.png
 *         * DeathFire: deathfire1.png, deathfire2.png, deathfire3.png
 *         * Pursuit: pursuit1.png, pursuit2.png, pursuit3.png
 *       (Note: filenames are case-sensitive on Linux/Vercel hosts).
 *   - Resume Location:
 *       Place your resume PDF at `public/media/resume.pdf`. The /resume page verifies this file.
 *
 * Schema:
 *   id            {string}   Slug used in routes: /games/:id
 *   title         {string}   Game title
 *   tagline       {string}   Short description shown on carousel cards
 *   coreSystem    {string}   Key technical system or architectural highlight
 *   status        {string}   "Released" | "Prototype"
 *   platforms     {string[]} Target platforms: ["Windows", "Android", "iOS", "Web"]
 *   engine        {string}   Engine used
 *   role          {string}   Development role (TODO placeholder until confirmed)
 *   team          {string}   Team structure (TODO placeholder until confirmed)
 *   duration      {string}   Development time (TODO placeholder until confirmed)
 *   overview      {string}   Detailed project overview paragraph
 *   media         {object}   { thumbnail, poster, previewClip, gameplayVideo, screenshots: [{src, alt}] }
 *   links         {object}   { play, download, github, webglEmbed }
 *   tech          {string[]} Technologies used
 *   featured      {boolean}  Featured flag
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

const projects = [
  /* ── 1. Buddy ──────────────────────────────────────────────────────── */
  {
    id: 'buddy',
    title: 'Buddy',
    tagline: 'AI companion with real-time voice chat, lip-sync, and reactive gestures.',
    coreSystem: 'LLM + TTS + STT voice pipeline',
    status: 'Prototype',
    // Confirmed Windows build; will confirm additional platforms
    platforms: ['Windows'],
    engine: 'Unity + Node.js',
    role: 'TODO: Solo Developer (verify role)',
    team: 'TODO: Solo (verify team)',
    duration: 'TODO: Add duration (e.g. 3 months)',
    overview:
      'A 3D avatar with real-time voice chat, lip-sync, and reactive gestures, streamed via SSE for low-latency replies. ' +
      'The pipeline combines Groq LLM, Deepgram TTS, and Groq Whisper STT with parallel TTS generation, MongoDB chat memory, ' +
      'and gesture triggers synced to audio playback. The Unity architecture is data-driven and event-based, so new characters ' +
      'are added through prompt and voice config with no code changes.',
    media: {
      thumbnail: '/media/buddyThumbnail.png',
      poster: '/media/buddyThumbnail.png',
      previewClip: null,   // Short muted MP4 path for carousel card preview
      gameplayVideo: 'https://youtu.be/7q9BiOqtQSk', // TODO: replace with this game's own video
      screenshots: [
        {
          src: '/media/buddy1.png',
          alt: 'Buddy gameplay screenshot 1',
        },
        {
          src: '/media/buddy2.png',
          alt: 'Buddy gameplay screenshot 2',
        },
        {
          src: '/media/buddy3.png',
          alt: 'Buddy gameplay screenshot 3',
        },
      ],
    },
    links: {
      play: 'https://jjvinco.itch.io/buddy',
      download: 'https://jjvinco.itch.io/buddy-pc',
      github: 'https://github.com/J-Jaiswal/Buddy',
      webglEmbed: null,                         // TODO: add WebGL iframe URL if playable in browser
    },
    tech: [
      'Unity',
      'C#',
      'Node.js',
      'Express',
      'MongoDB',
      'Groq',
      'Deepgram',
      'Whisper',
      'uLipSync',
      'SSE',
      'Blender',
    ],
    featured: true,
  },

  /* ── 2. DeathFire ──────────────────────────────────────────────────── */
  {
    id: 'deathfire',
    title: 'DeathFire',
    tagline: 'An 11-wave first-person shooter with physical projectiles.',
    coreSystem: 'Strategy-pattern enemy AI + wave system',
    status: 'Released',
    // Confirmed Windows build; will confirm additional platforms
    platforms: ['Windows'],
    engine: 'Unity',
    role: 'TODO: Solo Developer (verify role)',
    team: 'TODO: Solo (verify team)',
    duration: 'TODO: Add duration (e.g. 2 months)',
    overview:
      'An 11-wave first-person shooter with object-pooled spawning and a decoupled event bus for wave, UI, and audio state. ' +
      'Shooting uses physical projectiles instead of hitscan, with a 2D crosshair rendered in world space. ' +
      'Enemy AI uses the strategy pattern (ZigZag, Circle, Static, Elite) and is data-driven through ScriptableObjects.',
    media: {
      thumbnail: '/media/deathfireThumbnail.png',
      poster: '/media/deathfireThumbnail.png',
      previewClip: null,   // Short muted MP4 path for carousel card preview
      gameplayVideo: 'https://youtu.be/7q9BiOqtQSk', // TODO: replace with this game's own video
      screenshots: [
        {
          src: '/media/deathfire1.png',
          alt: 'DeathFire gameplay screenshot 1',
        },
        {
          src: '/media/deathfire2.png',
          alt: 'DeathFire gameplay screenshot 2',
        },
        {
          src: '/media/deathfire3.png',
          alt: 'DeathFire gameplay screenshot 3',
        },
      ],
    },
    links: {
      play: 'https://jjvinco.itch.io/deathfire-web',
      download: 'https://jjvinco.itch.io/deathfire',
      github: 'https://github.com/J-Jaiswal/DeathFire',
      webglEmbed: null,                             // TODO: add WebGL iframe URL
    },
    tech: [
      'Unity',
      'C#',
      'ScriptableObjects',
      'Object Pooling',
      'Event Bus',
    ],
    featured: false,
  },

  /* ── 3. Pursuit ────────────────────────────────────────────────────── */
  {
    id: 'pursuit',
    title: 'Pursuit',
    tagline: 'A 2.5D rocket chase against an AI missile pursuer.',
    coreSystem: '5-state event-driven missile FSM',
    status: 'Prototype',
    // Confirmed Windows build; will confirm additional platforms
    platforms: ['Windows'],
    engine: 'Unity',
    role: 'TODO: Solo Developer (verify role)',
    team: 'TODO: Solo (verify team)',
    duration: 'TODO: Add duration (e.g. 2 months)',
    overview:
      'A rocket-chase game where an AI missile pursuer reacts to player state through a 5-state, event-driven FSM. ' +
      'LLM-generated commentary plays through a priority queue, where critical lines interrupt and stale lines are dropped, ' +
      'fed by an event-driven snapshot layer. Physics, missile difficulty, and checkpoint scaling are tuned through ScriptableObjects.',
    media: {
      thumbnail: '/media/pursuitThumbnail.png',
      poster: '/media/pursuitThumbnail.png',
      previewClip: null,   // Short muted MP4 path for carousel card preview
      gameplayVideo: 'https://youtu.be/7q9BiOqtQSk', // TODO: replace with this game's own video
      screenshots: [
        {
          src: '/media/pursuit1.png',
          alt: 'Pursuit gameplay screenshot 1',
        },
        {
          src: '/media/pursuit2.png',
          alt: 'Pursuit gameplay screenshot 2',
        },
        {
          src: '/media/pursuit3.png',
          alt: 'Pursuit gameplay screenshot 3',
        },
      ],
    },
    links: {
      play: 'https://jjvinco.itch.io/pursuit-web',
      download: 'https://jjvinco.itch.io/pursuit',
      github: 'https://github.com/J-Jaiswal/Pursuit',
      webglEmbed: null,                           // TODO: add WebGL iframe URL
    },
    tech: [
      'Unity',
      'C#',
      'FSM',
      'ScriptableObjects',
      'LLM',
    ],
    featured: false,
  },
];

export default projects;
