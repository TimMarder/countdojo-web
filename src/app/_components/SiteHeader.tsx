"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/count-dojo-bj-card-counting/id6760961014";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.countdojo.app&utm_source=na_Med";

type NavLink = { label: string; href: string };

const defaultLinks: NavLink[] = [
  { label: "Curriculum", href: "/#curriculum" },
  { label: "Drills", href: "/#drills" },
  { label: "Simulator", href: "/#simulator" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

function ChevronDown() {
  return (
    <svg
      className="w-3 h-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

function AppStoreGlyph() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.72-3.06 1.61-.68.79-1.26 2.08-1.1 3.23 1.18.09 2.39-.59 3.09-1.73z" />
    </svg>
  );
}

function PlayStoreGlyph() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
    </svg>
  );
}

function DownloadDropdown() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      // Without this, dismissing drops focus to <body> and keyboard users lose
      // their place in the header.
      triggerRef.current?.focus();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        className="btn-primary"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        Download
        <ChevronDown />
      </button>
      {/* Deliberately not role="menu". That role promises the full ARIA menu
          pattern — roving tabindex, arrow-key navigation, application mode —
          which two links do not need and this did not implement. As a plain
          group of links, native tab order is already correct. */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 border border-control-edge bg-ink-1 overflow-hidden">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="download-menu-item"
            onClick={() => setOpen(false)}
          >
            <AppStoreGlyph />
            <span>iOS</span>
          </a>
          <a
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="download-menu-item"
            onClick={() => setOpen(false)}
          >
            <PlayStoreGlyph />
            <span>Android</span>
          </a>
        </div>
      )}
    </div>
  );
}

export function SiteHeader({ links = defaultLinks }: { links?: NavLink[] }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-ink-0/85 backdrop-blur">
      <div className="site-shell flex items-center justify-between h-16">
        <Link
          href="/"
          className="flex items-center group py-1.5 -my-1.5"
          aria-label="Count Dojo home"
        >
          <Image
            src="/images/Count Dojo Banner Transparent Background NO BORDERS.png"
            alt="Count Dojo"
            /* True intrinsic size. Was declared 220x60 (3.667) against art that
               is 911x288 (3.163), so the reserved box was 16% too wide. */
            width={911}
            height={288}
            priority
            className="h-9 w-auto"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-mono text-paper-muted py-3 -my-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden sm:block">
          <DownloadDropdown />
        </div>
        <button
          type="button"
          /* 24x24 was the only nav control on every phone. p-3 takes it to
             48x48; the negative margin keeps the glyph optically flush. */
          className="md:hidden text-paper p-3 -mr-3"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            viewBox="0 0 24 24"
            aria-hidden
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-rule bg-ink-0">
          <nav
            className="site-shell py-6 flex flex-col gap-5"
            aria-label="Mobile"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-mono text-paper-muted"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-fit"
              >
                <AppStoreGlyph />
                Download · iOS
              </a>
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-fit"
              >
                <PlayStoreGlyph />
                Download · Android
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
