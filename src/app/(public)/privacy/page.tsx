import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Fill these in before going live. Values in [brackets] are shown     */
/* highlighted on the page so they're easy to spot.                    */
/* ------------------------------------------------------------------ */

const LAST_UPDATED = "17 November 2026";
const PRIVACY_EMAIL = "info@bhutanesemarketplace.au";
const HOSTING_PROVIDER = "render.com";
const HOSTING_LOCATION = "Australia";

export const metadata: Metadata = {
  title: "Privacy Policy — Bhutanese Marketplace",
  description:
    "How Bhutanese Marketplace collects, uses, shares and protects personal information.",
};

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

const linkClass =
  "font-medium text-sky underline decoration-sky/30 underline-offset-4 transition-colors hover:decoration-sky";

function Value({ value }: { value: string }) {
  if (value.startsWith("[")) {
    return (
      <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[0.9em] font-medium text-amber-900">
        {value}
      </span>
    );
  }
  return <>{value}</>;
}

function Email() {
  if (PRIVACY_EMAIL.startsWith("[")) return <Value value={PRIVACY_EMAIL} />;
  return (
    <a href={`mailto:${PRIVACY_EMAIL}`} className={linkClass}>
      {PRIVACY_EMAIL}
    </a>
  );
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-sky"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoTable({
  head,
  rows,
}: {
  head: [string, string];
  rows: [ReactNode, ReactNode][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[520px] border-collapse text-left text-[0.95rem]">
        <thead className="bg-canvas">
          <tr>
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="px-5 py-3.5 text-sm font-semibold text-ink"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b], i) => (
            <tr key={i} className="border-t border-line align-top">
              <th
                scope="row"
                className="w-[34%] px-5 py-4 font-semibold text-ink"
              >
                {a}
              </th>
              <td className="px-5 py-4 text-muted">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const B = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-ink">{children}</strong>
);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

type Section = { id: string; title: string; body: ReactNode };

