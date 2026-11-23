/**
 * src/data/skills.js
 *
 * Skill data for the Toolkit panel.
 * Groups: Game Dev, AI Integration, Backend and Web, Tools.
 *
 * Each skill item:
 *   name        {string}
 *   tier        {string} Proficiency label ("TODO: Select proficiency")
 *   description {string} One line summary of usage
 *   usedIn      {string[]} Array of project IDs ('buddy', 'deathfire', 'pursuit')
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

export const SKILL_GROUPS = [
  {
    id: 'gamedev',
    name: 'Game Dev',
    skills: [
      {
        name: 'Unity (URP)',
        tier: 'TODO: Select proficiency',
        description: 'Gameplay, UI, and animation systems across three shipped games.',
        usedIn: ['buddy', 'deathfire', 'pursuit'],
      },
      {
        name: 'C#',
        tier: 'TODO: Select proficiency',
        description: 'Gameplay systems, AI, and event-driven architecture in Unity.',
        usedIn: ['buddy', 'deathfire', 'pursuit'],
      },
      {
        name: 'Animator/Animation Systems',
        tier: 'TODO: Select proficiency',
        description: 'Reactive gestures synced to audio playback in Buddy.',
        usedIn: ['buddy'],
      },
      {
        name: 'State Machines',
        tier: 'TODO: Select proficiency',
        description: '5-state event-driven missile AI in Pursuit.',
        usedIn: ['pursuit'],
      },
      {
        name: 'Enemy AI',
        tier: 'TODO: Select proficiency',
        description: 'A missile pursuer in Pursuit and strategy-pattern enemies in DeathFire.',
        usedIn: ['pursuit', 'deathfire'],
      },
      {
        name: 'ScriptableObjects',
        tier: 'TODO: Select proficiency',
        description: 'Data-driven tuning for physics, difficulty, and enemy behavior.',
        usedIn: ['pursuit', 'deathfire'],
      },
      {
        name: 'Object Pooling',
        tier: 'TODO: Select proficiency',
        description: "Pooled spawning for DeathFire's 11 waves.",
        usedIn: ['deathfire'],
      },
      {
        name: 'Event-Driven Design',
        tier: 'TODO: Select proficiency',
        description: 'A decoupled event bus in DeathFire and event-based architecture in Buddy and Pursuit.',
        usedIn: ['buddy', 'deathfire', 'pursuit'],
      },
    ],
  },
  {
    id: 'ai-integration',
    name: 'AI Integration',
    skills: [
      {
        name: 'SSE Streaming',
        tier: 'TODO: Select proficiency',
        description: 'Low-latency streamed replies in Buddy.',
        usedIn: ['buddy'],
      },
      {
        name: 'LLM APIs (Groq)',
        tier: 'TODO: Select proficiency',
        description: 'Chat replies in Buddy and generated commentary in Pursuit.',
        usedIn: ['buddy', 'pursuit'],
      },
      {
        name: 'TTS (Deepgram)',
        tier: 'TODO: Select proficiency',
        description: 'Parallel TTS generation for voice replies and commentary.',
        usedIn: ['buddy', 'pursuit'],
      },
      {
        name: 'STT (Groq Whisper)',
        tier: 'TODO: Select proficiency',
        description: "Speech input for Buddy's voice chat.",
        usedIn: ['buddy'],
      },
      {
        name: 'uLipSync',
        tier: 'TODO: Select proficiency',
        description: 'Real-time lip-sync driven by custom blendshapes in Buddy.',
        usedIn: ['buddy'],
      },
    ],
  },
  {
    id: 'backend-web',
    name: 'Backend and Web',
    skills: [
      {
        name: 'Node.js and Express.js',
        tier: 'TODO: Select proficiency',
        description: "The backend for Buddy's chat and streaming pipeline.",
        usedIn: ['buddy'],
      },
      {
        name: 'MongoDB',
        tier: 'TODO: Select proficiency',
        description: 'Chat memory storage for Buddy.',
        usedIn: ['buddy'],
      },
      {
        name: 'JavaScript',
        tier: 'TODO: Select proficiency',
        description: 'Backend logic and browser-based simulations.',
        usedIn: ['buddy'],
      },
      {
        name: 'Three.js, D3.js, Plotly.js',
        tier: 'TODO: Select proficiency',
        description: 'Browser-based geophysics experiments at VLabs.',
        usedIn: [],
      },
    ],
  },
  {
    id: 'tools',
    name: 'Tools',
    skills: [
      {
        name: 'Blender',
        tier: 'TODO: Select proficiency',
        description: "Created 6 blendshapes for Buddy's lip-sync and expressions.",
        usedIn: ['buddy'],
      },
      {
        name: 'Git',
        tier: 'TODO: Select proficiency',
        description: 'TODO: Add description for Git workflows and version control.',
        usedIn: [],
      },
      {
        name: 'GitHub',
        tier: 'TODO: Select proficiency',
        description: 'TODO: Add description for GitHub repository hosting and CI/CD.',
        usedIn: [],
      },
      {
        name: 'Vercel',
        tier: 'TODO: Select proficiency',
        description: 'TODO: Add description for Vercel web deployment and hosting.',
        usedIn: [],
      },
    ],
  },
];

export const CURRENTLY_LEARNING = [];

export default SKILL_GROUPS;
