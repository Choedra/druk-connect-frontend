import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Search, Store } from "lucide-react";

import {
  TERMS_DOCS,
  TERMS_LAST_UPDATED,
  termsHref,
  type TermsAudience,
} from "@/src/features/legal/terms";

export const metadata: Metadata = {
  title: "Terms and Conditions — Bhutanese Marketplace",
  description:
    "The User, Lister and Voucher Terms for Bhutanese Marketplace, and which ones apply to you.",
};

const CARDS: { audience: TermsAudience; icon: typeof Search; when: string }[] =
  [
    {
      audience: "users",
      icon: Search,
      when: "You agree to these when you use the Platform or sign up.",
    },
    {
      audience: "listers",
      icon: Store,
      when: "You agree to these when you sign up as a Lister.",
    },
    {
      audience: "vouchers",
      icon: BadgeCheck,
      when: "You agree to these when you accept a vouch request.",
    },
  ];

export default function TermsOverviewPage() {
  return (
    <main id="main" className="bg-white font-landing text-ink">
      <header className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
          <h1 className="text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
            Terms and Conditions
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            Which terms apply depends on how you use Bhutanese Marketplace. Each
            set starts with the same General Terms, followed by terms for that
            role.
          </p>
          <p className="mt-6 text-sm text-faint">
            Last updated {TERMS_LAST_UPDATED}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <ul className="grid gap-4 md:grid-cols-3">
          {CARDS.map(({ audience, icon: Icon, when }) => {
            const doc = TERMS_DOCS[audience];
            return (
              <li key={audience}>
                <Link
                  href={termsHref(audience)}
                  className="group flex h-full flex-col rounded-3xl border border-line bg-white p-6 transition-colors hover:border-sky/40 hover:bg-canvas"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-soft text-sky">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 text-xl font-extrabold tracking-[-0.02em] text-ink">
                    {doc.title}
                  </h2>
                  <p className="mt-2 text-[0.98rem] leading-7 text-muted">
                    {doc.summary}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-ink">{when}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-sky">
                    Read the {doc.title}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-[0.95rem] text-muted">
          How we handle your information is covered in our{" "}
          <Link
            href="/privacy"
            className="font-medium text-sky underline decoration-sky/30 underline-offset-4 hover:decoration-sky"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
