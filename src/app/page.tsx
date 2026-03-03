"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
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

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Screenshots", href: "#screenshots" },
  { label: "FAQ", href: "#faq" },
];

const featureList: Feature[] = [
  {
    title: "Structured Curriculum",
    description: "Progressive lessons from basic strategy to advanced advantage play.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    title: "Interactive Drills",
    description: "Flashcard drills, deck countdown, true count, and betting simulations.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    title: "Gamification",
    description: "Earn XP, level up, maintain streaks, and unlock achievements.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Reference Library",
    description: "Strategy charts, deviation indexes, and calculators at your fingertips.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Casino Simulator",
    description: "Test your skills in a realistic casino environment.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
  },
  {
    title: "Expert Content",
    description: "Learn the math, history, and psychology behind card counting.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
];

const testimonialList: Testimonial[] = [
  {
    quote:
      "I went from knowing nothing about card counting to being able to count down a deck in 30 seconds. This app is legit.",
    author: "Mike R.",
    detail: "CFA, recreational player",
  },
  {
    quote: "The gamification keeps me coming back every day. I\u2019ve a 47 day streak now. Better than Duolingo!",
    author: "Sarah L.",
    detail: "Former casino dealer",
  },
  {
    quote: "Finally, a structured way to learn card counting. No more YouTube videos or books.",
    author: "James T.",
    detail: "Tech founder",
  },
  {
    quote: "Went to Vegas last month and felt confident at the tables for the first time.",
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
    answer: "Most users complete the basic curriculum in 30-60 days with daily practice.",
  },
  {
    question: "Do I need to be good at math?",
    answer: "Not at all! Hi-Lo counting only requires adding and subtracting 1.",
  },
  {
    question: "Free vs Premium?",
    answer: "Free: basics + intro to counting. Premium: true count, betting, deviations, simulator.",
  },
];

const screenshots = [
  { src: "/images/IMG_6359.jpg", alt: "Skill Tree" },
  { src: "/images/IMG_6360.jpg", alt: "Practice" },
  { src: "/images/IMG_6361.jpg", alt: "Profile" },
  { src: "/images/IMG_6362.jpg", alt: "Reference" },
];

// ===== COMPONENTS =====

// Page Loader Component
function PageLoader({ onLoaded }: { onLoaded: () => void }) {
  const [showCurtain, setShowCurtain] = useState(true);
  const [curtainExiting, setCurtainExiting] = useState(false);

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setCurtainExiting(true);
      setTimeout(() => {
        setShowCurtain(false);
        onLoaded();
      }, 800);
    }, 1500);

    return () => clearTimeout(loadTimer);
  }, [onLoaded]);

  if (!showCurtain) return null;

  return (
    <div className={`page-loader ${curtainExiting ? 'curtain-exit' : ''}`}>
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

// Scroll Progress Component
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className="scroll-progress" 
      style={{ width: `${progress}%` }}
    />
  );
}

// Background Particles Component
function BackgroundParticles() {
  const reduceMotion = usePrefersReducedMotion();
  const particles = useMemo(() => {
    if (reduceMotion) return [];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            background: p.id % 3 === 0 
              ? 'rgba(16, 185, 129, 0.4)' 
              : p.id % 3 === 1 
                ? 'rgba(52, 211, 153, 0.3)' 
                : 'rgba(255, 255, 255, 0.2)',
          }}
        />
      ))}
    </div>
  );
}

// Text Scramble Effect
function ScrambleText({ 
  text, 
  className = "",
  duration = 2000,
  charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
}: { 
  text: string; 
  className?: string;
  duration?: number;
  charset?: string;
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || isScrambling) return;
    
    setIsScrambling(true);
    const startTime = Date.now();
    const originalText = text;
    const textLength = originalText.length;

    const scramble = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother reveal
      const eased = 1 - Math.pow(1 - progress, 3);
      
      let result = "";
      const revealIndex = Math.floor(eased * textLength);
      
      for (let i = 0; i < textLength; i++) {
        if (i < revealIndex) {
          result += originalText[i];
        } else {
          // Random character from charset
          result += charset[Math.floor(Math.random() * charset.length)];
        }
      }
      
      setDisplayText(result);
      
      if (progress < 1) {
        requestAnimationFrame(scramble);
      } else {
        setDisplayText(originalText);
        setIsScrambling(false);
      }
    };

    requestAnimationFrame(scramble);
  }, [isVisible, text, duration, charset, isScrambling]);

  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  );
}

