import Link from "next/link";
import { SiteHeader } from "../_components/SiteHeader";
import { SiteFooter } from "../_components/SiteFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-rhythm">
        <div className="site-shell max-w-4xl">
          <p className="text-chapter mb-5">Legal — Privacy</p>
          <h1 className="font-display text-display-lg text-paper mb-4 text-balance">
            Privacy Policy
          </h1>
          <p className="font-mono text-[0.72rem] tracking-[0.22em] uppercase text-paper-faint mb-16">
            Effective Date · March 3, 2026
          </p>

          <div className="space-y-10 text-paper text-pretty">
            <p className="text-paper-muted">
              Count Dojo (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the
              Count Dojo mobile application (the &quot;App&quot;) and the website located at
              countdojo.com (the &quot;Website&quot;). This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use our App and
              Website.
            </p>

            <p className="text-paper-muted">
              By using the App or Website, you agree to the collection and use of information
              in accordance with this Privacy Policy. If you do not agree, please do not access
              or use the App or Website.
            </p>

            <LegalSection number="01" title="Information We Collect">
              <h3 className="font-display text-xl text-paper mt-4 mb-3">
                Information You Provide Directly
              </h3>
              <ul className="space-y-2 text-paper-muted">
                <li>
                  <strong className="text-paper">Account Information:</strong> If you create an
                  account, we may collect your email address and display name.
                </li>
                <li>
                  <strong className="text-paper">Purchase Information:</strong> Payment
                  processing is handled entirely by Apple (App Store) or Google (Google Play).
                  We do not collect, store, or have access to your credit card number, bank
                  account details, or other payment instrument information.
                </li>
                <li>
                  <strong className="text-paper">Support Communications:</strong> If you
                  contact us for customer support, we may collect your name, email address, and
                  the content of your communication.
                </li>
                <li>
                  <strong className="text-paper">Feedback:</strong> Any feedback, suggestions,
                  or bug reports you voluntarily submit.
                </li>
              </ul>

              <h3 className="font-display text-xl text-paper mt-8 mb-3">
                Information Collected Automatically
              </h3>
              <ul className="space-y-2 text-paper-muted">
                <li>
                  <strong className="text-paper">Usage Data:</strong> Anonymous, aggregated
                  information about how you interact with the App — features used, lessons
                  completed, drill performance, session duration.
                </li>
                <li>
                  <strong className="text-paper">Device Information:</strong> General device
                  information such as device type, operating system version, and app version.
                </li>
              </ul>

              <h3 className="font-display text-xl text-paper mt-8 mb-3">
                Information We Do Not Collect
              </h3>
              <p className="text-paper-muted">
                We do not collect personal gambling data, location data, contacts, microphone
                or camera or biometric data, or browsing history.
              </p>
            </LegalSection>

            <LegalSection number="02" title="How We Use Your Information">
              <p className="text-paper-muted">
                We use the information we collect to provide, operate, and maintain the App,
                process subscriptions, improve our services, communicate with you, and comply
                with legal obligations.
              </p>
            </LegalSection>

            <LegalSection number="03" title="Data Storage">
              <p className="text-paper-muted mb-4">
                <strong className="text-paper">Local Storage.</strong> The App is designed with
                an offline-first architecture. Your learning progress, drill statistics, streak
                data, and preferences are stored locally on your device.
              </p>
              <p className="text-paper-muted">
                <strong className="text-paper">Subscription Data.</strong> Your subscription
                status is managed by Apple / Google and RevenueCat. RevenueCat processes an
                anonymous app user identifier to manage your subscription status.
              </p>
            </LegalSection>

            <LegalSection number="04" title="Third-Party Services">
              <p className="text-paper-muted">
                We use Apple App Store and Google Play for distribution and payments, and
                RevenueCat for subscription management. We do not sell, trade, or rent your
                personal information to third parties.
              </p>
            </LegalSection>

            <LegalSection number="05" title="Advertising">
              <p className="text-paper-muted">
                The free tier may display non-personalized advertisements. These are not
                targeted based on your personal data.
              </p>
            </LegalSection>

            <LegalSection number="06" title="Children's Privacy">
              <p className="text-paper-muted">
                The App is not intended for children under 13. We do not knowingly collect
                personal information from children under 13.
              </p>
            </LegalSection>

            <LegalSection number="07" title="Data Security">
              <p className="text-paper-muted">
                We implement reasonable security measures to protect your information, but no
                method of transmission over the internet is one hundred percent secure.
              </p>
            </LegalSection>

            <LegalSection number="08" title="Your Rights and Choices">
              <p className="text-paper-muted">
                You may access, correct, delete, or opt out of promotional communications.
                Since your data is stored locally, you can delete it by uninstalling the App.
              </p>
              <p className="text-paper-muted mt-4">
                To delete your account and all associated data, please visit our{" "}
                <Link href="/delete-account" className="link-underline text-emerald-accent">
                  account deletion page
                </Link>
                .
              </p>
            </LegalSection>

            <LegalSection number="09" title="Changes to This Privacy Policy">
              <p className="text-paper-muted">
                We may update this Privacy Policy from time to time. We will notify you of any
                changes by posting the new Privacy Policy on this page.
              </p>
            </LegalSection>

            <LegalSection number="10" title="Contact Us">
              <p className="text-paper-muted">If you have any questions, please contact us at:</p>
              <p className="text-paper-muted mt-3">
                <strong className="text-paper">Count Dojo</strong>
                <br />
                Email:{" "}
                <a
                  href="mailto:support@countdojo.com"
                  className="link-underline text-emerald-accent"
                >
                  support@countdojo.com
                </a>
                <br />
                Website: https://countdojo.com
              </p>
            </LegalSection>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function LegalSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule pt-10">
      <div className="flex items-baseline gap-4 mb-6">
        <span className="font-mono text-[0.72rem] tracking-[0.22em] uppercase text-paper-faint">
          {number}
        </span>
        <h2
          className="font-display text-2xl md:text-3xl text-paper"
          style={{ fontVariationSettings: '"SOFT" 80, "opsz" 48' }}
        >
          {title}
        </h2>
      </div>
      <div>{children}</div>
    </section>
  );
}
