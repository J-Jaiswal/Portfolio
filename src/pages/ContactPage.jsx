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
 *   - "FIND MY PROFILES" link to /about page (social links now live on About).
 *   - Contrast >= 4.5:1, touch targets >= 44px, all text >= 14px.
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
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

  return (
    <PageLayout
      label="05 / CONTACT"
      title="Say Hello"
      description="Available for indie game development, AI voice pipeline integration, and contract engineering."
    >
      <div className="card p-6 sm:p-10 border border-border max-w-4xl mx-auto w-full">

        {/* ── Headline Block ───────────────────────────────────────────── */}
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

        {/* ── Direct Action Buttons (Email Me & Copy Email) ─────────────── */}
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

        {/* ── Find profiles on About ────────────────────────────────────── */}
        <div className="flex items-center gap-3 font-mono text-sm text-text-muted">
          <span className="w-1.5 h-1.5 bg-accent inline-block shrink-0" aria-hidden="true" />
          <span>
            Find my profiles on{' '}
            <Link
              to="/about"
              className="text-accent hover:underline underline-offset-2 transition-colors"
            >
              About
            </Link>
            .
          </span>
        </div>

      </div>
    </PageLayout>
  );
}
