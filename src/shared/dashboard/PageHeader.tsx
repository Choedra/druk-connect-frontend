import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type PageHeaderProps = {
  title: React.ReactNode;
  /** One short sentence under the title. */
  description?: React.ReactNode;
  /** Buttons or links shown on the right (below the title on phones). */
  actions?: React.ReactNode;
  /** Optional link back to a parent page. */
  back?: { href: string; label: string };
};

/**
 * The one page header used on every dashboard page (buyer, lister, admin),
 * so titles, spacing and actions line up everywhere.
 */
export function PageHeader({ title, description, actions, back }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link
            href={back.href}
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-sky"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {back.label}
          </Link>
        )}
        <h1 className="text-3xl font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-[15px] leading-6 text-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

/** Heading for a section inside a page. */
export function SectionHeader({
  title,
  description,
  actions,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-bold tracking-[-0.015em] text-ink">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Shared button styles for page-header actions. */
export const buttonPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-sky px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(47,111,237,0.7)] transition-colors hover:bg-sky-dark disabled:cursor-not-allowed disabled:opacity-60";
export const buttonSecondary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink transition-colors hover:border-ink/25 disabled:cursor-not-allowed disabled:opacity-60";
