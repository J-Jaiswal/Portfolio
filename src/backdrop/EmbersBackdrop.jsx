/**
 * src/backdrop/EmbersBackdrop.jsx
 *
 * Dark embers canvas backdrop with subtle film grain and vignette.
 * Used exclusively on the root ("/") Title Screen and Main Menu.
 *
 * Performance & Polish:
 *   - Pure HTML5 Canvas, zero external libraries.
 *   - 35-40 amber ember particles on desktop, capped to 20 on small screens (< 768px).
 *   - Gentle upward drift with sinusoidal horizontal sway and top fadeout.
 *   - Pauses calculation when the browser tab is hidden (visibilitychange).
 *   - Respects prefers-reduced-motion: renders static vignette only.
 *   - Subdued faint "JJ" typographic watermark at ~3.5% opacity behind menu.
 *   - Completely non-interactive (pointer-events-none, aria-hidden).
 */

import { useEffect, useRef } from 'react';

export default function EmbersBackdrop({ isMobileStrip = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Particle cap based on viewport width
    const isSmallScreen = width < 768;
    const count = isSmallScreen ? 20 : 38;

    // Initialize particles
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 1.0, // 1.0px to 2.8px
      speedY: Math.random() * 0.45 + 0.25, // upward speed
      swaySpeed: Math.random() * 0.02 + 0.008,
      swayAmount: Math.random() * 0.7 + 0.3,
      phase: Math.random() * Math.PI * 2,
      baseOpacity: Math.random() * 0.45 + 0.25,
    }));

    function resize() {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    }

    window.addEventListener('resize', resize, { passive: true });

    let isTabVisible = !document.hidden;
    function onVisibilityChange() {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        animId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animId);
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Render each amber ember
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move upward and apply horizontal sway
        p.y -= p.speedY;
        p.phase += p.swaySpeed;
        const currentX = p.x + Math.sin(p.phase) * p.swayAmount * 12;

        // Reset particle if it drifts above the canvas
        if (p.y < -10) {
          p.y = height + Math.random() * 20;
          p.x = Math.random() * width;
        }

        // Fade out as it approaches the top third
        const fade = Math.min(1, p.y / (height * 0.4));
        const alpha = p.baseOpacity * Math.max(0, fade);

        // Draw crisp ember point
        ctx.fillStyle = `rgba(217, 164, 65, ${alpha.toFixed(3)})`;
        ctx.fillRect(currentX, p.y, p.size, p.size);
      }

      if (isTabVisible) {
        animId = requestAnimationFrame(render);
      }
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={[
        'absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-bg',
        isMobileStrip ? 'h-[30vh] md:h-full' : 'h-full',
      ].join(' ')}
    >
      {/* ── Subtle Film-Grain Noise Overlay (Inline SVG pattern) ──────── */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Soft Dark Vignette Gradient ───────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 65% 50%, rgba(14, 15, 17, 0.2) 0%, rgba(14, 15, 17, 0.88) 100%)',
        }}
      />

      {/* ── Large Faint Typographic Mark ("JJ" Watermark) ─────────────── */}
      <div
        className="hidden md:block absolute right-[-4vw] top-1/2 -translate-y-1/2 font-heading font-bold text-[34vw] text-text leading-none opacity-[0.035] tracking-tighter"
        aria-hidden="true"
      >
        JJ
      </div>

      {/* ── Embers Canvas ─────────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
}
