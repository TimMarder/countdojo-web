import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Image 
            src="/images/Count Dojo Transparent Logo.png" 
            alt="Count Dojo" 
            width={40} 
            height={40}
            className="rounded-lg"
          />
          <span className="text-xl font-bold">Count Dojo</span>
        </div>
        <div className="flex gap-6">
          <a href="#features" className="text-slate-300 hover:text-white transition">Features</a>
          <a href="#screenshots" className="text-slate-300 hover:text-white transition">Screenshots</a>
          <a href="#faq" className="text-slate-300 hover:text-white transition">FAQ</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Train to Beat the Casino
        </h1>
        <p className="text-xl text-slate-400 mb-4">
          Card counting made simple
        </p>
        <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
          The world's first gamified card counting education app. Learn to count cards 
          from absolute beginner to casino-ready in 90 days. Like Duolingo, but for blackjack.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#" 
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.61-3.74 4.25z"/>
            </svg>
            Download on App Store
          </a>
          <a 
            href="#" 
            className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.609-.814V2.628a1 1 0 01.609-.814zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.634z"/>
            </svg>
            Get it on Google Play
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Everything You Need</h2>
          <p className="text-xl text-slate-400 text-center mb-16">
            The only A to Z platform that teaches card counting from beginner to advanced
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* Screenshots */}
      <section id="screenshots" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">See It In Action</h2>
          <p className="text-xl text-slate-400 text-center mb-12">
            Beautiful, intuitive design that makes learning addictive
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-2xl p-4 overflow-hidden">
              <Image 
                src="/images/IMG_6359.jpg" 
                alt="Skill Tree" 
                width={400}
                height={800}
                className="rounded-xl w-full h-auto"
              />
              <p className="text-center text-slate-400 mt-4">Skill Tree Progress</p>
            </div>
            <div className="bg-slate-800 rounded-2xl p-4 overflow-hidden">
              <Image 
                src="/images/IMG_6360.jpg" 
                alt="Practice Drills" 
                width={400}
                height={800}
                className="rounded-xl w-full h-auto"
              />
              <p className="text-center text-slate-400 mt-4">Practice Drills</p>
            </div>
            <div className="bg-slate-800 rounded-2xl p-4 overflow-hidden">
              <Image 
                src="/images/IMG_6361.jpg" 
                alt="Profile Stats" 
                width={400}
                height={800}
                className="rounded-xl w-full h-auto"
              />
              <p className="text-center text-slate-400 mt-4">Profile & Statistics</p>
            </div>
            <div className="bg-slate-800 rounded-2xl p-4 overflow-hidden">
              <Image 
                src="/images/IMG_6362.jpg" 
                alt="Reference Library" 
                width={400}
                height={800}
                className="rounded-xl w-full h-auto"
              />
              <p className="text-center text-slate-400 mt-4">Reference Library</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">What Players Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Testimonial 
              quote="I went from knowing nothing about card counting to being able to count down a deck in 30 seconds. This app is legit."
              author="Mike R."
            />
            <Testimonial 
              quote="The gamification keeps me coming back every day. I've streak of 47 days now. Better than Duolingo!"
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
      <section id="faq" className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <FAQItem 
            question="Is card counting legal?"
            answer="Yes! Card counting is completely legal. Casinos may ask you to leave (trespassing), but you can't be arrested for using your brain. However, using devices or collaborating with others may violate laws in some jurisdictions."
          />
          
          <FAQItem 
            question="Will this app guarantee I win at blackjack?"
            answer="No gambling system can guarantee wins. Card counting gives you a mathematical edge, but variance means you can still lose in the short term. This app teaches skills that improve your odds - it doesn't promise profits."
          />
          
          <FAQItem 
            question="How long does it take to learn?"
            answer="Most users complete the basic curriculum in 30-60 days with daily practice. Mastery requires ongoing drilling. Think of it like learning a musical instrument - fundamentals take weeks, mastery takes years."
          />
          
          <FAQItem 
            question="Do I need to be good at math?"
            answer="Not at all! Hi-Lo counting only requires adding and subtracting 1. The app handles all the complex calculations. You just need to practice."
          />
          
          <FAQItem 
            question="What's the difference between free and premium?"
            answer="The free tier includes all of Unit 1 (basic strategy) and the first portion of Unit 2 (intro to counting). Premium unlocks true count conversion, bet sizing, deviations, advanced drills, and the casino simulator."
          />
          
          <FAQItem 
            question="Can I practice on my phone or tablet?"
            answer="Yes! Count Dojo is available on iOS and Android. Practice anywhere, anytime - even offline."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-emerald-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Beat the Casino?</h2>
          <p className="text-xl mb-8 text-emerald-100">
            Start your card counting journey today. Free to download, free to try.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#" 
              className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg transition hover:bg-emerald-50"
            >
              Download on App Store
            </a>
            <a 
              href="#" 
              className="bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition hover:bg-emerald-800"
            >
              Get it on Google Play
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image 
              src="/images/Count Dojo Transparent Logo.png" 
              alt="Count Dojo" 
              width={32} 
              height={32}
              className="rounded"
            />
            <span className="font-bold">Count Dojo</span>
          </div>
          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="mailto:support@countdojo.com" className="hover:text-white transition">Contact</a>
          </div>
          <p className="text-slate-500">© 2026 Count Dojo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
      <p className="text-slate-300 mb-4 italic">"{quote}"</p>
      <p className="text-emerald-400 font-semibold">— {author}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-slate-700 py-6">
      <h3 className="text-lg font-semibold mb-2">{question}</h3>
      <p className="text-slate-400">{answer}</p>
    </div>
  );
}
