import { SiteHeader } from "../_components/SiteHeader";
import { SiteFooter } from "../_components/SiteFooter";

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-rhythm">
        <div className="site-shell max-w-3xl">
          <p className="text-chapter mb-5">Account — Deletion</p>
          <h1 className="font-display text-display-lg text-paper mb-16 text-balance">
            Delete your Count Dojo account.
          </h1>

          <div className="space-y-10 text-paper">
            <LegalSection number="01" title="How to delete your account">
              <p className="text-paper-muted mb-5 text-pretty">
                To delete your account and all associated data:
              </p>
              <ol className="space-y-3 text-paper-muted">
                {[
                  "Open the Count Dojo app.",
                  "Go to Settings.",
                  "Scroll to the Account section.",
                  'Tap "Delete Account".',
                  "Confirm the deletion.",
                ].map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="font-mono text-[0.7rem] tracking-[0.2em] text-emerald-accent pt-1 w-6 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </LegalSection>

            <LegalSection number="02" title="What gets deleted">
              <ul className="space-y-2 text-paper-muted">
                <li>Your account and login credentials.</li>
                <li>All lesson progress, XP, streaks, and achievements.</li>
                <li>Drill statistics and session history.</li>
                <li>All cloud-synced data.</li>
              </ul>
            </LegalSection>

            <LegalSection number="03" title="What does not get deleted automatically">
              <p className="text-paper-muted text-pretty">
                <strong className="text-paper">Your subscription.</strong> Active subscriptions
                must be cancelled separately through your device&apos;s subscription management
                (Settings → Subscriptions on iOS, Google Play → Subscriptions on Android). If
                you do not cancel, you will continue to be charged.
              </p>
            </LegalSection>

            <LegalSection number="04" title="Data retention">
              <p className="text-paper-muted text-pretty">
                All user data is deleted immediately upon account deletion. No data is
                retained after deletion.
              </p>
            </LegalSection>

            <LegalSection number="05" title="Can't access the app?">
              <p className="text-paper-muted text-pretty">
                If you are unable to access the app, you can request account deletion by
                emailing{" "}
                <a
                  href="mailto:support@countdojo.com"
                  className="link-underline text-emerald-accent"
                >
                  support@countdojo.com
                </a>{" "}
                with the subject line &quot;Delete My Account&quot; from the email address
                associated with your account. We will process your request within 7 business
                days.
              </p>
            </LegalSection>

            <LegalSection number="06" title="Need help?">
              <p className="text-paper-muted text-pretty">
                Contact{" "}
                <a
                  href="mailto:support@countdojo.com"
                  className="link-underline text-emerald-accent"
                >
                  support@countdojo.com
                </a>
                .
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
