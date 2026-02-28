"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
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
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Image 
            src="/images/Count Dojo Banner Transparent Background.png" 
            alt="Count Dojo" 
            width={180}
            height={36}
            className="h-auto"
            priority 
          />
          <div className="flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200">Features</a>
            <a href="#screenshots" className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200">Screenshots</a>
            <a href="#faq" className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200">FAQ</a>
          </div>
        </div>
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
            <svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7-63.6 0-87.3 52.7-98.3 90.4-14.3 47.2-14.3 90.4 0 23.9-8.8 50.6-23.7 69.5-14 17-44.3 31.7-70.7 42.6-25.1 12.2-51.2 19.4-69.2 19.4-34.5-3.3-61.7-8-84.7-19.8-1.8-15.8 5.5-28.1 12.9-38.3 16.9-24.4 34.6-24.4 71.6 0 44.1 20.2 81.7 21.1 44.5 1.6 34-9.9 56.1-18.8 81.6 0 23.9 8.8 44.6 24.6 66.1 16.6 24.6-14.3 54.7-17.6 74-20.3 14.6-22.8 37.2-25.4 60-22.8 24.9-4.8 45.6-14.3 62.4-14.3 15.8 0 28.5 7.1 40.2 16.4 11.1 8.5 20.2 14.9 27.3 14.9 24.3-3.5 46.2-14.1 61.3-14.1 15.3 0 28.5 7.6 40.2 18.2 10.9 9.4 19.3 14.5 26.1 14.5 24.3-3.4 46.2-14 61.3-14 15.3 0 28.5 7.6 40.2 18.2 10.9 9.4 19.3 14.5 26.1 14.5 24.3-3.4 46.2-14.1 61.3-14.1 15.3 0 28.5 7.6 40.2 18.2 10.9 9.4 19.3 14.5 26.1 14.5 24.3-3.4 46.2-14.1 61.3-14.1 15.3 0 28.5 7.6 40.2 18.2 10.9 9.4 19.3 14.5 26.1 14.5 24.3-3.4 46.2-14.1 61.3-14.1z"/>
            </svg>
            Download on App Store
          </a>
          <a href="#" className="group bg-gray-800 hover:bg-gray-700 px-7 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-800/25 hover:-translate-y-0.5 flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 512 512" fill="currentColor">
              <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7-64.5-60.1-34.1L471.2 194.3c-4.1-23.2-23.2-38.7-46.9-38.7H337.8c-23.6 0-43.4 15.8-46.8 38.7l-65.8 64.6-59.8-34.3c-4.1-23.2-23.2-38.7-46.9-38.7H151.4c-23.6 0-43.4 15.8-46.8 38.7L33.8 388.5c-4.1 23.2 4.1 48.3 22.8 62.3l254.6 147.6c20.3 11.7 45.5 8.1 59.8-7.5l48.2-41.8 48.2 41.8c14.3 15.6 39.5 19.1 59.8 7.5l254.6-147.6c18.7-14 22.8-39.1 22.8-62.3V269.9c0-23.2-15.8-43.4-39.5-46.9z"/>
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