// Magnetic Button Component
function MagneticButton({ 
  children, 
  className = "",
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string;
  [key: string]: any;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Magnetic pull strength
      const strength = 0.3;
      button.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };

    const handleMouseLeave = () => {
      button.style.transform = "translate(0px, 0px)";
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`magnetic-button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Main Page Component
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorActive, setCursorActive] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [carouselDirection, setCarouselDirection] = useState<'left' | 'right' | null>(null);

  const reduceMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastScroll = useRef(0);

  useEffect(() => {
    if (reduceMotion) {
      videoRef.current?.pause();
      return;
    }

    const play = () => videoRef.current?.play().catch(() => undefined);
    play();
  }, [reduceMotion]);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrollY(current);

      if (Math.abs(current - lastScroll.current) > 6) {
        const shouldHide = current > lastScroll.current && current > 120;
        setNavHidden(shouldHide);
      }

      lastScroll.current = current;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      setCursorPos({ x: event.clientX, y: event.clientY });
      setCursorActive(true);
    };

    const handleLeave = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        setCursorActive(false);
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseout", handleLeave, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseout", handleLeave);
    };
  }, []);

  useEffect(() => {
    if (!pageLoaded) return;
    const id = setInterval(() => {
      setCarouselDirection('right');
      setCurrentSlide((prev) => (prev + 1) % screenshots.length);
    }, 6000);
    return () => clearInterval(id);
  }, [pageLoaded]);

  const nextSlide = () => {
    if (isAnimating) return;
    setCarouselDirection('right');
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % screenshots.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setCarouselDirection('left');
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const heroParallax = useMemo(() => (reduceMotion ? 0 : Math.min(scrollY * 0.12, 120)), [scrollY, reduceMotion]);
  const accentDrift = useMemo(() => (reduceMotion ? 0 : scrollY * 0.04), [scrollY, reduceMotion]);

  const handlePageLoad = useCallback(() => {
    setPageLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-emerald-500 selection:text-white overflow-hidden">
      {/* Page Loader */}
      <PageLoader onLoaded={handlePageLoad} />
      
      {/* Scroll Progress */}
      <ScrollProgress />
      
      {/* Background Particles */}
      <BackgroundParticles />

      {/* Sticky Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          navHidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrollY > 24
            ? "bg-gray-950/85 border-b border-white/5 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Image
            src="/images/Count Dojo Banner Transparent Background.png"
            alt="Count Dojo"
            width={200}
            height={40}
            className="h-auto w-64 sm:w-80"
            priority
          />

          <div className="hidden sm:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-400 hover:text-white text-sm font-medium transition-all duration-200 relative after:absolute after:left-1/2 after:-bottom-1 after:h-px after:w-0 after:bg-emerald-400 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="sm:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-white/5 bg-gray-950/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-gray-300 hover:text-white text-sm font-medium rounded-xl hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section className="relative pt-28 pb-32 px-6 sm:px-10 lg:px-12 overflow-hidden" id="top">
        <div className="absolute inset-0 rounded-[48px] sm:rounded-[64px] bg-gray-900/70 border border-white/5 mx-3 sm:mx-6" />
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover scale-105"
            autoPlay={!reduceMotion}
            muted
            loop
            playsInline
            poster="/images/IMG_6360.jpg"
          >
            <source src="/videos/blackjack-hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-gray-950/80 to-gray-950" />
        </div>

        <div
          className="absolute -top-32 sm:-top-40 left-1/2 -translate-x-1/2 w-[640px] h-[640px] bg-emerald-500/20 blur-[160px] rounded-full pointer-events-none"
          style={{ transform: `translateY(${heroParallax * -0.5}px)` }}
        />

        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1fr,0.9fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-6 backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Now available for iOS and Android
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-5 tracking-tight text-balance">
              <span className="bg-gradient-to-r from-white via-emerald-100 to-gray-400 bg-clip-text text-transparent animate-gradient">Train to Beat the Casino</span>
            </h1>
            <p className="text-xl text-gray-300 mb-5 font-light">Card counting made simple</p>
            <p className="text-base text-gray-400 mb-10 max-w-lg leading-relaxed">
              The world&apos;s first gamified card counting education app. Master the art of advantage play from absolute beginner to casino-ready.
            </p>
            
            {/* Magnetic Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <MagneticButton
                href="#"
                className="group relative overflow-hidden bg-emerald-500 text-gray-950 px-7 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/30"
              >
                <span className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.72-3.06 1.61-.68.79-1.26 2.08-1.1 3.23 1.18.09 2.39-.59 3.09-1.73z" />
                </svg>
                Download on App Store
              </MagneticButton>
              <MagneticButton
                href="#"
                className="group relative overflow-hidden bg-gray-900 text-white px-7 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-3 border border-white/10"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500" />
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                Get it on Google Play
              </MagneticButton>
            </div>

          </div>

        </div>

        <a
          href="#features"
          className="hidden md:flex flex-col items-center gap-2 absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
          <span className="h-12 w-px bg-gradient-to-b from-transparent via-gray-500 to-white animate-float" />
        </a>
      </section>

      {/* Features Section with Glass Morphism */}
      <section id="features" className="relative px-6 py-24 bg-gray-950">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm uppercase tracking-[0.4em] text-emerald-400 mb-3">Curriculum</p>
              <h2 className="text-3xl font-bold mb-3">
                <ScrambleText text="Everything You Need" />
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                The only A to Z platform that teaches card counting from beginner to advanced.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureList.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section id="screenshots" className="relative px-6 py-24">
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-[0.4em] text-emerald-400 mb-3">Product tour</p>
              <h2 className="text-3xl font-bold">
                <ScrambleText text="See It In Action" />
              </h2>
              <p className="text-gray-500">Beautiful, intuitive design</p>
            </div>
          </Reveal>

          <div className="relative max-w-md mx-auto">
            <div className="absolute -inset-8 bg-gradient-to-r from-emerald-500/20 to-transparent blur-3xl" style={{ transform: `translateY(${accentDrift * 0.5}px)` }} />
            <Reveal>
              <div className="glass-card relative rounded-[32px] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.7)]">
                <div className={`transition-all duration-500 ease-out ${isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"}`}>
                  {/* Screenshot with Zoom */}
                  <div className="screenshot-zoom-container rounded-[26px] overflow-hidden">
                    <Image
                      src={screenshots[currentSlide].src}
                      alt={screenshots[currentSlide].alt}
                      width={360}
                      height={720}
                      className="rounded-[26px] w-full h-auto"
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={prevSlide}
                    disabled={isAnimating}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:-translate-x-1 disabled:opacity-40"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-1">
                    {screenshots.map((_, i) => (
                      <span key={`s-${i}`} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-emerald-400 w-8" : "bg-white/15 w-2"}`} />
                    ))}
                  </div>
                  <button
                    onClick={nextSlide}
                    disabled={isAnimating}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:translate-x-1 disabled:opacity-40"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <p className="text-center text-gray-500 text-xs mt-4">
                  {currentSlide + 1} of {screenshots.length}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-24 bg-gray-950/70 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.2),_transparent_55%)] opacity-60" />
        <div className="max-w-5xl mx-auto relative">
          <Reveal>
            <h2 className="text-3xl font-bold text-center mb-12">What Players Say</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {testimonialList.map((testimonial, index) => (
              <TestimonialCard key={testimonial.author} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="px-6 py-24 relative">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-500/10 to-transparent" />
        <div className="max-w-2xl mx-auto relative">
          <Reveal>
            <h2 className="text-3xl font-bold text-center mb-12">Questions?</h2>
          </Reveal>
          <div className="divide-y divide-white/5 border border-white/5 rounded-2xl overflow-hidden bg-gray-950/40">
            {faqList.map((faq, index) => (
              <FAQItem key={faq.question} faq={faq} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 rounded-[40px] p-10 shadow-[0_30px_100px_rgba(16,185,129,0.35)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_55%)]" />
          <div className="relative">
            <Reveal>
              <h2 className="text-3xl font-bold mb-4">Ready to Beat the Casino?</h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-emerald-50 mb-8">Start your card counting journey today.</p>
            </Reveal>
            <Reveal delay={120}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton
                  href="#"
                  className="bg-white text-emerald-600 px-8 py-3.5 rounded-2xl font-medium text-sm hover:bg-emerald-50 transition-all hover:-translate-y-0.5 shadow-lg"
                >
                  Download on App Store
                </MagneticButton>
                <MagneticButton
                  href="#"
                  className="bg-emerald-800/70 text-white px-8 py-3.5 rounded-2xl font-medium text-sm hover:bg-emerald-900/80 transition-all hover:-translate-y-0.5 border border-white/20"
                >
                  Get it on Google Play
                </MagneticButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-950 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Image
            src="/images/Count Dojo Banner Transparent Background.png"
            alt="Count Dojo"
            width={140}
            height={28}
            className="h-auto"
          />
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-white transition-colors duration-200">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200">
              Terms
            </a>
            <a href="mailto:support@countdojo.com" className="hover:text-white transition-colors duration-200">
              Contact
            </a>
          </div>
          <p className="text-gray-600 text-sm">© 2026 Count Dojo</p>
        </div>
      </footer>

      {/* Custom Cursor */}
      <div
        className={`pointer-events-none fixed top-0 left-0 z-[80] hidden md:block transition-opacity duration-300 ${cursorActive ? "opacity-100" : "opacity-0"}`}
        style={{ transform: `translate3d(${cursorPos.x - 32}px, ${cursorPos.y - 32}px, 0)` }}
      >
        <div className="w-16 h-16 rounded-full border border-emerald-400/30 bg-emerald-400/5 backdrop-blur-md animate-pulse-soft" />
      </div>
    </div>
  );
}

// Feature Card with Glass Morphism
function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <Reveal delay={index * 70}>
      <div className="glass-card glass-card-hover rounded-2xl p-5 overflow-hidden group">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-emerald-500/10 to-transparent" />
        <div className="relative">
          <div className="text-emerald-400 mb-3 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
          <h3 className="text-base font-semibold mb-2 text-gray-100">{feature.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
        </div>
      </div>
    </Reveal>
  );
}

// Testimonial Card with Glass Morphism
function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return (
    <Reveal delay={index * 80}>
      <div className="glass-card group rounded-2xl p-5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <p className="text-gray-300 mb-4 leading-relaxed min-h-[96px]">&ldquo;{testimonial.quote}&rdquo;</p>
        <p className="text-emerald-400 font-medium text-sm">— {testimonial.author}</p>
        {testimonial.detail && <p className="text-gray-500 text-xs mt-1">{testimonial.detail}</p>}
      </div>
    </Reveal>
  );
}

// FAQ Item Component
function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <Reveal delay={index * 60}>
      <div>
        <button
          className="w-full flex items-center justify-between px-5 py-4 text-left"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          <span className="font-medium text-gray-100">{faq.question}</span>
          <span className={`text-emerald-400 transition-transform duration-300 ${open ? "rotate-45" : "rotate-0"}`}>+</span>
        </button>
        <div className={`px-5 pb-4 text-sm text-gray-500 leading-relaxed transition-[max-height,opacity] duration-500 overflow-hidden ${open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
          {faq.answer}
        </div>
      </div>
    </Reveal>
  );
}

// Reveal Animation Component
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform-gpu ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      {children}
    </div>
  );
}

// Reduced Motion Hook
function usePrefersReducedMotion() {
  const subscribe = useCallback((callback: () => void) => {
    if (typeof window === "undefined") {
      return () => undefined;
    }
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => callback();
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
