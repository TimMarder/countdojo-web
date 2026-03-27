"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */

type Feature = {
  title: string;
  description: string;
  rank: string;
  suit: string;
  suitColor: string;
  span: string;
};

type Testimonial = {
  quote: string;
  author: string;
  detail?: string;
};

type FAQ = {
  question: string;
  answer: string;
};

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Screenshots", href: "#screenshots" },
  { label: "FAQ", href: "#faq" },
];

const marqueeItems = [
  "10,000+ Downloads",
  "4.9★ App Store Rating",
  "50+ Lessons & Drills",
  "#1 Card Counting App",
  "Hi-Lo · KO · Omega II",
  "Casino Simulator",
  "30-Day Learning Path",
  "Gamified Progression",
];

const featureList: Feature[] = [
  {
    title: "Structured Curriculum",
    description:
      "Progressive lessons from basic strategy to advanced advantage play. A complete education, sequenced for mastery.",
    rank: "A",
    suit: "♠",
    suitColor: "text-gray-400",
    span: "md:col-span-4",
  },
  {
    title: "Interactive Drills",
    description:
      "Flashcard drills, deck countdown, true count, and betting simulations.",
    rank: "K",
    suit: "♥",
    suitColor: "text-rose-500",
    span: "md:col-span-2",
  },
  {
    title: "Gamification",
    description: "Earn XP, level up, maintain streaks, and unlock achievements.",
    rank: "Q",
    suit: "♦",
    suitColor: "text-amber-500",
    span: "md:col-span-2",
  },
  {
    title: "Reference Library",
    description:
      "Strategy charts, deviation indexes, and calculators at your fingertips.",
    rank: "J",
    suit: "♣",
    suitColor: "text-emerald-500",
    span: "md:col-span-2",
  },
  {
    title: "Casino Simulator",
    description:
      "Test your skills in a realistic casino environment before risking real money.",
    rank: "10",
    suit: "♠",
    suitColor: "text-gray-400",
    span: "md:col-span-2",
  },
  {
    title: "Expert Content",
    description:
      "Learn the math, history, and psychology behind card counting from the pros.",
    rank: "9",
    suit: "♥",
    suitColor: "text-rose-500",
    span: "md:col-span-3",
  },
];

const screenshots = [
  { src: "/images/IMG_6959.PNG", alt: "Skill Tree" },
  { src: "/images/IMG_6960.PNG", alt: "Practice" },
  { src: "/images/IMG_6961.PNG", alt: "Drills" },
  { src: "/images/IMG_6962.PNG", alt: "Counting" },
  { src: "/images/IMG_6963.PNG", alt: "Reference" },
  { src: "/images/IMG_6964.PNG", alt: "Casino Sim" },
  { src: "/images/IMG_6965.PNG", alt: "Simulator" },
  { src: "/images/IMG_6966.PNG", alt: "Profile" },
  { src: "/images/IMG_6967.PNG", alt: "Settings" },
  { src: "/images/IMG_6968.PNG", alt: "Stats" },
];

const testimonialList: Testimonial[] = [
  {
    quote:
      "I went from knowing nothing about card counting to being able to count down a deck in 30 seconds. This app is legit.",
    author: "Mike R.",
    detail: "CFA, recreational player",
  },
  {
    quote:
      "The gamification keeps me coming back every day. I\u2019ve a 47 day streak now. Better than Duolingo!",
    author: "Sarah L.",
    detail: "Former casino dealer",
  },
  {
    quote:
      "Finally, a structured way to learn card counting. No more YouTube videos or books.",
    author: "James T.",
    detail: "Tech founder",
  },
  {
    quote:
      "Went to Vegas last month and felt confident at the tables for the first time.",
    author: "David K.",
    detail: "AP team member",
  },
];

const faqList: FAQ[] = [
  {
    question: "Is card counting legal?",
    answer:
      "Yes! Card counting is completely legal. Casinos may ask you to leave (trespassing), but you can\u2019t be arrested for using your brain.",
  },
  {
    question: "Will this app guarantee I win?",
    answer:
      "No gambling system can guarantee wins. Card counting gives you a mathematical edge, but variance means you can still lose in the short term.",
  },
  {
    question: "How long does it take to learn?",
    answer:
      "Most users complete the basic curriculum in 30\u201360 days with daily practice.",
  },
  {
    question: "Do I need to be good at math?",
    answer: "Not at all! Hi-Lo counting only requires adding and subtracting 1.",
  },
  {
    question: "Free vs Premium?",
    answer:
      "Free: basics + intro to counting. Premium: true count, betting, deviations, simulator.",
  },
];

