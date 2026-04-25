import Link from "next/link";
import { SiteNav } from "../_components/site-nav";
import { SiteFooter } from "../_components/site-footer";

export const metadata = {
  title: "Privacy & Disclaimers — Faretta AI",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteNav />

      <main className="pt-[88px] pb-20 px-6 max-w-f-prose mx-auto">
        <div className="inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-kicker font-semibold text-flag mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-flag" />
          <span>Privacy &amp; disclaimers</span>
        </div>

        <h1 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-6 text-[clamp(2rem,6vw,3.5rem)]">
          The straight version.
        </h1>

        <div className="space-y-8 text-ink-2 text-[1rem] leading-[1.7]">
          <section>
            <h2 className="font-sans font-extrabold text-ink text-[1.25rem] mb-3">Faretta AI is not a law firm.</h2>
            <p>
              Faretta AI does not provide legal advice and does not form an attorney-client
              relationship with anyone who uses the chat or any other surface where Faretta is
              embedded. Information provided by Faretta is general legal information for educational
              purposes only. For advice on your specific case, consult a licensed attorney in your
              jurisdiction. We will help you find one when you need one.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-ink text-[1.25rem] mb-3">What we collect.</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Conversations.</strong> Messages you send to the Faretta chat are stored so we can improve the product.</li>
              <li><strong>Account info, when you create one.</strong> Email + display name on the members area.</li>
              <li><strong>Payment info, if you upgrade.</strong> Handled by our payment processor; we do not store card numbers.</li>
              <li><strong>Form submissions.</strong> Name, email, jurisdiction, and message when you fill out a form (contact, attorney lead, witness tip).</li>
              <li><strong>Anonymized signals.</strong> Hashed IP, user agent, page referrer — used for abuse prevention and product analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-ink text-[1.25rem] mb-3">How we use it.</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>To answer your questions.</strong> Conversation history is sent back to the model so it remembers what you asked.</li>
              <li><strong>To improve the product.</strong> Aggregate, de-identified patterns from conversations make the next answer better. Your name and contact info are stored separately and are not used as training context.</li>
              <li><strong>To route you to an attorney.</strong> If you opt into an attorney intro, we share the relevant facts (situation, jurisdiction, contact info) with a vetted attorney in your area.</li>
              <li><strong>To prevent abuse.</strong> Hashed IP and request volume let us detect bots, brute-force attempts, and harmful misuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-ink text-[1.25rem] mb-3">What we will not do.</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>We will not sell your name, email, or individual conversations.</li>
              <li>We will not share your conversation contents with an attorney unless you opt into a routing intro.</li>
              <li>We will not use anything you tell us in a crisis (suicide ideation, domestic violence, harm) for any purpose other than routing you to help.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-ink text-[1.25rem] mb-3">Aggregate data &amp; partnerships.</h2>
            <p>
              We may produce <strong>aggregate, de-identified</strong> statistics from the corpus of
              conversations — for example, the most common types of legal questions in a given
              region or quarter. These aggregates contain no individual identifying information and
              cannot be tied back to a single user. Aggregate data may be shared with partners,
              researchers, or commercial buyers under terms that prohibit re-identification. If our
              practices ever change, we will notify users by email and on this page before the
              change takes effect.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-ink text-[1.25rem] mb-3">Your controls.</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Delete everything.</strong> From the members area, you can delete your account and all associated conversations. The aggregate signals derived from them remain anonymized.</li>
              <li><strong>Export.</strong> Email <a href="mailto:hello@faretta.ai" className="text-liberty hover:underline">hello@faretta.ai</a> for a full export of your account data.</li>
              <li><strong>Withdraw consent.</strong> You can opt out of having your conversations contribute to product improvements at any time from Settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-ink text-[1.25rem] mb-3">Crisis &amp; safety.</h2>
            <p>
              If you are in immediate danger, please call <strong>911</strong>. If you are in crisis,
              call or text <strong>988</strong> (Suicide &amp; Crisis Lifeline). For domestic
              violence, call <strong>1-800-799-7233</strong> or text <strong>START to 88788</strong>.
              Faretta will surface these proactively when a conversation indicates risk.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-extrabold text-ink text-[1.25rem] mb-3">Changes to this policy.</h2>
            <p>
              We will update this page when our practices change and notify members by email. The
              date below tracks the last substantive revision.
            </p>
            <p className="mt-2 text-mute text-[0.875rem]">Last updated: April 2026.</p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-liberty text-paper text-[0.9375rem] font-semibold shadow-f-cta hover:-translate-y-[1px] transition-all duration-hover"
          >
            Questions? Contact us
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-ink/20 text-ink text-[0.9375rem] font-semibold hover:border-liberty hover:text-liberty transition-colors"
          >
            Back to the chat
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
