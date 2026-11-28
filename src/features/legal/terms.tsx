import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Fill in before going live. Values in [brackets] are highlighted.    */
/* ------------------------------------------------------------------ */

export const TERMS_LAST_UPDATED = "17 November 2026";
export const CONTACT_EMAIL = "info@bhutanesemarketplace.au";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type TermsAudience = "users" | "listers" | "vouchers";

export type Clause = { id: string; title: string; body: ReactNode };

export type TermsDoc = {
  audience: TermsAudience;
  title: string;
  /** Who these terms are for, shown on the /terms overview and in the page header. */
  summary: string;
  partTwoTitle: string;
  clauses: Clause[];
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function Placeholder({ value }: { value: string }) {
  return (
    <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[0.9em] font-medium text-amber-900">
      {value}
    </span>
  );
}

function Email() {
  if (CONTACT_EMAIL.startsWith("["))
    return <Placeholder value={CONTACT_EMAIL} />;
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className="font-medium text-sky underline decoration-sky/30 underline-offset-4 hover:decoration-sky"
    >
      {CONTACT_EMAIL}
    </a>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-3 space-y-2">
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

const B = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-ink">{children}</strong>
);

/* ------------------------------------------------------------------ */
/* Part 1: General Terms (the same in all three documents)             */
/* ------------------------------------------------------------------ */

export const GENERAL_TERMS: Clause[] = [
  {
    id: "1",
    title: "About us",
    body: (
      <p>
        Bhutanese Marketplace (the &ldquo;Platform&rdquo;) is operated by Phurpa
        Dorji, ABN 18 950 215 534, of Ashgrove QLD 4060, Australia
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;). Contact: <Email />.
      </p>
    ),
  },
  {
    id: "2",
    title: "What the Platform does",
    body: (
      <p>
        The Platform is an online marketplace. It lets Listers advertise
        services and lets users find and contact them. We are not a party to any
        agreement between a user and a Lister. We do not provide, supervise or
        guarantee the listed services. We do not process, hold or guarantee any
        payment between users and Listers.
      </p>
    ),
  },
  {
    id: "3",
    title: "Agreeing to these terms",
    body: (
      <p>
        By using the Platform you agree to these terms and our Privacy Policy.
        If you do not agree, do not use the Platform.
      </p>
    ),
  },
  {
    id: "4",
    title: "Eligibility",
    body: (
      <p>
        You must be at least 18 years old and able to enter a legally binding
        contract.
      </p>
    ),
  },
  {
    id: "5",
    title: "Acceptable use",
    body: (
      <>
        <p>You must not:</p>
        <Bullets
          items={[
            "break any law or anyone's rights while using the Platform",
            "post false, misleading, offensive, discriminatory or defamatory content",
            "harass, threaten or abuse any person",
            "upload viruses or harmful code, or try to hack, overload or disrupt the Platform",
            "copy, scrape or harvest data or listings by automated means",
            "impersonate another person or business",
            "use the Platform to send spam or unsolicited marketing",
          ]}
        />
      </>
    ),
  },
  {
    id: "6",
    title: "Intellectual property",
    body: (
      <p>
        We own or license the Platform&apos;s design, software, logo and
        content. You may use it only for its intended purpose. You must not
        copy, sell or reuse it without our written permission.
      </p>
    ),
  },
  {
    id: "7",
    title: "Third-party links and content",
    body: (
      <p>
        The Platform may show content from Listers and other third parties, and
        links to other websites. We are not responsible for that content or
        those websites.
      </p>
    ),
  },
  {
    id: "8",
    title: "Privacy",
    body: (
      <p>
        We handle personal information under our Privacy Policy and the{" "}
        <em>Privacy Act 1988</em> (Cth). The policy explains what we collect,
        why, who we share it with, and how to access or correct your
        information.
      </p>
    ),
  },
  {
    id: "9",
    title: "Availability",
    body: (
      <p>
        We aim to keep the Platform available, but we do not promise it will be
        uninterrupted or error-free. We may change, suspend or stop any part of
        it.
      </p>
    ),
  },
  {
    id: "10",
    title: "Australian Consumer Law",
    body: (
      <p>
        Nothing in these terms excludes, restricts or modifies any right or
        remedy you have under the <em>Australian Consumer Law</em> or other law
        that cannot be excluded.
      </p>
    ),
  },
  {
    id: "11",
    title: "Limitation of liability",
    body: (
      <>
        <p>To the extent the law allows, we are not liable for:</p>
        <Bullets
          items={[
            "the quality, safety, legality or outcome of any Lister's services",
            "the conduct of any user, Voucher or Lister, online or offline, including payments, scams and disputes between them",
            "indirect or consequential loss, such as lost profits or data",
          ]}
        />
        <p className="mt-3">
          Where our liability cannot be excluded but can be limited, it is
          limited to AUD $100.
        </p>
      </>
    ),
  },
  {
    id: "12",
    title: "Indemnity",
    body: (
      <p>
        You agree to cover us for any loss, claim or cost caused by your breach
        of these terms, your content, or your unlawful conduct.
      </p>
    ),
  },
  {
    id: "13",
    title: "Complaints and disputes",
    body: (
      <p>
        Contact us at <Email /> first. We will try to resolve complaints within
        14 business days. Disputes between users and Listers are for them to
        resolve, although we may help at our discretion.
      </p>
    ),
  },
  {
    id: "14",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms. We will give at least 14 days&apos; notice of
        significant changes by email or a notice on the Platform. If you keep
        using the Platform after that, you accept the new terms.
      </p>
    ),
  },
  {
    id: "15",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of Queensland, Australia. You and
        we submit to the courts of Queensland.
      </p>
    ),
  },
  {
    id: "16",
    title: "General",
    body: (
      <p>
        If any clause is invalid, the rest still applies. If we do not enforce a
        right straight away, we can still enforce it later. These terms are the
        whole agreement between you and us about using the Platform.
      </p>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Part 2: one set per audience                                        */
/* ------------------------------------------------------------------ */

const USER_TERMS: TermsDoc = {
  audience: "users",
  title: "User Terms",
  summary:
    "For everyone who browses services, signs up, contacts a Lister, writes a review or reports a scam.",
  partTwoTitle: "User Terms",
  clauses: [
    {
      id: "U1",
      title: "About the Platform",
      body: (
        <p>
          Bhutanese Marketplace helps you browse services listed by Bhutanese
          people in Australia. It aims to bring together genuine service
          providers and genuine users who need their services. Our main
          objective is a scam-free marketplace, which is why every Lister must
          be vouched for.
        </p>
      ),
    },
    {
      id: "U2",
      title: "Browsing and contacting Listers",
      body: (
        <p>
          You can browse services without an account. To see a Lister&apos;s
          contact details, you need to sign up for a free account. Signing up
          also lets you submit reviews and ratings and report scams. You then
          contact the Lister directly by phone or email. The Platform has no
          messaging feature.
        </p>
      ),
    },
    {
      id: "U3",
      title: "We are a gateway only",
      body: (
        <p>
          The Platform only connects users with Listers. We do not handle any
          payments. All payments and arrangements are between you and the
          Lister.
        </p>
      ),
    },
    {
      id: "U4",
      title: "Payment warning",
      body: (
        <>
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 font-semibold text-amber-900">
            Do not make any payment before you have received the service in
            person.
          </p>
          <p className="mt-3">
            Never pay a deposit, transfer money or share bank or card details in
            advance. If a Lister asks for payment before the service, report it
            using the Report Scam bar.
          </p>
        </>
      ),
    },
    {
      id: "U5",
      title: "After you contact a Lister",
      body: (
        <p>
          To the extent the law allows, we take no responsibility for anything
          that happens after you contact a Lister, including the service,
          payment, or any dispute, loss or damage.
        </p>
      ),
    },
    {
      id: "U6",
      title: "Vouching, not verification",
      body: (
        <p>
          We do not verify that services are genuine. Instead, every Lister must
          be vouched for by people who know them and confirm their service is
          genuine and scam-free. Vouching is not a guarantee, so please use your
          own judgement before using a service.
        </p>
      ),
    },
    {
      id: "U7",
      title: "Reviews and ratings",
      body: (
        <p>
          After you use a service, you will receive a request to rate and review
          it. Your review must be genuine and based on your own experience.
          Reviews go to the Admin first and are published under the
          Lister&apos;s service once approved. Published reviews show your full
          name.
        </p>
      ),
    },
    {
      id: "U8",
      title: "Reporting scams",
      body: (
        <p>
          If you find that a service is a scam, report it to the Admin using the
          Report Scam bar. The Admin will assess the report.
        </p>
      ),
    },
    {
      id: "U9",
      title: "Feedback",
      body: (
        <p>
          You can submit feedback to help us improve the Platform using the
          Provide Feedback button. Every experience of yours matters to us.
        </p>
      ),
    },
  ],
};

const LISTER_TERMS: TermsDoc = {
  audience: "listers",
  title: "Lister Terms",
  summary: "For people who list their services on Bhutanese Marketplace.",
  partTwoTitle: "Lister Terms",
  clauses: [
    {
      id: "L1",
      title: "Signing up with two Vouchers",
      body: (
        <p>
          To sign up as a Lister, you must have two Vouchers. Each Voucher
          confirms that your business is genuine and scam-free.
        </p>
      ),
    },
    {
      id: "L2",
      title: "Voucher withdrawal",
      body: (
        <>
          <p>
            A Voucher has the right to withdraw at any time if they find out or
            come to know that you are scamming. When a Voucher withdraws:
          </p>
          <Bullets
            items={[
              "the Admin is notified and will contact you to add a new Voucher",
              "you will not be able to sign in until you add a new Voucher",
            ]}
          />
        </>
      ),
    },
    {
      id: "L3",
      title: "Second withdrawal, cancellation and appeal",
      body: (
        <p>
          If a Voucher withdrawal happens a second time, the Admin will notify
          you by email that your account will be cancelled. You will have{" "}
          <B>7 days</B> from that email to appeal. If you do not respond within
          7 days, your account will be permanently deactivated.
        </p>
      ),
    },
    {
      id: "L4",
      title: "Scam reports",
      body: (
        <p>
          If users report your service as a scam, the Admin will assess the
          report and notify you of the outcome.
        </p>
      ),
    },
    {
      id: "L5",
      title: "Your responsibility for your services",
      body: (
        <p>
          You are responsible for every service you post. Make sure everything
          you post is genuine and legitimate.
        </p>
      ),
    },
    {
      id: "L6",
      title: "Payments",
      body: (
        <p>
          We do not handle any payments. All payments are between you and your
          users.
        </p>
      ),
    },
    {
      id: "L7",
      title: "No payment before the service",
      body: (
        <p>
          You must not ask users for any payment, deposit, or bank or card
          details before you have provided the service in person. Asking for
          upfront payment is a breach of these terms. Users can report it, and
          the Admin may suspend or permanently deactivate your account.
        </p>
      ),
    },
    {
      id: "L8",
      title: "No responsibility for dealings with users",
      body: (
        <p>
          We are in no way accountable for anything that happens between you and
          your users, to the extent the law allows.
        </p>
      ),
    },
    {
      id: "L9",
      title: "Service availed and ratings",
      body: (
        <p>
          After you provide a service and mark it as &ldquo;Service
          availed&rdquo;, the user will be asked to rate your service. Ratings
          and reviews are not published straight away. They go to the Admin
          first and are posted under your service once approved.
        </p>
      ),
    },
    {
      id: "L10",
      title: "No harassment of Vouchers",
      body: (
        <p>
          You must not harass, intimidate or pressure anyone to vouch for you,
          or contact a Voucher in a threatening or harassing way after they
          withdraw. Vouchers can report this to the Admin. If the Admin finds
          you have done this, your account may be suspended or permanently
          deactivated.
        </p>
      ),
    },
    {
      id: "L11",
      title: "Feedback",
      body: (
        <p>
          If you face any issues with the Platform, or would like changes that
          make it easier to offer your services, let us know using the Provide
          Feedback button. Every experience of yours matters to us.
        </p>
      ),
    },
  ],
};

const VOUCHER_TERMS: TermsDoc = {
  audience: "vouchers",
  title: "Voucher Terms",
  summary: "For members who accept a request to vouch for a Lister.",
  partTwoTitle: "Voucher Terms",
  clauses: [
    {
      id: "V1",
      title: "Vouch requests",
      body: (
        <p>
          When a person wants to list services on Bhutanese Marketplace, you may
          receive a request to vouch for them.
        </p>
      ),
    },
    {
      id: "V2",
      title: "Becoming a Verified Voucher",
      body: (
        <p>
          When you accept a request, you become a Verified Voucher for that
          Lister. Your name as a Verified Voucher will be shown on the
          Lister&apos;s profile.
        </p>
      ),
    },
    {
      id: "V3",
      title: "Your role",
      body: (
        <p>
          By vouching, you confirm that you know the person and that the service
          they provide is scam-free.
        </p>
      ),
    },
    {
      id: "V4",
      title: "Right to withdraw",
      body: (
        <p>
          If you change your mind, or suspect the Lister is scamming, you have
          the right to withdraw your vouch at any time. You do not need to
          consult the Lister first.
        </p>
      ),
    },
    {
      id: "V5",
      title: "After you withdraw",
      body: (
        <p>
          The Admin will be notified of your withdrawal. The Admin will then
          contact the Lister to arrange a new Voucher.
        </p>
      ),
    },
    {
      id: "V6",
      title: "Protection from harassment",
      body: (
        <p>
          A Lister must not harass, intimidate or pressure you, either to make
          you vouch for them or after you withdraw your vouch. If this happens,
          report it to the Admin using the Report a Lister button. The Admin
          will take action, which may include suspending or deactivating the
          Lister&apos;s account. If you feel unsafe or are threatened, contact
          the police.
        </p>
      ),
    },
  ],
};

export const TERMS_DOCS: Record<TermsAudience, TermsDoc> = {
  users: USER_TERMS,
  listers: LISTER_TERMS,
  vouchers: VOUCHER_TERMS,
};

export const TERMS_AUDIENCES: TermsAudience[] = [
  "users",
  "listers",
  "vouchers",
];

export function termsHref(audience?: TermsAudience) {
  return audience ? `/terms/${audience}` : "/terms";
}
