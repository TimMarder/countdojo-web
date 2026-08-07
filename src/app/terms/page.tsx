import { SiteHeader } from "../_components/SiteHeader";
import { SiteFooter } from "../_components/SiteFooter";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-rhythm">
        <div className="site-shell max-w-4xl">
          <p className="text-chapter mb-5">Legal — Terms</p>
          <h1 className="font-display text-display-lg text-paper mb-4 text-balance">
            Terms of Service
          </h1>
          <p className="font-mono text-[0.72rem] tracking-[0.22em] uppercase text-paper-faint mb-16">
            Effective Date · March 3, 2026
          </p>

          <div className="space-y-10 text-paper">
            <p className="text-paper-muted text-pretty">
              Welcome to Count Dojo. These Terms of Service (&quot;Terms&quot;) govern your
              access to and use of the Count Dojo mobile application (the &quot;App&quot;) and
              the website located at countdojo.com (the &quot;Website&quot;), collectively
              referred to as the &quot;Service.&quot;
            </p>

            <p className="text-paper-muted text-pretty">
              By downloading, installing, accessing, or using the Service, you agree to be
              bound by these Terms. If you do not agree to these Terms, do not use the Service.
            </p>

            <LegalSection number="01" title="Description of Service">
              <p className="text-paper-muted text-pretty">
                Count Dojo is an educational mobile application designed to teach blackjack
                basic strategy and card counting techniques through gamified lessons, drills,
                and interactive exercises. The Service is provided strictly for educational
                and entertainment purposes.
              </p>
            </LegalSection>

            <LegalSection number="02" title="Eligibility">
              <p className="text-paper-muted text-pretty">
                You must be at least 18 years of age to use the Service. By using the Service,
                you represent and warrant that you are at least 18 years old.
              </p>
            </LegalSection>

            <LegalSection number="03" title="Educational Disclaimer">
              <p
                className="font-mono text-xs tracking-[0.18em] uppercase text-amber-accent mb-5"
              >
                The Service is provided for educational and entertainment purposes only.
              </p>
              <ul className="space-y-2 text-paper-muted">
                <li>
                  The Service teaches mathematical and strategic concepts behind card counting
                  and blackjack strategy.
                </li>
                <li>
                  Card counting is legal in most jurisdictions, but casinos may restrict or
                  prohibit players suspected of card counting.
                </li>
                <li>
                  We make no guarantees that skills taught will result in financial gain.
                </li>
                <li>
                  We are not responsible for any financial losses, casino bans, or legal
                  consequences from applying techniques in real-world settings.
                </li>
                <li>
                  The information provided is based on mathematical principles and academic
                  research, not personalized financial or legal advice.
                </li>
              </ul>
            </LegalSection>

            <LegalSection number="04" title="User Accounts">
              <p className="text-paper-muted text-pretty">
                You are responsible for maintaining the confidentiality of your account
                credentials and for all activities under your account.
              </p>
            </LegalSection>

            <LegalSection number="05" title="Subscriptions and Payments">
              <p className="text-paper-muted text-pretty">
                The Service offers a free tier and premium subscriptions. Payments are
                processed through Apple App Store or Google Play. Subscriptions auto-renew
                unless canceled 24 hours before the end of the billing period.
              </p>
            </LegalSection>

            <LegalSection number="06" title="Intellectual Property">
              <p className="text-paper-muted mb-4 text-pretty">
                All content in the Service is the property of Count Dojo or its licensors and
                is protected by copyright and trademark laws.
              </p>
              <p className="text-paper-muted text-pretty">
                You may not copy, modify, distribute, sell, or reverse engineer any part of
                the Service.
              </p>
            </LegalSection>

            <LegalSection number="07" title="User Conduct">
              <p className="text-paper-muted text-pretty">
                You agree not to use the Service for illegal purposes, interfere with the
                Service, transmit malware, or harass other users.
              </p>
            </LegalSection>

            <LegalSection number="08" title="User-Generated Content">
              <p className="text-paper-muted text-pretty">
                If you submit content to the Service, you retain ownership but grant us a
                license to use it.
              </p>
            </LegalSection>

            <LegalSection number="09" title="Third-Party Services">
              <p className="text-paper-muted text-pretty">
                The Service may integrate with third-party services. We are not responsible
                for their practices or content.
              </p>
            </LegalSection>

            <LegalSection number="10" title="Disclaimer of Warranties">
              <p className="text-paper-muted text-pretty">
                The Service is provided &quot;as is&quot; without warranties of any kind. We
                do not warrant that the Service will be uninterrupted or error-free.
              </p>
            </LegalSection>

            <LegalSection number="11" title="Limitation of Liability">
              <p className="text-paper-muted text-pretty">
                To the maximum extent permitted by law, we shall not be liable for any
                indirect, incidental, or consequential damages, including financial losses
                from gambling or casino activity.
              </p>
            </LegalSection>

            <LegalSection number="12" title="Indemnification">
              <p className="text-paper-muted text-pretty">
                You agree to indemnify us from any claims arising from your use of the Service
                or violation of these Terms.
              </p>
            </LegalSection>

            <LegalSection number="13" title="Termination">
              <p className="text-paper-muted text-pretty">
                We may suspend or terminate your access at any time. Upon termination, your
                right to use the Service ceases.
              </p>
            </LegalSection>

            <LegalSection number="14" title="Governing Law">
              <p className="text-paper-muted text-pretty">
                These Terms shall be governed by the laws of the State of New York. Disputes
                will first be attempted to resolve through negotiation, then binding
                arbitration.
              </p>
            </LegalSection>

            <LegalSection number="15" title="Severability">
              <p className="text-paper-muted text-pretty">
                If any provision is found unenforceable, the remaining provisions will remain
                in effect.
              </p>
            </LegalSection>

            <LegalSection number="16" title="Entire Agreement">
              <p className="text-paper-muted text-pretty">
                These Terms, together with our Privacy Policy, constitute the entire agreement
                between you and Count Dojo.
              </p>
            </LegalSection>

            <LegalSection number="17" title="Changes to These Terms">
              <p className="text-paper-muted text-pretty">
                We reserve the right to modify these Terms at any time. Your continued use
                after changes constitutes acceptance.
              </p>
            </LegalSection>

            <LegalSection number="18" title="Contact Us">
              <p className="text-paper-muted text-pretty">
                If you have any questions about these Terms, please contact us at:
              </p>
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
