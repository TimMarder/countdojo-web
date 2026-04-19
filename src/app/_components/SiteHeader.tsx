"use client";

import Link from "next/link";
import { useState } from "react";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/count-dojo-bj-card-counting/id6760961014";

type NavLink = { label: string; href: string };

const defaultLinks: NavLink[] = [
  { label: "Curriculum", href: "/#curriculum" },
  { label: "Drills", href: "/#drills" },
  { label: "Simulator", href: "/#simulator" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

function ArrowIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7V15" />
    </svg>
  );
}

export function SiteHeader({ links = defaultLinks }: { links?: NavLink[] }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-ink-0/85 backdrop-blur">
      <div className="site-shell flex items-center justify-between h-16">
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Count Dojo home"
        >
          <span
            className="font-display text-2xl text-paper group-hover:text-emerald-accent transition-colors"
            style={{ fontVariationSettings: '"SOFT" 100, "opsz" 48' }}
          >
            Count Dojo
          </span>
          <span className="dot-emerald" aria-hidden />
        </Link>
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="link-mono text-paper-muted">
              {link.label}
            </Link>
          ))}
        </nav>
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex btn-primary"
        >
          Download
          <ArrowIcon />
        </a>
        <button
          type="button"
          className="md:hidden text-paper"
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
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-fit"
            >
              Download
              <ArrowIcon />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
