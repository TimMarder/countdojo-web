"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const screenshots = [
    { src: "/images/IMG_6359.jpg", alt: "Skill Tree" },
    { src: "/images/IMG_6360.jpg", alt: "Practice" },
    { src: "/images/IMG_6361.jpg", alt: "Profile" },
    { src: "/images/IMG_6362.jpg", alt: "Reference" },
  ];
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="px-6 py-6">
        <div className="flex justify-center">
          <Image src="/images/Count Dojo Banner Transparent Background.png" alt="Count Dojo" width={260} height={50} className="h-auto" priority />
        </div>
      </nav>

      <section className="px-6 py-20 text-center max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">Train to Beat the Casino</h1>
        <p className="text-xl text-gray-400 mb-6">Card counting made simple</p>
        <p className="text-gray-300 mb-8">The world&apos;s first gamified card counting education app. Learn from beginner to casino-ready.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#" className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-lg font-medium">App Store</a>
          <a href="#" className="bg-gray-800 hover:bg-gray-700 px-8 py-3 rounded-lg font-medium">Google Play</a>
        </div>
      </section>

      <section className="px-6 py-16 bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Everything You Need</h2>
          <p className="text-gray-400 text-center mb-12">The only A to Z platform teaching card counting</p>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard icon="📚" title="Curriculum" desc="Progressive lessons from basics to advanced" />
            <FeatureCard icon="🏋️" title="Drills" desc="Flashcards, deck countdown, true count" />
            <FeatureCard icon="🎮" title="Gamification" desc="XP, levels, streaks, achievements" />
            <FeatureCard icon="📖" title="Reference" desc="Strategy charts, calculators" />
            <FeatureCard icon="🎰" title="Simulator" desc="Realistic casino environment" />
            <FeatureCard icon="🎓" title="Content" desc="Math, history, psychology" />
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-xs mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">See It In Action</h2>
          <p className="text-gray-400 text-center mb-8">Beautiful, intuitive design</p>
          <div className="bg-gray-800 rounded-2xl p-2 overflow-hidden">
            <Image src={screenshots[currentSlide].src} alt={screenshots[currentSlide].alt} width={320} height={600} className="rounded-xl w-full" />
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={() => setCurrentSlide((currentSlide - 1 + 4) % 4)} className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700">←</button>
            <div className="flex items-center gap-2">
              {screenshots.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)} className={`w-2 h-2 rounded-full ${i === currentSlide ? 'bg-emerald-500 w-6' : 'bg-gray-700'}`} />
              ))}
            </div>
            <button onClick={() => setCurrentSlide((currentSlide + 1) % 4)} className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700">→</button>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-gray-800/50">
        <h2 className="text-2xl font-bold text-center mb-8">What Players Say</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <Testimonial quote="Went from knowing nothing to counting a deck in 30 seconds. This app is legit." author="Mike R." />
          <Testimonial quote="47 day streak and counting. Better than Duolingo!" author="Sarah L." />
        </div>
      </section>

      <section className="px-6 py-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Questions</h2>
        <FAQ q="Is card counting legal?" a="Yes. Casinos may ask you to leave, but you cannot be arrested for using your brain." />
        <FAQ q="Will I guarantee wins?" a="No system guarantees wins. Card counting gives a mathematical edge; variance still applies." />
        <FAQ q="Do I need to be good at math?" a="Not at all. Hi-Lo only requires adding/subtracting 1." />
        <FAQ q="Free vs Premium?" a="Free: basics + intro to counting. Premium: true count, betting, deviations, simulator." />
      </section>

      <section className="px-6 py-16 bg-emerald-600 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Beat the Casino?</h2>
        <p className="text-emerald-100 mb-8">Start your journey today.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#" className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-medium">App Store</a>
          <a href="#" className="bg-emerald-700 px-8 py-3 rounded-lg font-medium">Google Play</a>
        </div>
      </section>

      <footer className="px-6 py-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Image src="/images/Count Dojo Banner Transparent Background.png" alt="Count Dojo" width={180} height={35} className="h-auto" />
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="mailto:support@countdojo.com" className="hover:text-white">Contact</a>
          </div>
          <p className="text-gray-600 text-sm">© 2026 Count Dojo</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
      <p className="text-gray-300 mb-3">"{quote}"</p>
      <p className="text-emerald-400 text-sm font-medium">— {author}</p>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-b border-gray-800 py-4">
      <h3 className="font-medium mb-1">{q}</h3>
      <p className="text-gray-500 text-sm">{a}</p>
    </div>
  );
}
