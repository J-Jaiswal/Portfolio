/**
 * src/data/about.js
 *
 * Content for the About Me section page and global positioning statements.
 * All text and stats are centralized here so pages contain no hardcoded copy.
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

/** Global positioning statement across title screen, menu, page header, and SEO tags */
export const POSITIONING = 'Unity gameplay programmer focused on enemy AI and AI-integrated systems';

/** Current availability status line */
export const AVAILABILITY = 'Open to relocation across India · Available for immediate joining';

export const aboutData = {
  bio: "I'm a Unity developer and recent IIT Roorkee graduate focused on gameplay programming, enemy AI, and AI-integrated systems. I build playable projects with FSM-based AI, event-driven architecture, LLM integration, and real-time voice pipelines.",
  stats: [
    { label: 'PORTFOLIO TRACK', value: '3 Shipped Projects' },
    { label: 'PRIMARY STACK', value: 'Unity + Node.js' },
    { label: 'ALMA MATER', value: 'IIT Roorkee' },
  ],
  statusTag: 'OPEN TO UNITY AND AI ROLES',
};

/**
 * How I Work: Up to 3 key principles / development methodology steps.
 * NOTE: Currently all items are TODO placeholders; the section is hidden on the live page until populated.
 */
export const howIWork = [
  {
    title: 'TODO: Step 1 (e.g. Rapid Prototyping)',
    text: 'TODO: Outline step 1 approach to mechanics, game feel, and fast iteration.',
  },
  {
    title: 'TODO: Step 2 (e.g. Systems & AI Integration)',
    text: 'TODO: Outline step 2 approach to clean component architecture, state machines, and AI service pipelines.',
  },
  {
    title: 'TODO: Step 3 (e.g. Polish & Shipped Builds)',
    text: 'TODO: Outline step 3 approach to performance tuning, audio feedback, game feel, and deployment.',
  },
];

/**
 * Recommendations / Testimonials: Array of { quote, name, role }.
 * Empty by default. Rendered only when populated with non-placeholder entries.
 */
export const recommendations = [];

export default aboutData;
