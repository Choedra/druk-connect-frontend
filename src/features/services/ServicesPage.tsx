"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, RotateCw, SearchX } from "lucide-react";

import { ListingCard, ListingCardSkeleton } from "@/src/features/landing-page/ui/ListingCard";
import { SearchForm } from "@/src/features/landing-page/ui/SearchForm";
import { isListingCategory, isListingCity } from "@/src/features/listing/constants/categories";
import { useSearchListings } from "@/src/features/listing/hooks/useSearchListings";
import { FilterBar } from "./ui/FilterBar";

const PAGE_SIZE = 12;

type Filters = { q?: string; city?: string; category?: string; page: number };

/** Reads and validates filters from the URL. Unknown cities/categories are ignored. */
function readFilters(params: URLSearchParams): Filters {
  const q = params.get("q")?.trim() || undefined;
  const city = params.get("city");
  const category = params.get("category");
  const page = Number(params.get("page"));
  return {
    q,
    city: isListingCity(city) ? city : undefined,
    category: isListingCategory(category) ? category : undefined,
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

/** Builds a results URL under basePath. Changing any filter resets to page 1. */
function buildHref(
  basePath: string,
  current: Filters,
  changes: { q?: string | null; city?: string | null; category?: string | null; page?: number },
) {
  const next = { ...current, page: 1, ...changes };
  const qs = new URLSearchParams();
  if (next.q) qs.set("q", next.q);
  if (next.category) qs.set("category", next.category);
  if (next.city) qs.set("city", next.city);
  if (next.page && next.page > 1) qs.set("page", String(next.page));
  const s = qs.toString();
  return s ? `${basePath}?${s}` : basePath;
}

function headingFor({ q, city, category }: Filters) {
  if (q) return `Results for “${q}”${city ? ` in ${city}` : ""}`;
  if (category) return `${category} in ${city ?? "Australia"}`;
  if (city) return `Services in ${city}`;
  return "All services";
}

type ServicesPageProps = {
  /** Where results and listing links live: "/services" (public) or "/buyer-dashboard/services". */
  basePath?: string;
  /** "dashboard": rendered inside the buyer dashboard layout. */
  variant?: "public" | "dashboard";
};

export default function ServicesPage({ basePath = "/services", variant = "public" }: ServicesPageProps) {
  const filters = readFilters(useSearchParams());
  const hasFilters = Boolean(filters.q || filters.city || filters.category);
  const hrefFor = (changes: Parameters<typeof buildHref>[2]) => buildHref(basePath, filters, changes);
  const inDashboard = variant === "dashboard";

  const { data, isLoading, isError, isFetching, refetch } = useSearchListings({
    q: filters.q,
    city: filters.city,
    category: filters.category,
    page: filters.page,
    size: PAGE_SIZE,
  });

  const listings = data?.listings ?? [];
  const total = data?.totalElements ?? 0;

  // In the dashboard the layout already provides <main>, padding and the page width.
  const Wrapper = inDashboard ? "div" : "main";
  const contentClass = inDashboard ? "py-8" : "mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10";

  return (
    <Wrapper
      {...(inDashboard ? {} : { id: "main" })}
      className={inDashboard ? "font-landing text-ink" : "min-h-[70vh] bg-white font-landing text-ink"}
    >
      <section className={inDashboard ? "pb-6" : "bg-canvas"}>
        <div className={inDashboard ? "" : "mx-auto max-w-7xl px-5 pb-8 pt-10 sm:px-8 lg:pt-12"}>
          <h1 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">{headingFor(filters)}</h1>
          {/* key resets the uncontrolled input when the URL changes */}
          <SearchForm
            key={`${filters.q}-${filters.city}-${filters.category}`}
            action={basePath}
            size="md"
            showCity={false}
            defaultQuery={filters.q}
            defaultCity={filters.city}
            category={filters.category}
            className="mt-6 max-w-3xl"
          />
        </div>
      </section>

      <FilterBar
        activeCategory={filters.category}
        activeCity={filters.city}
        hrefFor={hrefFor}
        variant={inDashboard ? "dashboard" : "public"}
      />

      <div className={contentClass}>
        <div className="flex min-h-6 items-center justify-between gap-4">
          <p className="text-muted" aria-live="polite">
            {!isLoading && !isError && (
              <>
                <span className="font-semibold text-ink">{total}</span> {total === 1 ? "service" : "services"}
              </>
            )}
          </p>
          {hasFilters && (
            <Link href={basePath} scroll={false} className="text-sm font-semibold text-sky hover:underline hover:underline-offset-4">
              Clear search and filters
            </Link>
          )}
        </div>

        {isError ? (
          <ErrorState onRetry={() => refetch()} retrying={isFetching} />
        ) : isLoading ? (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4" aria-busy="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i}>
                <ListingCardSkeleton />
              </li>
            ))}
          </ul>
        ) : listings.length === 0 ? (
          <EmptyState filters={filters} hrefFor={hrefFor} basePath={basePath} showListCta={!inDashboard} />
        ) : (
          <>
            <ul
              className={`mt-5 grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4 ${
                isFetching ? "opacity-60" : ""
              }`}
              aria-busy={isFetching}
            >
              {listings.map((listing) => (
                <li key={listing.id}>
                  <ListingCard listing={listing} hrefBase={basePath} />
                </li>
              ))}
            </ul>

            {data && data.totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-3">
                <PageLink href={hrefFor({ page: filters.page - 1 })} disabled={!data.hasPrevious}>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  Previous
                </PageLink>
                <span className="px-2 text-sm text-muted">
                  Page <span className="font-semibold text-ink">{data.currentPage}</span> of{" "}
                  <span className="font-semibold text-ink">{data.totalPages}</span>
                </span>
                <PageLink href={hrefFor({ page: filters.page + 1 })} disabled={!data.hasNext}>
                  Next
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </PageLink>
              </nav>
            )}

            {!inDashboard && (
            <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl bg-canvas p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted">
                <span className="font-semibold text-ink">Offer a service yourself?</span> List it for free and
                reach the community.
              </p>
              <Link
                href="/auth/signup?role=LISTER"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 font-semibold text-white hover:bg-ink/90"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                List your service
              </Link>
            </div>
            )}
          </>
        )}
      </div>
    </Wrapper>
  );
}

