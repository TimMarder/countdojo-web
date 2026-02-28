"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const screenshots = [
    { src: "/images/IMG_6359.jpg", alt: "Skill Tree" },
    { src: "/images/IMG_6360.jpg", alt: "Practice" },
    { src: "/images/IMG_6361.jpg", alt: "Profile" },
    { src: "/images/IMG_6362.jpg", alt: "Reference" },
  ];
  
  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((currentSlide + 1) % screenshots.length);
    setTimeout(() => setIsAnimating(false), 400);
  };
  
  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((currentSlide - 1 + screenshots.length) % screenshots.length);
    setTimeout(() => setIsAnimating(false), 400);
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-emerald-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Image 
            src="/images/Count Dojo Banner Transparent Background.png" 
            alt="Count Dojo" 
            width={180}
            height={36}
            className="h-auto w-32 sm:w-44"
            priority 
          />
          
          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200">Features</a>
            <a href="#screenshots" className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200">Screenshots</a>
            <a href="#faq" className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200">FAQ</a>
          </div>
          
          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
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
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-800/50 bg-gray-950/95 backdrop-blur-md">
            <div className="px-4 py-3 space-y-2">
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-gray-400 hover:text-white text-sm font-medium rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                Features
              </a>
              <a 
                href="#screenshots" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-gray-400 hover:text-white text-sm font-medium rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                Screenshots
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-gray-400 hover:text-white text-sm font-medium rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                FAQ
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Now available for iOS and Android
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-5 tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
          Train to Beat the Casino
        </h1>
        <p className="text-xl text-gray-400 mb-6 font-light">
          Card counting made simple
        </p>
        <p className="text-base text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">
          The world&apos;s first gamified card counting education app. Master the art of advantage play from absolute beginner to casino-ready.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#" className="group bg-emerald-500 hover:bg-emerald-400 px-7 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.72-3.06 1.61-.68.79-1.26 2.08-1.1 3.23 1.18.09 2.39-.59 3.09-1.73z"/>
            </svg>
            Download on App Store
          </a>
          <a href="#" className="group bg-gray-800 hover:bg-gray-700 px-7 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-800/25 hover:-translate-y-0.5 flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
            </svg>
            Get it on Google Play
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3">Everything You Need</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              The only A to Z platform that teaches card counting from beginner to advanced
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
              title="Structured Curriculum"
              description="Progressive lessons from basic strategy to advanced advantage play."
            />
            <FeatureCard 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
              title="Interactive Drills"
              description="Flashcard drills, deck countdown, true count, and betting simulations."
            />
            <FeatureCard 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              title="Gamification"
              description="Earn XP, level up, maintain streaks, and unlock achievements."
            />
            <FeatureCard 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              title="Reference Library"
              description="Strategy charts, deviation indexes, and calculators at your fingertips."
            />
            <FeatureCard 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
              title="Casino Simulator"
              description="Test your skills in a realistic casino environment."
            />
            <FeatureCard 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
              title="Expert Content"
              description="Learn the math, history, and psychology behind card counting."
            />
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section id="screenshots" className="px-6 py-24">
        <div className="max-w-xs mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">See It In Action</h2>
          <p className="text-gray-500 text-center mb-10">Beautiful, intuitive design</p>
          
          <div className="relative">
            <div className="bg-gray-900 rounded-2xl p-1.5 overflow-hidden shadow-2xl shadow-black/50">
              <div className={`transition-all duration-400 ease-out ${isAnimating ? 'scale-95 opacity-40 translate-x-2' : 'scale-100 opacity-100'}`}>
                <Image 
                  src={screenshots[currentSlide].src}
                  alt={screenshots[currentSlide].alt}
                  width={320}
                  height={650}
                  className="rounded-xl w-full h-auto"
                  priority
                />
              </div>
            </div>
            
            <div className="flex justify-center items-center gap-4 mt-6">
              <button onClick={prevSlide} disabled={isAnimating} className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-200 disabled:opacity-40 hover:scale-110">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <div className="flex items-center gap-2">
                {screenshots.map((_, i) => (
                  <button key={i} onClick={() => { if (!isAnimating) setCurrentSlide(i); }} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-emerald-500 w-8' : 'bg-gray-700 w-2 hover:bg-gray-600'}`} />
                ))}
              </div>
              
              <button onClick={nextSlide} disabled={isAnimating} className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-200 disabled:opacity-40 hover:scale-110">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            
            <p className="text-center text-gray-600 text-xs mt-4">{currentSlide + 1} of {screenshots.length}</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-24 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Players Say</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Testimonial quote="I went from knowing nothing about card counting to being able to count down a deck in 30 seconds. This app is legit." author="Mike R." />
            <Testimonial quote="The gamification keeps me coming back every day. I've a 47 day streak now. Better than Duolingo!" author="Sarah L." />
            <Testimonial quote="Finally, a structured way to learn card counting. No more YouTube videos or books." author="James T." />
            <Testimonial quote="Went to Vegas last month and felt confident at the tables for the first time." author="David K." />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-24">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Questions?</h2>
          
          <FAQItem question="Is card counting legal?" answer="Yes! Card counting is completely legal. Casinos may ask you to leave (trespassing), but you can't be arrested for using your brain." />
          <FAQItem question="Will this app guarantee I win?" answer="No gambling system can guarantee wins. Card counting gives you a mathematical edge, but variance means you can still lose in the short term." />
          <FAQItem question="How long does it take to learn?" answer="Most users complete the basic curriculum in 30-60 days with daily practice." />
          <FAQItem question="Do I need to be good at math?" answer="Not at all! Hi-Lo counting only requires adding and subtracting 1." />
          <FAQItem question="Free vs Premium?" answer="Free: basics + intro to counting. Premium: true count, betting, deviations, simulator." />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Beat the Casino?</h2>
          <p className="text-emerald-100 mb-8">Start your card counting journey today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="bg-white text-emerald-600 px-8 py-3.5 rounded-xl font-medium text-sm hover:bg-emerald-50 transition-all hover:shadow-lg hover:-translate-y-0.5">Download on App Store</a>
            <a href="#" className="bg-emerald-800 text-white px-8 py-3.5 rounded-xl font-medium text-sm hover:bg-emerald-900 transition-all hover:shadow-lg hover:-translate-y-0.5">Get it on Google Play</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-950 border-t border-gray-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Image src="/images/Count Dojo Banner Transparent Background.png" alt="Count Dojo" width={140} height={28} className="h-auto" />
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-white transition-colors duration-200">Privacy</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Terms</a>
            <a href="mailto:support@countdojo.com" className="hover:text-white transition-colors duration-200">Contact</a>
          </div>
          <p className="text-gray-600 text-sm">© 2026 Count Dojo</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group bg-gray-900/60 rounded-2xl p-5 border border-gray-800 hover:border-emerald-500/30 hover:bg-gray-800/50 transition-all duration-300 hover:-translate-y-1">
      <div className="text-emerald-500 mb-3 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-base font-semibold mb-2 text-gray-100">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="bg-gray-900/60 rounded-2xl p-5 border border-gray-800">
      <p className="text-gray-300 mb-4 leading-relaxed">"{quote}"</p>
      <p className="text-emerald-500 font-medium text-sm">— {author}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-gray-800 py-5">
      <h3 className="font-medium text-gray-200 mb-2">{question}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{answer}</p>
    </div>
  );
}
