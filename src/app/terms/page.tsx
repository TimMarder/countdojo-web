import Image from "next/image";
import Link from "next/link";

export default function TermsPage() {
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
              className="h-[70px] w-auto object-contain"
              priority
            />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Effective Date: March 3, 2026</p>

        <div className="prose prose-invert prose-lg max-w-none space-y-8">
          <p>
            Welcome to Count Dojo. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Count Dojo mobile application (the &quot;App&quot;) and the website located at countdojo.com (the &quot;Website&quot;), collectively referred to as the &quot;Service.&quot;
          </p>

          <p>
            By downloading, installing, accessing, or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Service.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">1. Description of Service</h2>
            <p className="text-gray-300">
              Count Dojo is an educational mobile application designed to teach blackjack basic strategy and card counting techniques through gamified lessons, drills, and interactive exercises. The Service is provided strictly for educational and entertainment purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">2. Eligibility</h2>
            <p className="text-gray-300">
              You must be at least 18 years of age to use the Service. By using the Service, you represent and warrant that you are at least 18 years old.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">3. Educational Disclaimer</h2>
            <p className="text-gray-300 font-medium mb-4">THE SERVICE IS PROVIDED FOR EDUCATIONAL AND ENTERTAINMENT PURPOSES ONLY.</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>The Service teaches mathematical and strategic concepts behind card counting and blackjack strategy.</li>
              <li>Card counting is legal in most jurisdictions, but casinos may restrict or prohibit players suspected of card counting.</li>
              <li>We make no guarantees that skills taught will result in financial gain.</li>
              <li>We are not responsible for any financial losses, casino bans, or legal consequences from applying techniques in real-world settings.</li>
              <li>The information provided is based on mathematical principles and academic research, not personalized financial or legal advice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">4. User Accounts</h2>
            <p className="text-gray-300">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">5. Subscriptions and Payments</h2>
            <p className="text-gray-300 mb-4">The Service offers a free tier and premium subscriptions. Payments are processed through Apple App Store or Google Play. Subscriptions auto-renew unless canceled 24 hours before the end of the billing period.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">6. Intellectual Property</h2>
            <p className="text-gray-300 mb-4">All content in the Service is the property of Count Dojo or its licensors and is protected by copyright and trademark laws.</p>
            <p className="text-gray-300">You may not copy, modify, distribute, sell, or reverse engineer any part of the Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">7. User Conduct</h2>
            <p className="text-gray-300">You agree not to use the Service for illegal purposes, interfere with the Service, transmit malware, or harass other users.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">8. User-Generated Content</h2>
            <p className="text-gray-300">If you submit content to the Service, you retain ownership but grant us a license to use it.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">9. Third-Party Services</h2>
            <p className="text-gray-300">The Service may integrate with third-party services. We are not responsible for their practices or content.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">10. Disclaimer of Warranties</h2>
            <p className="text-gray-300">THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">11. Limitation of Liability</h2>
            <p className="text-gray-300">TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING FINANCIAL LOSSES FROM GAMBLING OR CASINO ACTIVITY.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">12. Indemnification</h2>
            <p className="text-gray-300">You agree to indemnify us from any claims arising from your use of the Service or violation of these Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">13. Termination</h2>
            <p className="text-gray-300">We may suspend or terminate your access at any time. Upon termination, your right to use the Service ceases.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">14. Governing Law</h2>
            <p className="text-gray-300">These Terms shall be governed by the laws of the State of New York. Disputes will first be attempted to resolve through negotiation, then binding arbitration.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">15. Severability</h2>
            <p className="text-gray-300">If any provision is found unenforceable, the remaining provisions will remain in effect.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">16. Entire Agreement</h2>
            <p className="text-gray-300">These Terms, together with our Privacy Policy, constitute the entire agreement between you and Count Dojo.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">17. Changes to These Terms</h2>
            <p className="text-gray-300">We reserve the right to modify these Terms at any time. Your continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">18. Contact Us</h2>
            <p className="text-gray-300">If you have any questions about these Terms, please contact us at:</p>
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
              <Link href="/" className="relative h-16 w-[300px] block">
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