const SECTIONS: Section[] = [
  {
    id: "about",
    title: "About this policy",
    body: (
      <p>
        This Privacy Policy explains how Bhutanese Marketplace
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;), operated by Phurpa Dorji, ABN 18
        950 215 534, of Ashgrove QLD 4060, collects, uses, shares and protects
        personal information. We handle personal information in line with the{" "}
        <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles.
        This policy applies to users, Listers and Vouchers.
      </p>
    ),
  },
  {
    id: "collect",
    title: "Information we collect",
    body: (
      <>
        <InfoTable
          head={["Who", "What we collect"]}
          rows={[
            [
              "Users",
              "Name, email address, phone number (optional), reviews and ratings, scam reports, feedback",
            ],
            [
              "Listers",
              "Name, business name, ABN (if any), contact details, service descriptions, location or service area, photos you upload, the names of your Vouchers",
            ],
            [
              "Vouchers",
              "Name, email address, phone number, the Listers you vouch for, withdrawal reasons, harassment reports",
            ],
            [
              "Everyone",
              "Login details, device and browser information, IP address, pages visited",
            ],
          ]}
        />
        <p>We collect this information:</p>
        <Bullets
          items={[
            "directly from you, when you sign up, post a listing, vouch, write a review or contact us",
            "from other people, for example when a Lister nominates you as a Voucher or a user reports a scam",
            "automatically, through cookies and similar tools when you use the Platform",
          ]}
        />
        <p>
          We do not collect payment or bank details, because we do not handle
          payments.
        </p>
        <p>
          You can browse services without an account. To see a Lister&apos;s
          contact details, write a review, rate a service or report a scam, you
          need to sign up. Listers and Vouchers also need an account.
        </p>
        <p>
          The Platform has no messaging feature. When you contact a Lister, you
          do so directly by phone or email, outside the Platform. We do not see
          or store those conversations.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use your information",
    body: (
      <>
        <p>We use personal information to:</p>
        <Bullets
          items={[
            "create and manage your account",
            "show listings and connect users with Listers",
            "send vouch requests, and notify the Admin and Listers about vouches and withdrawals",
            "request, check and publish reviews and ratings",
            "assess scam reports, harassment reports and appeals",
            "respond to feedback, questions and complaints",
            "keep the Platform safe and prevent fraud and misuse",
            "improve the Platform",
            "send you news and offers, but only if you opt in",
          ]}
        />
      </>
    ),
  },
  {
    id: "visibility",
    title: "What other people can see",
    body: (
      <InfoTable
        head={["Information", "Who can see it"]}
        rows={[
          [
            "Lister's name, business name, services and photos",
            "Everyone visiting the Platform",
          ],
          ["Lister's phone number and email", "Signed-in users only"],
          [
            "Verified Voucher names",
            "Everyone, on the Lister's profile, only after the Voucher accepts",
          ],
          [
            "Approved reviews and ratings, with the reviewer's full name",
            "Everyone, under the Lister's service",
          ],
          [
            "Scam reports, harassment reports and withdrawal reasons",
            "Admin only",
          ],
          [
            "Users' and Vouchers' email addresses and phone numbers",
            "Admin only",
          ],
        ]}
      />
    ),
  },
  {
    id: "sharing",
    title: "Who we share information with",
    body: (
      <>
        <p>We do not sell your personal information. We share it only:</p>
        <Bullets
          items={[
            "with service providers who help us run the Platform, such as website hosting, email and analytics providers",
            "with the police or authorities, if a scam, threat or crime is reported, or if the law requires it",
            "with professional advisers, such as lawyers, if needed",
            "with a buyer of the Platform, if the business is sold",
          ]}
        />
      </>
    ),
  },
  {
    id: "storage",
    title: "Storage and overseas storage",
    body: (
      <p>
        Your information is stored by our hosting provider,{" "}
        <Value value={HOSTING_PROVIDER} />, on servers located in{" "}
        <Value value={HOSTING_LOCATION} />. If any of our service providers
        store information outside Australia, we take reasonable steps to make
        sure they protect it to a standard similar to Australian law.
      </p>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <>
        <p>
          We take reasonable steps to protect personal information from misuse,
          loss and unauthorised access. These include secure connections
          (HTTPS), password protection and limiting Admin access. No website is
          completely secure, so please keep your password private and tell us
          straight away if you think your account has been misused.
        </p>
        <p>
          If a data breach is likely to cause you serious harm, we will notify
          you and, where required, the Office of the Australian Information
          Commissioner (OAIC).
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep information",
    body: (
      <Bullets
        items={[
          <>
            <B>Active accounts:</B> we keep your information while your account
            is open.
          </>,
          <>
            <B>Deleted or deactivated accounts:</B> once an account is deleted
            or deactivated, all its information is deleted within 30 days. This
            includes the profile, listings, vouches, and any reviews and ratings
            written by or about that account. We keep information only where the
            law requires it.
          </>,
        ]}
      />
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>You can:</p>
        <Bullets
          items={[
            <>
              <B>access</B> the personal information we hold about you
            </>,
            <>
              <B>correct</B> information that is wrong or out of date, mostly
              through your account settings
            </>,
            <>
              <B>ask us to delete</B> your account and information, subject to
              section 8
            </>,
            <>
              <B>opt out</B> of marketing at any time using the unsubscribe link
            </>,
          ]}
        />
        <p>
          To make a request, email <Email />. We will respond within 30 days.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <p>
        We use cookies to keep you signed in, remember your settings and
        understand how the Platform is used. You can block cookies in your
        browser, but some features may not work.
      </p>
    ),
  },
  {
    id: "complaints",
    title: "Complaints",
    body: (
      <p>
        If you have a privacy concern, contact us first at <Email />. We will
        try to resolve it within 30 days. If you are not satisfied, you can
        complain to the Office of the Australian Information Commissioner at{" "}
        <a
          href="https://www.oaic.gov.au"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          oaic.gov.au
        </a>
        .
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy. We will post the new version on the Platform
        with its date, and tell you by email or notice if the changes are
        significant.
      </p>
    ),
  },
  {
    id: "sensitive",
    title: "Sensitive information",
    body: (
      <>
        <p>
          We do not ask for, record or verify anyone&apos;s ethnic or national
          origin. Bhutanese Marketplace relies on its vouching system: Vouchers
          who know the Lister confirm that they are genuine. If a Lister chooses
          to mention their background in a listing, they do so with their own
          consent.
        </p>
        <p>
          We do not ask for police checks, Blue Cards or similar documents.
          Please do not upload them.
        </p>
      </>
    ),
  },
  {
    id: "vouch-consent",
    title: "Vouch requests and consent",
    body: (
      <p>
        When a Lister asks someone to vouch for them, that person receives a
        request. Before vouching, they read the Voucher Terms and choose whether
        to accept. A Voucher&apos;s name is shown on the Lister&apos;s profile
        only after they accept. If they do not accept, their name is not shown.
      </p>
    ),
  },
  {
    id: "after-contact",
    title: "After you contact a Lister",
    body: (
      <p>
        Once you call or email a Lister, the Lister handles your information,
        not us. After providing a service, the Lister may ask you to leave a
        review on the Platform.
      </p>
    ),
  },
  {
    id: "automatic",
    title: "Automatic account actions",
    body: (
      <>
        <p>Some account actions happen automatically:</p>
        <Bullets
          items={[
            "When a Voucher withdraws, the Lister's account is automatically locked until they add a new Voucher.",
            "When a second withdrawal happens, the Lister is emailed a notice that their account will be cancelled, with 7 days to appeal.",
          ]}
        />
        <p>
          Any appeal is reviewed by a person (the Admin), not automatically.
        </p>
      </>
    ),
  },
  {
    id: "under-18",
    title: "People under 18",
    body: (
      <p>
        Bhutanese Marketplace is for people aged 18 and over. We do not
        knowingly collect information from anyone under 18. If we find that a
        person under 18 has created an account, we will delete the account and
        its information.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <dl className="grid gap-x-6 gap-y-3 rounded-2xl border border-line bg-canvas p-5 sm:grid-cols-[8rem_1fr] sm:p-6">
        <dt className="font-semibold text-ink">Business</dt>
        <dd>Bhutanese Marketplace, operated by Phurpa Dorji</dd>
        <dt className="font-semibold text-ink">ABN</dt>
        <dd>18 950 215 534</dd>
        <dt className="font-semibold text-ink">Address</dt>
        <dd>Ashgrove QLD 4060, Australia</dd>
        <dt className="font-semibold text-ink">Email</dt>
        <dd>
          <Email />
        </dd>
      </dl>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function PrivacyPage() {
  return (
    <main id="main" className="bg-white font-landing text-ink">
      <header className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
          <h1 className="text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            What we collect, why we collect it, who can see it, and how you can
            access or delete it.
          </p>
          <p className="mt-6 text-sm text-faint">Last updated {LAST_UPDATED}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:py-20">
        <nav aria-label="On this page" className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-24">
            <p className="mb-3 text-sm font-semibold text-ink">On this page</p>
            <ol className="space-y-0.5 text-[0.93rem]">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex gap-3 rounded-lg px-3 py-1.5 text-muted transition-colors hover:bg-canvas hover:text-ink"
                  >
                    <span className="w-5 shrink-0 tabular-nums text-faint">
                      {i + 1}
                    </span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="min-w-0 lg:col-span-8 xl:col-span-8 xl:col-start-5">
          {SECTIONS.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-24 border-t border-line py-10 first:border-t-0 first:pt-0"
            >
              <h2 className="mb-5 flex items-baseline gap-3 text-2xl font-extrabold tracking-[-0.02em] text-ink">
                <span className="text-base font-semibold tabular-nums text-sky">
                  {i + 1}.
                </span>
                {s.title}
              </h2>
              <div className="space-y-4 text-[1.02rem] leading-7 text-muted">
                {s.body}
              </div>
            </section>
          ))}

          <p className="mt-6 border-t border-line pt-8 text-[0.95rem] text-muted">
            See also our{" "}
            <Link href="/terms" className={linkClass}>
              Terms and Conditions
            </Link>
            .
          </p>
        </article>
      </div>
    </main>
  );
}