function PageLink({ href, disabled, children }: { href: string; disabled: boolean; children: React.ReactNode }) {
  const className = "inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold";
  if (disabled) {
    return (
      <span aria-disabled="true" className={`${className} cursor-not-allowed text-faint`}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={`${className} text-ink hover:border-ink/30`}>
      {children}
    </Link>
  );
}

function ErrorState({ onRetry, retrying }: { onRetry: () => void; retrying: boolean }) {
  return (
    <div className="mt-5 rounded-3xl border border-line bg-canvas px-6 py-16 text-center">
      <p className="text-xl font-bold">Services couldn&apos;t be loaded.</p>
      <p className="mt-2 text-muted">Check your connection and try again.</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 font-semibold hover:border-ink/30 disabled:opacity-60"
      >
        <RotateCw className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`} aria-hidden="true" />
        Try again
      </button>
    </div>
  );
}

function EmptyState({
  filters,
  hrefFor,
  basePath,
  showListCta,
}: {
  filters: Filters;
  hrefFor: (c: { city?: null }) => string;
  basePath: string;
  showListCta: boolean;
}) {
  const where = filters.city ? ` in ${filters.city}` : "";
  const title = filters.q ? `No results for “${filters.q}”${where}` : `No services${where} yet`;
  const detail = filters.category
    ? `There's nothing in ${filters.category}${where} yet. Try another category or all cities.`
    : "Try fewer words, another category or all cities.";
  return (
    <div className="mt-5 flex flex-col items-center rounded-3xl border border-dashed border-line px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-canvas text-muted">
        <SearchX className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-2xl font-bold">{title}</h2>
      <p className="mt-2 max-w-md text-muted">{detail}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {filters.city && (
          <Link href={hrefFor({ city: null })} className="rounded-full border border-line px-5 py-2.5 font-semibold hover:border-ink/30">
            Search all cities
          </Link>
        )}
        <Link href={basePath} className="rounded-full border border-line px-5 py-2.5 font-semibold hover:border-ink/30">
          Clear filters
        </Link>
        {showListCta && (
          <Link href="/auth/signup?role=LISTER" className="rounded-full bg-sky px-5 py-2.5 font-semibold text-white hover:bg-sky-dark">
            List your service
          </Link>
        )}
      </div>
    </div>
  );
}
