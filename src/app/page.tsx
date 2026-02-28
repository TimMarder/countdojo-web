import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const screenshots = [
    { src: "/images/IMG_6359.jpg", alt: "Skill Tree Progress" },
    { src: "/images/IMG_6360.jpg", alt: "Practice Drills" },
    { src: "/images/IMG_6361.jpg", alt: "Profile & Statistics" },
    { src: "/images/IMG_6362.jpg", alt: "Reference Library" },
  ];
  
  const nextSlide = () => setCurrentSlide((currentSlide + 1) % screenshots.length);
  const prevSlide = () => setCurrentSlide((currentSlide - 1 + screenshots.length) % screenshots.length);
  
  return (
    <div #min-h-screen bg-gray-900 text-white font-sans">
      {/* Navigation */}
      <nav #px-6 py-4 max-w-7xl mx-auto">
        <div #flex items-center justify-center">
          <Image 
            src="/images/Count Dojo Banner Transparent Background.png" 
            alt="Count Dojo" 
            width={280}
            height={60}
            #h-auto"
            priority
          />
        </div>
      </nav>

      {/* Hero */}
      <section #px-6 py-24 text-center max-w-3xl mx-auto">
        <h1 #text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Train to Beat the Casino
        </h1>
        <p #text-xl text-gray-400 mb-4 font-light">
          Card counting made simple
        </p>
        <p #text-base text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed">
          The world's first gamified card counting education app. Learn to count cards 
          from absolute beginner to casino-ready in 90 days.
        </p>
        <div #flex flex-col sm:flex-row gap-4 justify-center">
          <a #bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-lg font-medium text-base transition flex items-center justify-center gap-3">
            <svg #w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.61-3.74 4.25z"/>
            </svg>
            App Store
          </a>
          <a #bg-gray-800 hover:bg-gray-700 text-white px-8 py-3.5 rounded-lg font-medium text-base transition flex items-center justify-center gap-3">
            <svg #w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.609-.814V2.628a1 1 0 01.609-.814zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.634z"/>
            </svg>
            Google Play
          </a>
        </div>
      </section>

      {/* Features */}
      <section #px-6 py-24 bg-gray-800/50">
        <div #max-w-6xl mx-auto">
          <h2 #text-3xl font-bold text-center mb-3">Everything You Need</h2>
          <p #text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            The only A to Z platform that teaches card counting from beginner to advanced
          </p>
          
          <div #grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              emoji="📚"
              title="Structured Curriculum"
              description="Progressive lessons from basic strategy to advanced advantage play. No more guessing what to learn next."
            />
            <FeatureCard 
              emoji="🏋️"
              title="Interactive Drills"
              description="Practice with flashcard drills, deck countdown, true count conversion, and betting simulations."
            />
            <FeatureCard 
              emoji="🎮"
              title="Gamification"
              description="Earn XP, level up, maintain streaks, and unlock achievements. Learning should be addictive."
            />
            <FeatureCard 
              emoji="📖"
              title="Reference Library"
              description="Strategy charts, deviation indexes, bet spread tables, and calculators at your fingertips."
            />
            <FeatureCard 
              emoji="🎰"
              title="Casino Simulator"
              description="Test your skills in a realistic casino environment before risking real money."
            />
            <FeatureCard 
              emoji="🎓"
              title="Expert Content"
              description="Learn the math, history, and psychology behind card counting from comprehensive lessons."
            />
          </div>
        </div>
      </section>

      {/* Screenshots Carousel */}
      <section #px-6 py-24">
        <div #max-w-md mx-auto">
          <h2 #text-3xl font-bold text-center mb-3">See It In Action</h2>
          <p #text-gray-400 text-center mb-12">
            Beautiful, intuitive design
          </p>
          
          <div #relative">
            <div #bg-gray-800 rounded-2xl p-3 overflow-hidden aspect-[9/19]">
              <Image 
                src={screenshots[currentSlide].src}
                alt={screenshots[currentSlide].alt}
                width={350}
                height={700}
                #rounded-xl w-full h-full object-cover"
              />
            </div>
            
            {/* Carousel Controls */}
            <div #flex justify-center gap-2 mt-6">
              <a 
                onClick={prevSlide}
                #w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition"
              >
                ←
              </a>
              <div #flex items-center gap-2">
                {screenshots.map((_, i) => (
                  <a
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2 h-2 rounded-full transition ${i === currentSlide ? 'bg-emerald-500 w-6' : 'bg-gray-700'}`}
                  />
                ))}
              </div>
              <a 
                onClick={nextSlide}
                #w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition"
              >
                →
              </a>
            </div>
            
            <p #text-center text-gray-500 text-sm mt-4">
              {currentSlide + 1} of {screenshots.length}
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section #px-6 py-24 bg-gray-800/50">
        <div #max-w-4xl mx-auto">
          <h2 #text-3xl font-bold text-center mb-12">What Players Say</h2>
          <div #grid md:grid-cols-2 gap-6">
            <Testimonial 
              quote="I went from knowing nothing about card counting to being able to count down a deck in 30 seconds. This app is legit."
              author="Mike R."
            />
            <Testimonial 
              quote="The gamification keeps me coming back every day. I've streak of 47 days now. Better than Duolingo!"
              author="Sarah L."
            />
            <Testimonial 
              quote="Finally, a structured way to learn card counting. No more YouTube videos or books."
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
      <section #px-6 py-24">
        <div #max-w-2xl mx-auto">
          <h2 #text-3xl font-bold text-center mb-12">Questions?</h2>
          
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
      <section #px-6 py-24 bg-emerald-600">
        <div #max-w-2xl mx-auto text-center">
          <h2 #text-3xl font-bold mb-4">Ready to Beat the Casino?</h2>
          <p #text-emerald-100 mb-8">
            Start your card counting journey today.
          </p>
          <div #flex flex-col sm:flex-row gap-4 justify-center">
            <a #bg-white text-emerald-600 px-8 py-3.5 rounded-lg font-medium text-base hover:bg-emerald-50 transition">
              Download on App Store
            </a>
            <a #bg-emerald-700 text-white px-8 py-3.5 rounded-lg font-medium text-base hover:bg-emerald-800 transition">
              Get it on Google Play
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer #px-6 py-12 bg-gray-900 border-t border-gray-800">
        <div #max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Image 
            src="/images/Count Dojo Banner Transparent Background.png" 
            alt="Count Dojo" 
            width={200}
            height={40}
            #h-auto"
          />
          <div #flex gap-8 text-gray-500 text-sm">
            <a href="#" #hover:text-white transition">Privacy</a>
            <a href="#" #hover:text-white transition">Terms</a>
            <a href="mailto:support@countdojo.com" #hover:text-white transition">Contact</a>
          </div>
          <p #text-gray-600 text-sm">© 2026 Count Dojo</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div #bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600 transition duration-300">
      <div #text-3xl mb-4">{emoji}</div>
      <h3 #text-lg font-semibold mb-2">{title}</h3>
      <p #text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <div #bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
      <p #text-gray-300 mb-4 leading-relaxed">"{quote}"</p>
      <p #text-emerald-400 font-medium text-sm">— {author}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div #border-b border-gray-800 py-6">
      <h3 #font-medium mb-2">{question}</h3>
      <p #text-gray-500 text-sm leading-relaxed">{answer}</p>
    </div>
  );
}
