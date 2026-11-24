/**
 * src/components/SoundProvider.jsx
 *
 * Mounted once in App. Wires global delegated event listeners for UI sounds
 * and plays a sound on every route change.
 *
 * Rules:
 *   - Delegated click on button, a, [role=button]: plays `select`, except
 *     internal links (href starts with "/") which are covered by route sound.
 *   - Delegated pointerover / focusin on those elements: plays `move`,
 *     only when matchMedia('(hover: hover)') is true.
 *   - Every route change (after first render) plays `nav`.
 *   - Unlocks audio manager on first pointerdown.
 *   - Respects muted state from sound.js singleton.
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { play, unlock } from '../lib/sound';

const INTERACTIVE = 'button, a, [role="button"]';

function isInternalLink(el) {
  if (el.tagName !== 'A') return false;
  const href = el.getAttribute('href') || '';
  return href.startsWith('/');
}

function findInteractive(target) {
  if (!target || typeof target.closest !== 'function') return null;
  return target.closest(INTERACTIVE);
}

export default function SoundProvider() {
  const location   = useLocation();
  const isFirst    = useRef(true);
  const hoverMedia = useRef(null);

  useEffect(() => {
    // Cache the hover media query
    hoverMedia.current = typeof window !== 'undefined'
      ? window.matchMedia('(hover: hover)')
      : null;

    /* ── Unlock on first pointer down ── */
    function onFirstPointer() {
      unlock();
      window.removeEventListener('pointerdown', onFirstPointer, { capture: true });
    }
    window.addEventListener('pointerdown', onFirstPointer, { capture: true });

    /* ── Delegated click handler ── */
    function onClick(e) {
      const el = findInteractive(e.target);
      if (!el) return;
      if (isInternalLink(el)) return; // route change will play nav
      play('select');
    }

    /* ── Delegated pointerover handler ── */
    function onPointerOver(e) {
      if (!hoverMedia.current?.matches) return;
      const el = findInteractive(e.target);
      if (!el) return;
      play('move');
    }

    /* ── Delegated focusin handler ── */
    function onFocusIn(e) {
      if (!hoverMedia.current?.matches) return;
      const el = findInteractive(e.target);
      if (!el) return;
      play('move');
    }

    document.addEventListener('click',       onClick,      { capture: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('focusin',     onFocusIn,    { passive: true });

    return () => {
      window.removeEventListener('pointerdown', onFirstPointer, { capture: true });
      document.removeEventListener('click',       onClick,      { capture: true });
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('focusin',     onFocusIn);
    };
  }, []);

  /* ── Route change → nav sound (skip first render) ── */
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    play('nav');
  }, [location.pathname]);

  return null;
}