const APP_STORE_URL =
  "https://apps.apple.com/us/app/count-dojo-bj-card-counting/id6760961014";

/* ═══════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════ */

function usePrefersReducedMotion() {
  const subscribe = useCallback((cb: () => void) => {
    if (typeof window === "undefined") return () => undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  }, []);
  const snap = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  return useSyncExternalStore(subscribe, snap, useCallback(() => false, []));
}

/* ═══════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════ */

/* ── Page Loader ── */
function PageLoader({ onLoaded }: { onLoaded: () => void }) {
  const [show, setShow] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setShow(false);
        onLoaded();
      }, 700);
    }, 1200);
    return () => clearTimeout(t);
  }, [onLoaded]);

  if (!show) return null;
  return (
    <div className={`page-loader ${exiting ? "curtain-exit" : ""}`}>
      <Image
        src="/images/Count Dojo Banner Transparent Background.png"
        alt="Count Dojo"
        width={4500}
        height={900}
        className="loader-logo"
        priority
      />
      <div className="loader-spinner" />
    </div>
  );
}

/* ── Scroll Progress ── */
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const h = () => {
      const d = document.documentElement.scrollHeight - window.innerHeight;
      setP(d > 0 ? Math.min((window.scrollY / d) * 100, 100) : 0);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return <div className="scroll-progress" style={{ width: `${p}%` }} />;
}

