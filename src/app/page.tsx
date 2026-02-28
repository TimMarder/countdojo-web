"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState( const [isAnim0);
 ating, setIsAnimating] = useState(false);
  
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
    setTimeout(() => setIsAnimating(false), 300);
  };
  
  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((currentSlide - 1 + screenshots.length) % screenshots.length);
    setTimeout(() => setIsAnimating(false), 300);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="px-6 py-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Image 
            src="/images/Count Dojo Banner Transparent Background.png" 
            alt="Count Dojo" 
            width={220}
            height={45}
            className="h-auto"
            priority 
          />
          <div className="flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white text-sm font-medium transition">Features</a>
            <a href="#screenshots" className="text-gray-400 hover:text-white text-sm font-medium transition">Screenshots</a>
            <a href="#faq" className="text-gray-400 hover:text-white text-sm font-medium transition">FAQ</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Train to Beat the Casino
        </h1>
        <p className="text-xl text-gray-400 mb-4 font-light">
          Card counting made simple
        </p>
        <p className="text-base text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed">
          The world&apos;s first gamified card counting education app. Learn to count cards 
          from absolute beginner to casino-ready in 90 days.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#" className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3.5 rounded-xl font-medium text-sm transition flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.14 1.28-2.11 3.34.03 2.22 2.43 3.22 2.4 3.26-.03.05-1.06.77-1.73 1.31l-.02.03zm-3.6 1.42c-.55-.85-.94-2.03-.82-3.2.09-.08.16-.15.23-.22 1.28-.5 2.5-.48 2.5-.48s.18 1.43 1.02 2.87c.75 1.29.16 2.84.16 2.84s-.52 1.03-1.84 1.03h-1.25z"/>
              <path d="M8.54 12.52c-.09-.09-.23-.09-.32 0L5.38 15.4c-.09.09-.09.23 0 .32l2.84 2.84c.09.09.23.09.32 0l.63-.63c.09-.09.09-.23 0-.32l-1.08-1.08 1.08-1.08c.09-.09.09-.23 0-.32l-.63-.63zm5.72-4.63c-.56-.56-1.47-.56-2.03 0l-.63.63c-.09.09-.09.23 0 .32l4.54 4.54c.09.09.23.09.32 0l.63-.63c.09-.09.09-.23 0-.32L14.26 7.89zm1.51 4.54l-2.84 2.84c-.09.09-.23.09-.32 0l-2.84-2.84c-.09-.09-.09-.23 0-.32l.63-.63c.09-.09.23-.09.32 0l2.84 2.84c.09.09.09.23 0 .32l-.63.63z"/>
            </svg>
            Download on App Store
          </a>
          <a href="#" className="bg-gray-800 hover:bg-gray-700 px-8 py-3.5 rounded-xl font-medium text-sm transition flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.609-.814V2.628a1 1 0 01.609-.814zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.634z"/>
            </svg>
            Get it on Google Play
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Everything You Need</h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            The only A to Z platform that teaches card counting from beginner to advanced
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              title="Structured Curriculum"
              description="Progressive lessons from basic strategy to advanced advantage play. No more guessing what to learn next."
            />
            <FeatureCard 
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
              title="Interactive Drills"
              description="Flashcard drills, deck countdown, true count conversion, and betting simulations."
            />
            <FeatureCard 
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.05 5A5 5 0 0119 5m0 0a5 5 0 011.27 9.76l-6.37 6.37a1.5 1.5 0 01-2.12 0l-4.12-4.12a1.5 1.5 0 012.12-2.12l3.37 3.37A5 5 0 0112.95 5H15z" />
                </svg>
              }
              title="Gamification"
              description="Earn XP, level up, maintain streaks, and unlock achievements. Learning should be addictive."
            />
            <FeatureCard 
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="Reference Library"
              description="Strategy charts, deviation indexes, bet spread tables, and calculators at your fingertips."
            />
            <FeatureCard 
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              }
              title="Casino Simulator"
              description="Test your skills in a realistic casino environment before risking real money."
            />
            <FeatureCard 
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
              title="Expert Content"
              description="Learn the math, history, and psychology behind card counting from comprehensive lessons."
            />
          </div>
        </div>
      </section>

      {/* Screenshots Carousel */}
      <section id="screenshots" className="px-6 py-24">
        <div className="max-w-sm mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">See It In Action</h2>
          <p className="text-gray-400 text-center mb-10">
            Beautiful, intuitive design
          </p>
          
          <div className="relative">
            <div className="bg-gray-800 rounded-2xl p-2 overflow-hidden">
              <div className={`transition-transform duration-300 ease-out ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
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
            
            {/* Carousel Controls */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button 
                onClick={prevSlide}
                disabled={isAnimating}
                className="w-11 h-11 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center gap-2">
                {screenshots.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { if (!isAnimating) setCurrentSlide(i); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-emerald-500 w-8' : 'bg-gray-700 w-2 hover:bg-gray-600'}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={nextSlide}
                disabled={isAnimating}
                className="w-11 h-11 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <p className="text-center text-gray-500 text-xs mt-4">
              {currentSlide + 1} of {screenshots.length}
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-24 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Players Say</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Testimonial 
              quote="I went from knowing nothing about card counting to being able to count down a deck in 30 seconds. This app is legit."
              author="Mike R."
            />
            <Testimonial 
              quote="The gamification keeps me coming back every day. I've a 47 day streak now. Better than Duolingo!"
              author="Sarah L."
            />
            <Testimonial 
              quote="Finally, a structured way to learn card counting. No more YouTube videos or books. This is exactly what I needed."
              author="James T."
            />
            <Testimonial 
              quote="Went to Vegas last month and felt confident at the tables for the first time. Worth every penny."
              author="David K."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Questions?</h2>
          
          <FAQItem 
            question="Is card counting legal?"
            answer="Yes! Card counting is completely legal. Casinos may ask you to leave (trespassing), but you can't be arrested for using your brain. However, using devices may violate laws in some jurisdictions."
          />
          
          <FAQItem 
            question="Will this app guarantee I win at blackjack?"
            answer="No gambling system can guarantee wins. Card counting gives you a mathematical edge, but variance means you can still lose in the short term."
          />
          
          <FAQItem 
            question="How long does it take to learn?"
            answer="Most users complete the basic curriculum in 30-60 days with daily practice. Mastery requires ongoing drilling."
          />
          
          <FAQItem 
            question="Do I need to be good at math?"
            answer="Not at all! Hi-Lo counting only requires adding and subtracting 1. The app handles all the complex calculations."
          />
          
          <FAQItem 
            question="What's the difference between free and premium?"
            answer="The free tier includes basic strategy and intro to counting. Premium unlocks true count conversion, bet sizing, deviations, and the casino simulator."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-emerald-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Beat the Casino?</h2>
          <p className="text-emerald-100 mb-8">
            Start your card counting journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="bg-white text-emerald-600 px-8 py-3.5 rounded-xl font-medium text-sm hover:bg-emerald-50 transition">
              Download on App Store
            </a>
            <a href="#" className="bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-medium text-sm hover:bg-emerald-800 transition">
              Get it on Google Play
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Image 
            src="/images/Count Dojo Banner Transparent Background.png" 
            alt="Count Dojo" 
            width={160}
            height={32}
            className="h-auto"
          />
          <div className="flex gap-6 text-gray-500 text-xs">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="mailto:support@countdojo.com" className="hover:text-white transition">Contact</a>
          </div>
          <p className="text-gray-600 text-xs">© 2026 Count Dojo</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/60 transition duration-300">
      <div className="text-emerald-400 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/50">
      <p className="text-gray-300 mb-4 leading-relaxed">"{quote}"</p>
      <p className="text-emerald-400 font-medium text-sm">— {author}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-gray-800 py-5">
      <h3 className="font-medium mb-2">{question}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{answer}</p>
    </div>
  );
}
