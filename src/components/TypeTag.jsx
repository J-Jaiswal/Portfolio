/**
 * src/components/TypeTag.jsx
 *
 * Small chip for Journey timeline entries indicating entry type.
 * Styles:
 *   full-time  — amber text on accent-dim, amber border (solid)
 *   intern     — text color on surface-raised, default border (solid)
 *   education  — muted text, dashed border
 */

export default function TypeTag({ type }) {
  if (!type) return null;

  const labels = {
    'full-time': 'FULL-TIME',
    'intern':    'INTERN',
    'education': 'EDUCATION',
  };

  const styles = {
    'full-time': 'text-accent bg-accent-dim border border-accent/60',
    'intern':    'text-text bg-surface-raised border border-border',
    'education': 'text-text-muted border border-dashed border-border',
  };

  const label = labels[type];
  if (!label) return null;

  return (
    <span
      className={[
        'inline-flex items-center font-mono text-[0.6875rem] uppercase tracking-widest px-1.5 py-0.5 shrink-0',
        styles[type] ?? 'text-text-muted border border-dashed border-border',
      ].join(' ')}
    >
      {label}
    </span>
  );
}
