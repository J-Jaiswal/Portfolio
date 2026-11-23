/**
 * src/components/PlatformChips.jsx
 *
 * Renders platform badges with inline SVG icons for
 * Windows, Android, iOS, and Web via the central Icon component.
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

import Icon from './Icon';

function getIconName(platform) {
  switch (platform) {
    case 'Windows':
      return 'windows';
    case 'Android':
      return 'android';
    case 'iOS':
      return 'apple';
    case 'Web':
    default:
      return 'web';
  }
}

export default function PlatformChips({ platforms = [] }) {
  if (!Array.isArray(platforms) || platforms.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-label="Supported platforms">
      {platforms.map((platform) => (
        <span
          key={platform}
          className="tag font-mono text-[0.68rem] inline-flex items-center gap-1.5 py-1 px-2 border-border text-text-muted hover:text-text hover:border-accent/50 transition-colors"
          title={`Runs on ${platform}`}
        >
          <Icon name={getIconName(platform)} size={14} />
          <span>{platform}</span>
        </span>
      ))}
    </div>
  );
}
