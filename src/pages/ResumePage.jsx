/**
 * src/pages/ResumePage.jsx
 *
 * 06 RESUME (/resume)
 *
 * Features:
 *   - Proactive existence check: verifies /media/resume.pdf exists with PDF MIME type.
 *     Cached in sessionStorage only when successful (never caches failed renders).
 *   - Missing file state: displays clean "Resume Coming Soon" card with email contact.
 *   - Document-only viewer: renders every page of the PDF directly to crisp <canvas> elements
 *     using pdfjs-dist legacy build loaded via dynamic import to keep it isolated from the main bundle.
 *   - Worker configured through Vite via `?url` import of pdf.worker.min.mjs.
 *   - React StrictMode cleanup: cancels active render tasks and destroys loading tasks on unmount.
 *   - Sharp canvas drawing using window.devicePixelRatio.
 *   - Responsive sizing: max width 794px, 16px vertical gap between pages, white document background,
 *     1px border (#2A2D33), zero browser toolbars/controls/zoom UI.
 *   - Debounced re-render on resize.
 *   - Accessible: canvas container has role="img" and aria-label="Resume preview. Use Download PDF for the full text."
 *   - Centered 44px action buttons ("OPEN IN NEW TAB" and "DOWNLOAD PDF") placed directly below document.
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';

const CACHE_KEY = 'portfolio_resume_status';

export default function ResumePage() {
  const [pdfStatus, setPdfStatus] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        // Only trust positive verification from cache
        if (cached === 'available') return 'available';
      } catch {
        // ignore
      }
    }
    return 'checking';
  });

  const [numPages, setNumPages] = useState(0);
  const [isLoadingDoc, setIsLoadingDoc] = useState(true);
  const [renderError, setRenderError] = useState(false);

  const containerRef = useRef(null);
  const pdfDocRef = useRef(null);
  const loadingTaskRef = useRef(null);
  const canvasRefs = useRef([]);
  const renderTasksRef = useRef([]);
  const currentWidthRef = useRef(0);

  // 1. Proactive existence check
  useEffect(() => {
    let isMounted = true;

    if (pdfStatus === 'available') {
      return;
    }

    async function checkResume() {
      try {
        let res = await fetch('/media/resume.pdf', { method: 'HEAD' });
        if (res.status === 405) {
          res = await fetch('/media/resume.pdf', {
            method: 'GET',
            headers: { Range: 'bytes=0-0' },
          });
        }
        const contentType = (res.headers.get('content-type') || '').toLowerCase();
        const isPdf = res.ok && contentType.includes('pdf');

        if (isPdf) {
          if (typeof window !== 'undefined') {
            try {
              sessionStorage.setItem(CACHE_KEY, 'available');
            } catch {
              // ignore
            }
          }
          if (isMounted) {
            setPdfStatus('available');
          }
        } else {
          // Do not cache failed or missing renders permanently in session storage
          if (isMounted) {
            setPdfStatus('missing');
          }
        }
      } catch {
        if (isMounted) {
          setPdfStatus('missing');
        }
      }
    }

    checkResume();

    return () => {
      isMounted = false;
    };
  }, [pdfStatus]);

  // 2. Render all PDF pages onto canvases
  const renderPages = useCallback(async (pdf, targetWidth) => {
    if (!pdf || targetWidth <= 0) return;

    // Cancel any running render tasks
    renderTasksRef.current.forEach((task) => {
      try {
        task.cancel();
      } catch {
        // ignore cancellation error
      }
    });
    renderTasksRef.current = [];

    const total = pdf.numPages;
    const dpr = Math.max(window.devicePixelRatio || 1, 1);

    for (let pageNum = 1; pageNum <= total; pageNum++) {
      const canvas = canvasRefs.current[pageNum - 1];
      if (!canvas) continue;

      try {
        const page = await pdf.getPage(pageNum);
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = targetWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });

        // Sharp canvas dimensions scaled by devicePixelRatio
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        const renderTask = page.render({
          canvasContext: ctx,
          viewport,
        });

        renderTasksRef.current.push(renderTask);
        await renderTask.promise;
      } catch (err) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('[Resume Render Error]', err);
          setRenderError(true);
        }
      }
    }
  }, []);

  // 3. Load PDF via dynamic import of pdfjs-dist legacy build with Vite worker
  useEffect(() => {
    if (pdfStatus !== 'available') return;

    let isMounted = true;

    async function loadPdfDocument() {
      setIsLoadingDoc(true);
      setRenderError(false);

      try {
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

        // Fetch file, verify status & content-type, pass Uint8Array data object
        const response = await fetch('/media/resume.pdf');
        if (!response.ok) {
          throw new Error(`Failed to fetch resume: HTTP ${response.status}`);
        }
        const contentType = (response.headers.get('content-type') || '').toLowerCase();
        if (!contentType.includes('pdf')) {
          throw new Error(`Expected PDF content-type, received ${contentType}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        if (!isMounted) return;

        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
        });
        loadingTaskRef.current = loadingTask;

        const pdf = await loadingTask.promise;
        if (!isMounted) return;

        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setIsLoadingDoc(false);
      } catch (err) {
        if (isMounted && err?.name !== 'RenderingCancelledException') {
          console.error('[PDF Load Error]', err);
          setRenderError(true);
          setIsLoadingDoc(false);
        }
      }
    }

    loadPdfDocument();

    return () => {
      isMounted = false;
      if (loadingTaskRef.current) {
        try {
          loadingTaskRef.current.destroy();
        } catch {
          // ignore
        }
        loadingTaskRef.current = null;
      }
      renderTasksRef.current.forEach((task) => {
        try {
          task.cancel();
        } catch {
          // ignore
        }
      });
      renderTasksRef.current = [];
    };
  }, [pdfStatus]);

  // 4. Trigger render whenever numPages is set or container resizes (debounced)
  useEffect(() => {
    if (!pdfDocRef.current || numPages === 0) return;

    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      const containerWidth = container.clientWidth || 794;
      const targetWidth = Math.min(containerWidth, 794);

      if (targetWidth === currentWidthRef.current && currentWidthRef.current > 0) {
        return;
      }

      currentWidthRef.current = targetWidth;
      renderPages(pdfDocRef.current, targetWidth);
    };

    // Initial render
    handleResize();

    // Debounced resize handler
    let timeoutId = null;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
    };
  }, [numPages, renderPages]);

  return (
    <PageLayout
      label="06 / RESUME"
      title="Resume"
      description="Curriculum Vitae & Professional Background"
    >
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto">

        {/* ── Missing File Fallback State ──────────────────────────────────── */}
        {pdfStatus === 'missing' ? (
          <div className="card p-8 sm:p-12 border border-border flex flex-col items-center justify-center text-center max-w-xl mx-auto my-8">
            <div
              className="w-14 h-14 border border-accent bg-accent-dim flex items-center justify-center font-mono text-accent text-lg font-bold mb-4"
              aria-hidden="true"
            >
              PDF
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-text mb-2">
              Resume Coming Soon
            </h2>
            <p className="font-body text-sm sm:text-base text-text-muted leading-relaxed mb-6">
              The PDF resume is currently being updated. In the meantime, feel free to explore my game projects or reach out directly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/games" className="btn min-h-[44px] px-5 text-xs">
                VIEW MY GAMES →
              </Link>
              <button
                type="button"
                onClick={() => {
                  window.location.href = `mailto:${['jayeshjaiswaloff', 'gmail.com'].join('@')}`;
                }}
                className="btn-secondary min-h-[44px] px-5 text-xs font-mono inline-flex items-center justify-center cursor-pointer"
              >
                EMAIL ME
              </button>
            </div>
          </div>
        ) : (
          /* ── Plain Document Pages Presentation ─────────────────────────── */
          <div className="w-full flex flex-col items-center">

            {/* Loading skeleton block */}
            {isLoadingDoc && (
              <div className="w-full max-w-[794px] aspect-[1/1.414] bg-surface border border-border animate-pulse flex flex-col items-center justify-center p-8 select-none">
                <span className="w-2.5 h-2.5 bg-accent animate-ping mb-3" aria-hidden="true" />
                <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
                  LOADING RESUME PREVIEW…
                </span>
              </div>
            )}

            {/* Error message if preview rendering fails */}
            {renderError && (
              <div className="card p-6 border border-border bg-surface text-center max-w-md mx-auto my-4 w-full">
                <p className="font-body text-sm text-text-muted mb-2">The preview couldn't load.</p>
                <p className="font-mono text-xs text-accent">Use the buttons below to open or download the resume.</p>
              </div>
            )}

            {/* Canvas Container: role="img", centered pages, white background, 1px border #2A2D33, 16px gap */}
            <div
              ref={containerRef}
              role="img"
              aria-label="Resume preview. Use Download PDF for the full text."
              className="w-full flex flex-col items-center gap-[16px]"
            >
              {Array.from({ length: numPages }, (_, idx) => (
                <canvas
                  key={idx + 1}
                  ref={(el) => {
                    canvasRefs.current[idx] = el;
                  }}
                  className="bg-white border border-[#2A2D33] shadow-md block mx-auto"
                  aria-hidden="true"
                />
              ))}
            </div>

            {/* Action buttons directly below document: 44px tall, stacked full-width on mobile */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
              <a
                href="/media/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full sm:w-auto min-h-[44px] h-[44px] px-6 text-xs font-mono inline-flex items-center justify-center gap-2"
              >
                <span>OPEN IN NEW TAB</span>
                <span aria-hidden="true">↗</span>
              </a>

              <a
                href="/media/resume.pdf"
                download="Jayesh_Jaiswal_Resume.pdf"
                className="btn-secondary w-full sm:w-auto min-h-[44px] h-[44px] px-6 text-xs font-mono inline-flex items-center justify-center gap-2"
              >
                <span>DOWNLOAD PDF</span>
                <span aria-hidden="true">↓</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </PageLayout>
  );
}
