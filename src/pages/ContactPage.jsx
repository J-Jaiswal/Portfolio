/**
 * src/pages/ContactPage.jsx
 *
 * 05 SAY HELLO (/contact)
 *
 * Requirements:
 *   - Heading: "LET'S BUILD SOMETHING TOGETHER."
 *   - Subline: "I'm open to Unity and AI integration roles."
 *   - Availability line: from src/data/about.js
 *   - Primary button: "EMAIL ME" (runtime mailto construction)
 *   - Secondary button: "COPY EMAIL" with brief "COPIED" state and check icon
 *   - Compact row of inline chips under "ELSEWHERE":
 *       • WhatsApp (opens via click handler with split parts, no wa.me in HTML)
 *       • GitHub, LinkedIn, itch.io
 *       • Each chip has icon + short label + arrow-up-right icon nudging diagonally on hover
 *   - Contrast >= 4.5:1, touch targets >= 44px, all text >= 14px.
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

import { useState, useCallback } from 'react';
import PageLayout from '../layout/PageLayout';
import links from '../data/links';
import { AVAILABILITY } from '../data/about';
import Icon from '../components/Icon';

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  // Robust clipboard copy with fallback
  const copyText = useCallback(async (text, onSuccess) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        onSuccess();
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (success) {
          onSuccess();
        }
      }
    } catch {
      // Fallback: silently ignore
    }
  }, []);

  const handleEmailMe = () => {
    const email = ['jayeshjaiswaloff', 'gmail.com'].join('@');
    window.location.href = `mailto:${email}`;
  };

  const handleCopyEmail = () => {
    const email = ['jayeshjaiswaloff', 'gmail.com'].join('@');
    copyText(email, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const phoneParts = ['91', '78303', '47471'];
    const waUrl = `https://wa.me/${phoneParts.join('')}?text=${encodeURIComponent('Hi Jayesh, I saw your portfolio')}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageLayout
      label="05 / CONTACT"
      title="Say Hello"
      description="Available for indie game development, AI voice pipeline integration, and contract engineering."
    >
      <div className="card p-6 sm:p-10 border border-border max-w-4xl mx-auto w-full">

        {/* ── Headline Block ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 border-b border-border pb-8 mb-8">
          <div className="label-mono text-sm">COMMUNICATION CHANNEL</div>

          <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase tracking-wider text-text leading-tight">
            LET'S BUILD SOMETHING TOGETHER.
          </h2>

          <p className="font-body text-text-muted text-base sm:text-lg">
            I'm open to Unity and AI integration roles.
          </p>

          {AVAILABILITY && (
            <p className="font-mono text-sm text-accent">
              {AVAILABILITY}
            </p>
          )}
        </div>

        {/* ── Direct Action Buttons (Email Me & Copy Email) ──────────────── */}
        <div className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-border">
          <button
            type="button"
            onClick={handleEmailMe}
            className="btn min-h-[44px] h-[44px] px-6 text-sm font-mono inline-flex items-center gap-2 cursor-pointer"
            aria-label="Send email"
          >
            <span>EMAIL ME</span>
            <Icon name="mail" size={16} />
          </button>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="btn-secondary min-h-[44px] h-[44px] px-6 text-sm font-mono inline-flex items-center gap-2 cursor-pointer"
            aria-label="Copy email address to clipboard"
          >
            <span>{copied ? 'COPIED' : 'COPY EMAIL'}</span>
            <Icon name={copied ? 'check' : 'copy'} size={16} />
          </button>
        </div>

        {/* ── ELSEWHERE Row of Compact Chips ─────────────────────────────── */}
        <div>
          <div className="label-mono text-sm text-accent mb-4 tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-accent inline-block shrink-0" aria-hidden="true" />
            <span>ELSEWHERE</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* WhatsApp Chip */}
            <button
              type="button"
              onClick={handleWhatsAppClick}
              aria-label="Message me on WhatsApp"
              className="group inline-flex items-center gap-2 min-h-[44px] h-[44px] px-4 bg-surface border border-border hover:border-accent text-text hover:text-accent font-mono text-sm uppercase transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Icon name="whatsapp" size={18} className="text-accent shrink-0" />
              <span>WhatsApp</span>
              <Icon
                name="arrow-up-right"
                size={14}
                className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
              />
            </button>

            {/* GitHub Chip */}
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="group inline-flex items-center gap-2 min-h-[44px] h-[44px] px-4 bg-surface border border-border hover:border-accent text-text hover:text-accent font-mono text-sm uppercase transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Icon name="github" size={18} className="text-accent shrink-0" />
              <span>GitHub</span>
              <Icon
                name="arrow-up-right"
                size={14}
                className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
              />
            </a>

            {/* LinkedIn Chip */}
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="group inline-flex items-center gap-2 min-h-[44px] h-[44px] px-4 bg-surface border border-border hover:border-accent text-text hover:text-accent font-mono text-sm uppercase transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Icon name="linkedin" size={18} className="text-accent shrink-0" />
              <span>LinkedIn</span>
              <Icon
                name="arrow-up-right"
                size={14}
                className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
              />
            </a>

            {/* itch.io Chip */}
            <a
              href={links.itchio}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="itch.io profile"
              className="group inline-flex items-center gap-2 min-h-[44px] h-[44px] px-4 bg-surface border border-border hover:border-accent text-text hover:text-accent font-mono text-sm uppercase transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Icon name="itch" size={18} className="text-accent shrink-0" />
              <span>itch.io</span>
              <Icon
                name="arrow-up-right"
                size={14}
                className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
              />
            </a>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