/* ── Floating Suits ── */
function FloatingSuits() {
  const reduce = usePrefersReducedMotion();
  const items = useMemo(() => {
    if (reduce) return [];
    const symbols = ["\u2660", "\u2665", "\u2666", "\u2663"];
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      symbol: symbols[i % 4],
      left: Math.random() * 100,
      dur: Math.random() * 28 + 22,
      delay: Math.random() * 18,
      size: Math.random() * 14 + 10,
      opacity: Math.random() * 0.04 + 0.015,
    }));
  }, [reduce]);

  if (reduce) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.map((s) => (
        <span
          key={s.id}
          className="absolute text-white floating-suit"
          style={{
            left: `${s.left}%`,
            fontSize: `${s.size}px`,
            opacity: s.opacity,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  );
}

/* ── Grain Overlay (SVG noise) ── */
function GrainOverlay() {
  return (
    <svg className="grain-svg" aria-hidden="true">
      <filter id="grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.75"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

/* ── Reveal on scroll ── */
function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.unobserve(e.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform-gpu ${
        vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {children}
    </div>
  );
}

/* ── Magnetic Button ── */
function MagneticButton({
  children,
  className = "",
  href,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    };
    const leave = () => {
      el.style.transform = "translate(0,0)";
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  if (href && href !== "#") {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`magnetic-button ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={`magnetic-button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* ── Bento Feature Card ── */
function BentoCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  return (
    <Reveal delay={index * 80}>
      <div className="bento-card group h-full rounded-2xl p-6 relative overflow-hidden min-h-[150px]">
        {/* Playing card corner index */}
        <div className="absolute top-4 right-5 text-right opacity-[0.12] group-hover:opacity-[0.25] transition-opacity duration-500 select-none pointer-events-none">
          <div
            className={`text-3xl font-heading font-bold leading-none ${feature.suitColor}`}
          >
            {feature.rank}
          </div>
          <div className={`text-xl leading-none mt-0.5 ${feature.suitColor}`}>
            {feature.suit}
          </div>
        </div>

        {/* Bottom-right mirrored index (like a real card) */}
        <div className="absolute bottom-4 left-5 text-left opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500 select-none pointer-events-none rotate-180">
          <div
            className={`text-2xl font-heading font-bold leading-none ${feature.suitColor}`}
          >
            {feature.rank}
          </div>
          <div className={`text-lg leading-none mt-0.5 ${feature.suitColor}`}>
            {feature.suit}
          </div>
        </div>

        <div className="relative z-10">
          <h3 className="text-lg font-semibold mb-2 text-gray-100 group-hover:text-white transition-colors">
            {feature.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
            {feature.description}
          </p>
        </div>

        {/* Hover accent glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-emerald-500/[0.04] to-transparent pointer-events-none" />
      </div>
    </Reveal>
  );
}

/* ── FAQ Item ── */
function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <Reveal delay={index * 60}>
      <div className="border border-white/[0.04] rounded-xl overflow-hidden bg-white/[0.01] hover:bg-white/[0.015] transition-colors">
        <button
          className="w-full flex items-center justify-between px-6 py-5 text-left"
          onClick={() => setOpen((p) => !p)}
          aria-expanded={open}
        >
          <span className="font-medium text-gray-200 pr-4">{faq.question}</span>
          <span
            className={`text-emerald-500 text-xl font-light transition-transform duration-300 flex-shrink-0 ${
              open ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>
        <div
          className={`grid transition-all duration-300 ease-out ${
            open
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="px-6 pb-5 text-sm text-gray-400 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */

export default function Home() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const reduceMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduceMotion) {
      videoRef.current?.pause();
      return;
    }
    videoRef.current?.play().catch(() => undefined);
  }, [reduceMotion]);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handlePageLoad = useCallback(() => setPageLoaded(true), []);
  const heroParallax = useMemo(
    () => (reduceMotion ? 0 : Math.min(scrollY * 0.15, 150)),
    [scrollY, reduceMotion]
  );

  // Header opacity on scroll
  const headerBg = useMemo(() => {
    const opacity = Math.min(scrollY / 200, 0.95);
    return `rgba(7, 7, 7, ${opacity})`;
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-emerald-500/30 selection:text-white overflow-hidden">
      <PageLoader onLoaded={handlePageLoad} />
      <ScrollProgress />
      <FloatingSuits />
      <GrainOverlay />

      {/* ═══ HEADER ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-3 sm:pt-4">
        <div
          className="max-w-6xl mx-auto backdrop-blur-2xl border border-white/[0.05] rounded-2xl px-4 sm:px-5 h-14 flex items-center justify-between transition-colors duration-300"
          style={{ backgroundColor: headerBg }}
        >
          <a
            href="/"
            className="flex items-center gap-2 h-full overflow-hidden"
          >
            <Image
              src="/images/Count Dojo Banner Transparent Background NO BORDERS.png"
              alt="Count Dojo"
              width={140}
              height={28}
              className="h-[90px] w-auto object-contain"
              priority
            />
          </a>

          <nav className="hidden sm:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-[13px] text-gray-400 hover:text-white font-medium rounded-lg hover:bg-white/[0.04] transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden sm:block">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-semibold bg-emerald-500 text-gray-950 px-4 py-1.5 rounded-lg hover:bg-emerald-400 transition-colors"
            >
              Download
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="sm:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-2 max-w-6xl mx-auto bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/[0.05] rounded-2xl overflow-hidden">
            <div className="p-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white rounded-xl hover:bg-white/[0.04] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2.5 text-sm font-medium text-emerald-400"
              >
                Download App
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-32 px-6">
        {/* Video BG */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay={!reduceMotion}
            muted
            loop
            playsInline
            poster="/images/IMG_6960.PNG"
          >
            <source src="/videos/blackjack-hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/50 via-[#070707]/80 to-[#070707]" />
        </div>

        {/* Emerald ambient glow */}
        <div
          className="absolute top-0 left-1/2 w-[900px] h-[600px] bg-emerald-500/[0.12] blur-[200px] rounded-full pointer-events-none"
          style={{
            transform: `translate(-50%, ${heroParallax * -0.5}px)`,
          }}
        />

        {/* Decorative suit watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[320px] md:text-[420px] text-white/[0.012] font-heading select-none pointer-events-none leading-none">
          &#9824;
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] text-gray-500 text-xs font-mono tracking-wide mb-8">
              <span className="text-emerald-500">&#9824;</span>
              The art of advantage play
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-heading font-extrabold tracking-tight leading-[0.92]">
              <span className="block text-white">Train to beat</span>
              <span className="block mt-1 bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                the casino
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-lg md:text-xl text-gray-400 mt-8 max-w-xl mx-auto leading-relaxed font-light">
              The world&apos;s first gamified card counting app. From absolute
              beginner to casino-ready.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <MagneticButton
                href={APP_STORE_URL}
                className="group bg-white text-gray-950 px-7 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 hover:bg-gray-100 transition-all duration-300 shadow-[0_0_50px_rgba(255,255,255,0.08)]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.72-3.06 1.61-.68.79-1.26 2.08-1.1 3.23 1.18.09 2.39-.59 3.09-1.73z" />
                </svg>
                Download for iOS
              </MagneticButton>

              <div className="relative">
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 bg-amber-500/90 text-[#070707] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
                  Coming Soon
                </span>
                <MagneticButton
                  href="#"
                  className="bg-white/[0.05] text-white/40 px-7 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 border border-white/[0.06] cursor-default"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  Android
                </MagneticButton>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <a
          href="#marquee"
          className="hidden md:flex flex-col items-center gap-2 absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-600 hover:text-gray-400 transition-colors"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase font-mono">
            Scroll
          </span>
          <span className="h-10 w-px bg-gradient-to-b from-transparent to-gray-600 animate-float" />
        </a>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div
        id="marquee"
        className="border-y border-white/[0.04] py-5 overflow-hidden bg-[#070707]"
      >
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map(
            (item, i) => (
              <span
                key={i}
                className="flex items-center gap-3 text-sm whitespace-nowrap text-gray-500 font-medium"
              >
                <span className="text-emerald-600/60 text-[10px]">&#9830;</span>
                {item}
              </span>
            )
          )}
        </div>
      </div>

      {/* ═══ FEATURES BENTO ═══ */}
      <section id="features" className="px-6 py-28 md:py-36 relative">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-6xl mx-auto relative">
          <div className="mb-16 md:mb-20">
            <Reveal>
              <span className="text-emerald-500 text-xs font-mono tracking-wider uppercase">
                &#9824; The Deck
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mt-3 tracking-tight">
                Everything you need
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-gray-500 mt-4 max-w-lg text-lg font-light">
                The only A-to-Z platform that teaches card counting from
                beginner to advanced.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {featureList.map((feature, i) => (
              <div key={feature.title} className={feature.span}>
                <BentoCard feature={feature} index={i} />
              </div>
            ))}

            {/* CTA bento card */}
            <div className="md:col-span-3">
              <Reveal delay={featureList.length * 80}>
                <div className="h-full rounded-2xl bg-gradient-to-br from-emerald-950/50 to-emerald-900/20 border border-emerald-500/[0.08] p-6 flex flex-col justify-between min-h-[150px] group hover:border-emerald-500/20 transition-all duration-500">
                  <div>
                    <span className="text-emerald-400/70 text-xs font-mono">
                      Start today
                    </span>
                    <h3 className="text-xl font-semibold mt-1.5 text-white">
                      Ready to count?
                    </h3>
                    <p className="text-gray-500 text-sm mt-2">
                      Begin your card counting journey for free.
                    </p>
                  </div>
                  <MagneticButton
                    href={APP_STORE_URL}
                    className="mt-5 bg-emerald-500 text-gray-950 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-400 transition-colors w-fit flex items-center gap-2"
                  >
                    Download Free
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </MagneticButton>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SCREENSHOTS ═══ */}
      <section id="screenshots" className="py-28 md:py-36 relative">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/[0.06] blur-[180px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 mb-14">
          <Reveal>
            <span className="text-emerald-500 text-xs font-mono tracking-wider uppercase">
              &#9829; The Deal
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mt-3 tracking-tight">
              See it in action
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-gray-500 mt-4 text-lg font-light">
              Swipe through the app
            </p>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-8">
            <div className="flex gap-4 md:gap-6 px-[max(24px,calc(50vw-540px))]">
              {screenshots.map((s, i) => (
                <div
                  key={i}
                  className="snap-center flex-shrink-0 w-[200px] md:w-[240px] group"
                >
                  <div className="phone-frame rounded-[24px] md:rounded-[28px] bg-[#111] p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.5)] border border-white/[0.05] group-hover:border-emerald-500/15 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
                    <Image
                      src={s.src}
                      alt={s.alt}
                      width={260}
                      height={563}
                      className="rounded-[20px] md:rounded-[24px] w-full h-auto"
                    />
                  </div>
                  <p className="text-center mt-4 text-[11px] text-gray-600 font-medium tracking-widest uppercase">
                    {s.alt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="px-6 py-28 md:py-36 relative">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <span className="text-emerald-500 text-xs font-mono tracking-wider uppercase">
              &#9827; The Table
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mt-3 tracking-tight mb-16 md:mb-20">
              What players say
            </h2>
          </Reveal>

          {/* Featured quote */}
          <Reveal delay={120}>
            <div className="mb-12 md:mb-16 relative">
              {/* Large decorative quote mark */}
              <div className="absolute -top-6 -left-2 text-7xl md:text-8xl text-emerald-500/[0.07] font-heading select-none pointer-events-none leading-none">
                &ldquo;
              </div>
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-heading font-medium leading-snug text-gray-200 max-w-3xl relative z-10">
                {testimonialList[0].quote}
              </blockquote>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-8 h-px bg-emerald-500" />
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-medium text-sm">
                    {testimonialList[0].author}
                  </span>
                  {testimonialList[0].detail && (
                    <span className="text-gray-600 text-sm">
                      &middot; {testimonialList[0].detail}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Supporting quotes */}
          <div className="grid md:grid-cols-3 gap-3">
            {testimonialList.slice(1).map((t, i) => (
              <Reveal key={t.author} delay={200 + i * 80}>
                <div className="bento-card rounded-2xl p-6 h-full">
                  <p className="text-gray-300 text-sm leading-relaxed mb-5">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-px bg-emerald-500/40" />
                    <p className="text-emerald-400/80 text-xs font-medium">
                      {t.author}
                    </p>
                    {t.detail && (
                      <p className="text-gray-600 text-xs">
                        &middot; {t.detail}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="px-6 py-28 md:py-36 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <span className="text-emerald-500 text-xs font-mono tracking-wider uppercase">
                &#9830; House Rules
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mt-3 tracking-tight">
                Frequently asked
              </h2>
            </Reveal>
          </div>

          <div className="space-y-2">
            {faqList.map((faq, i) => (
              <FAQItem key={faq.question} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto relative">
          {/* Ambient glow */}
          <div className="absolute inset-0 bg-emerald-500/[0.08] blur-[120px] rounded-full pointer-events-none scale-75" />

          <div className="relative text-center rounded-[28px] md:rounded-[36px] bg-gradient-to-b from-emerald-950/50 to-[#0a0a0a]/60 border border-emerald-500/[0.08] p-10 md:p-16 backdrop-blur-xl overflow-hidden">
            {/* Decorative suits */}
            <div className="absolute top-8 left-10 text-6xl text-emerald-500/[0.04] font-heading select-none pointer-events-none">
              &#9824;
            </div>
            <div className="absolute bottom-8 right-10 text-6xl text-emerald-500/[0.04] font-heading select-none pointer-events-none">
              &#9829;
            </div>

            <Reveal>
              <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
                Ready to beat the house?
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-gray-400 text-lg mt-5 mb-12 max-w-md mx-auto font-light">
                Join thousands of players mastering the art of card counting.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton
                  href={APP_STORE_URL}
                  className="bg-emerald-500 text-gray-950 px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.72-3.06 1.61-.68.79-1.26 2.08-1.1 3.23 1.18.09 2.39-.59 3.09-1.73z" />
                  </svg>
                  Download for iOS
                </MagneticButton>

                <div className="relative">
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 bg-amber-500/90 text-[#070707] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
                    Coming Soon
                  </span>
                  <MagneticButton
                    href="#"
                    className="bg-white/[0.05] text-white/40 px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 border border-white/[0.06] cursor-default"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    Android
                  </MagneticButton>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-6 py-14 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <a href="/" className="block h-[60px] w-[200px] relative">
                <Image
                  src="/images/Count Dojo Banner Transparent Background NO BORDERS.png"
                  alt="Count Dojo"
                  fill
                  className="object-contain object-left"
                />
              </a>
              <p className="text-gray-600 text-sm mt-4 max-w-xs leading-relaxed">
                The world&apos;s first gamified card counting education app.
                Master the art of advantage play.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mb-4">
                Links
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="/privacy"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@countdojo.com"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mb-4">
                Social
              </h4>
              <div className="flex items-center gap-3.5">
                <a
                  href="https://www.facebook.com/people/Count-Dojo/61552273026312/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/countdojo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 1.691 4.771 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/TheCountDojo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors"
                  aria-label="X"
                >
                  <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@countdojo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.04] mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-xs">
              &copy; 2026 Count Dojo. All rights reserved.
            </p>
            <p className="text-gray-700/50 text-xs font-mono tracking-widest">
              &#9824; &#9829; &#9830; &#9827;
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
