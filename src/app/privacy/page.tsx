import Image from "next/image";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-gray-950/95 border-b border-white/5 h-[90px] overflow-hidden backdrop-blur-xl">
        <div className="max-w-6xl mx-auto h-full px-2 w-full flex items-center justify-between">
          <Link href="/" className="h-full flex items-center overflow-hidden">
            <Image
              src="/images/Count Dojo Banner Transparent Background NO BORDERS.png"
              alt="Count Dojo"
              width={200}
              height={40}
              className="h-[150px] w-auto object-cover"
              priority
            />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Effective Date: March 3, 2026</p>

        <div className="prose prose-invert prose-lg max-w-none space-y-8">
          <p>
            Count Dojo (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the Count Dojo mobile application (the &quot;App&quot;) and the website located at countdojo.com (the &quot;Website&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our App and Website.
          </p>

          <p>
            By using the App or Website, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use the App or Website.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">1. Information We Collect</h2>
            <h3 className="text-xl font-medium mb-2 text-white">Information You Provide Directly</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong>Account Information:</strong> If you create an account, we may collect your email address and display name.</li>
              <li><strong>Purchase Information:</strong> When you subscribe to our premium service, payment processing is handled entirely by Apple (App Store) or Google (Google Play). We do not collect, store, or have access to your credit card number, bank account details, or other payment instrument information.</li>
              <li><strong>Support Communications:</strong> If you contact us for customer support, we may collect your name, email address, and the content of your communication.</li>
              <li><strong>Feedback:</strong> Any feedback, suggestions, or bug reports you voluntarily submit to us.</li>
            </ul>

            <h3 className="text-xl font-medium mb-2 text-white mt-6">Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong>Usage Data:</strong> We may collect anonymous, aggregated information about how you interact with the App, such as features used, lessons completed, drill performance statistics, and session duration.</li>
              <li><strong>Device Information:</strong> We may collect general device information such as device type, operating system version, and app version.</li>
            </ul>

            <h3 className="text-xl font-medium mb-2 text-white mt-6">Information We Do NOT Collect</h3>
            <p className="text-gray-300">We do NOT collect: Personal Gambling Data, Location Data, Contacts or Address Book, Microphone/Camera/Biometric Data, or Browsing History.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">2. How We Use Your Information</h2>
            <p className="text-gray-300">We use the information we collect to provide, operate, and maintain the App, process subscriptions, improve our services, communicate with you, and comply with legal obligations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">3. Data Storage</h2>
            <p className="text-gray-300 mb-4"><strong>Local Storage:</strong> The App is designed with an offline-first architecture. Your learning progress, drill statistics, streak data, and preferences are stored locally on your device.</p>
            <p className="text-gray-300"><strong>Subscription Data:</strong> Your subscription status is managed by Apple/Google and RevenueCat. RevenueCat processes an anonymous app user identifier to manage your subscription status.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">4. Third-Party Services</h2>
            <p className="text-gray-300">We use Apple App Store/Google Play for distribution and payments, and RevenueCat for subscription management. We do not sell, trade, or rent your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">5. Advertising</h2>
            <p className="text-gray-300">The free tier may display non-personalized advertisements. These are not targeted based on your personal data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">6. Children&apos;s Privacy</h2>
            <p className="text-gray-300">The App is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">7. Data Security</h2>
            <p className="text-gray-300">We implement reasonable security measures to protect your information, but no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">8. Your Rights and Choices</h2>
            <p className="text-gray-300">You may access, correct, delete, or opt-out of promotional communications. Since your data is stored locally, you can delete it by uninstalling the App.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-300">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">10. Contact Us</h2>
            <p className="text-gray-300">If you have any questions, please contact us at:</p>
            <p className="text-gray-300 mt-2">
              <strong>Count Dojo</strong><br />
              Email: support@countdojo.com<br />
              Website: https://countdojo.com
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-950 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="relative h-[86px] w-full max-w-[300px] block">
                <Image
                  src="/images/Count Dojo Banner Transparent Background NO BORDERS.png"
                  alt="Count Dojo"
                  fill
                  className="object-contain object-left"
                />
              </Link>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-emerald-400">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="nav-link text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="nav-link text-gray-400 hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-emerald-400">Contact Us</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:support@countdojo.com" className="nav-link hover:text-white transition-colors">support@countdojo.com</a>
                </li>
              </ul>
              <div className="flex items-center gap-4">
                <a href="#" className="nav-link text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="nav-link text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" className="nav-link text-gray-400 hover:text-white transition-colors" aria-label="X">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" className="nav-link text-gray-400 hover:text-white transition-colors" aria-label="TikTok">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 col-span-1 md:col-span-3 text-center text-gray-500 text-sm">
            <p>© 2026 Count Dojo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
