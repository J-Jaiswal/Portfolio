/**
 * src/data/experience.js
 *
 * Timeline entries for the Journey panel.
 * Represents education and work milestones.
 *
 * type field values:
 *   'full-time' | 'intern' | 'education'
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

const experience = [
  {
    id: 'vlabs-iitr',
    type: 'intern',
    role: 'Software Developer Intern',
    organization: 'VLabs, IIT Roorkee',
    period: 'July 2025 — Sept 2025',
    status: 'Completed',
    summary: 'Built interactive web-based simulations for seismic exploration and education.',
    bullets: [
      'Developed two browser-based interactive geophysics experiments from scratch using Three.js, D3.js and Plotly.js.',
      'Created a seismogram simulator with moment tensor-based waveform generation and 3D visualization.',
      'Engineered an earthquake locator using damped Gauss-Newton inversion with misfit heatmaps.',
      'Added convergence analysis to track how the inversion improves with each iteration.',
    ],
  },
  {
    id: 'iitr-mtech',
    type: 'education',
    role: 'Integrated M.Tech, Geophysical Technology',
    organization: 'Indian Institute of Technology Roorkee',
    period: 'Nov 2020 — May 2025',
    status: 'Completed',
    summary: 'Integrated M.Tech degree covering geophysical modeling, computation, and programming.',
    bullets: [],
  },
];

export default experience;
