import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  GENERAL_TERMS,
  TERMS_AUDIENCES,
  TERMS_DOCS,
  TERMS_LAST_UPDATED,
  termsHref,
  type Clause,
  type TermsAudience,
} from "@/src/features/legal/terms";

type Params = { audience: string };

const isAudience = (value: string): value is TermsAudience =>
  (TERMS_AUDIENCES as string[]).includes(value);

export function generateStaticParams() {
  return TERMS_AUDIENCES.map((audience) => ({ audience }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { audience } = await params;
  if (!isAudience(audience)) return {};
  const doc = TERMS_DOCS[audience];
  return {
    title: `${doc.title} — Bhutanese Marketplace`,
    description: doc.summary,
  };
}

const linkClass =
  "font-medium text-sky underline decoration-sky/30 underline-offset-4 transition-colors hover:decoration-sky";

function ClauseList({ clauses }: { clauses: Clause[] }) {
  return (
    <ol className="space-y-8">
      {clauses.map((c) => (
        <li key={c.id} id={`clause-${c.id}`} className="scroll-mt-24">
          <h3 className="flex items-baseline gap-3 text-lg font-bold text-ink">
            <span className="min-w-8 text-sm font-semibold tabular-nums text-sky">
              {c.id}.
            </span>
            {c.title}
          </h3>
          <div className="mt-2 pl-11 text-[1.02rem] leading-7 text-muted">
            {c.body}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default async function TermsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { audience } = await params;
  if (!isAudience(audience)) notFound();

  const doc = TERMS_DOCS[audience];

  return (
    <main id="main" className="bg-white font-landing text-ink">
      <header className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
          <Link
            href={termsHref()}
            className="text-sm font-medium text-muted hover:text-ink"
          >
            Terms and Conditions
          </Link>
          <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
            {doc.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            {doc.summary}
          </p>
          <p className="mt-6 text-sm text-faint">
            Last updated {TERMS_LAST_UPDATED}
          </p>

          <nav aria-label="Other terms" className="mt-8 flex flex-wrap gap-2">
            {TERMS_AUDIENCES.map((a) => {
              const active = a === audience;
              return (
                <Link
                  key={a}
                  href={termsHref(a)}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-ink text-white"
                      : "border border-line bg-white text-ink hover:border-ink/30"
                  }`}
                >
                  {TERMS_DOCS[a].title}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:py-20">
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="space-y-6 lg:sticky lg:top-24">
            <nav aria-label="On this page">
              <p className="mb-3 text-sm font-semibold text-ink">
                On this page
              </p>
              <ul className="space-y-0.5 text-[0.93rem]">
                <li>
                  <a
                    href="#part-1"
                    className="block rounded-lg px-3 py-1.5 text-muted hover:bg-canvas hover:text-ink"
                  >
                    Part 1 — General Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#part-2"
                    className="block rounded-lg px-3 py-1.5 text-muted hover:bg-canvas hover:text-ink"
                  >
                    Part 2 — {doc.partTwoTitle}
                  </a>
                </li>
              </ul>
            </nav>
            <p className="rounded-2xl border border-line bg-canvas p-4 text-sm leading-6 text-muted">
              Part 1 is the same for everyone. Part 2 covers what&apos;s
              specific to {doc.title.replace(" Terms", "").toLowerCase()}s.
            </p>
          </div>
        </aside>

        <article className="min-w-0 lg:col-span-8 xl:col-start-5">
          <section id="part-1" className="scroll-mt-24">
            <h2 className="mb-8 text-2xl font-extrabold tracking-[-0.02em] text-ink">
              Part 1 — General Terms
            </h2>
            <ClauseList clauses={GENERAL_TERMS} />
          </section>

          <section
            id="part-2"
            className="mt-14 scroll-mt-24 border-t border-line pt-14"
          >
            <h2 className="mb-8 text-2xl font-extrabold tracking-[-0.02em] text-ink">
              Part 2 — {doc.partTwoTitle}
            </h2>
            <ClauseList clauses={doc.clauses} />
          </section>

          <p className="mt-14 border-t border-line pt-8 text-[0.95rem] text-muted">
            See also our{" "}
            <Link href="/privacy" className={linkClass}>
              Privacy Policy
            </Link>
            .
          </p>
        </article>
      </div>
    </main>
  );
}
