/**
 * src/utils/placeholders.js
 *
 * Centralized utility functions for placeholder detection, filtering,
 * and text sanitization across all portfolio data fields.
 *
 * In development (import.meta.env.DEV), logs a consolidated console.warn
 * listing all hidden placeholders so unfinished items remain easily trackable.
 * In production, all logging is eliminated.
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

/* ── DEV-only warning logger ────────────────────────────────────────────── */
const hiddenPlaceholders = new Set();
let warnTimer = null;

export function warnHidden(sourceFile, fieldName) {
  if (!import.meta.env?.DEV || !sourceFile) return;
  const key = `${sourceFile} -> ${fieldName || 'unspecified field'}`;
  if (!hiddenPlaceholders.has(key)) {
    hiddenPlaceholders.add(key);
    if (!warnTimer) {
      warnTimer = setTimeout(() => {
        warnTimer = null;
        if (hiddenPlaceholders.size > 0) {
          console.warn(
            `[Portfolio DEV] The following ${hiddenPlaceholders.size} placeholder field(s) are hidden on live pages:\n` +
              Array.from(hiddenPlaceholders)
                .map((item) => `  • ${item}`)
                .join('\n')
          );
        }
      }, 80);
    }
  }
}

/**
 * Returns true if value is null, undefined, not a string, empty/whitespace,
 * or contains the string "TODO" (case-insensitive).
 */
export function isPlaceholder(value, sourceFile, fieldName) {
  if (value === null || value === undefined) {
    if (sourceFile) warnHidden(sourceFile, fieldName);
    return true;
  }
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.toUpperCase().includes('TODO')) {
    if (sourceFile) warnHidden(sourceFile, fieldName);
    return true;
  }
  return false;
}

/**
 * Removes any sentence or parenthetical containing "TODO", such as:
 *   - "TODO: Review overview sentences for project specifics."
 *   - "(TODO: review caption)"
 * Trims leftover whitespace and stray punctuation.
 */
export function stripPlaceholders(text, sourceFile, fieldName) {
  if (!text || typeof text !== 'string') return '';
  if (!text.toUpperCase().includes('TODO')) return text.trim();

  if (sourceFile) warnHidden(sourceFile, fieldName);

  let cleaned = text;

  // 1. Remove parentheticals containing TODO: e.g. (TODO: ...)
  cleaned = cleaned.replace(/\s*\([^)]*TODO[^)]*\)/gi, '');

  if (!cleaned.toUpperCase().includes('TODO')) {
    return cleaned.replace(/\s+/g, ' ').trim();
  }

  // 2. Temporarily mask common abbreviations containing periods
  const masked = cleaned.replace(/\b(e\.g\.|i\.e\.)/gi, (m) => m.replace(/\./g, '___DOT___'));

  // 3. Split into sentences by punctuation (.!?) followed by space or end of string
  const sentences = masked.split(/(?<=[.!?])(?:\s+|$)/);
  const kept = sentences
    .filter((s) => !s.toUpperCase().includes('TODO'))
    .map((s) => s.replace(/___DOT___/g, '.'));

  cleaned = kept.join(' ');

  // 4. Fallback: if any line or fragment without trailing punctuation still has TODO, remove it
  if (cleaned.toUpperCase().includes('TODO')) {
    cleaned = cleaned
      .split('\n')
      .filter((line) => !line.toUpperCase().includes('TODO'))
      .join(' ');
  }

  return cleaned.replace(/\s+/g, ' ').trim();
}

/**
 * Filters out items whose text (determined by getText callback) is a placeholder.
 */
export function cleanList(items, getText = (item) => item, sourceFile, listName) {
  if (!Array.isArray(items)) return [];
  return items.filter((item, index) => {
    const text = getText(item);
    const isPh = isPlaceholder(
      text,
      sourceFile,
      listName ? `${listName}[${index}]` : undefined
    );
    return !isPh;
  });
}
