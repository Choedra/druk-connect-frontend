"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, RotateCw } from "lucide-react";

import { LISTING_CITIES, type ListingCity } from "@/src/features/listing/constants/categories";
import { useSearchListings } from "@/src/features/listing/hooks/useSearchListings";
import { ListingCard, ListingCardSkeleton } from "./ListingCard";

type CityFilter = ListingCity | "All cities";

const PAGE_SIZE = 8;
const itemClass = "w-[78%] shrink-0 snap-start sm:w-auto";

export function RecentListings() {
  const [city, setCity] = useState<CityFilter>("All cities");

  const { data, isLoading, isError, refetch, isFetching } = useSearchListings({
    city: city === "All cities" ? undefined : city,
    page: 1,
    size: PAGE_SIZE,
  });

  const listings = data?.listings ?? [];
  const servicesHref = city === "All cities" ? "/services" : `/services?city=${encodeURIComponent(city)}`;

  return (
    <section id="listings" className="scroll-mt-20 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">Services near you</h2>
            <p className="mt-3 text-lg text-muted">Pick your city to see what the community offers nearby.</p>
          </div>
          <Link href={servicesHref} className="font-semibold text-sky hover:underline hover:underline-offset-4">
            {city === "All cities" ? "Browse all services" : `All services in ${city}`}
          </Link>
        </div>

        <div
          role="group"
          aria-label="Filter by city"
          className="no-scrollbar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {(["All cities", ...LISTING_CITIES] as CityFilter[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCity(c)}
              aria-pressed={city === c}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                city === c ? "bg-ink text-white" : "border border-line text-muted hover:border-ink/30 hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {isError ? (
          <div className="mt-8 rounded-2xl border border-line bg-canvas px-6 py-12 text-center">
            <p className="font-semibold text-ink">Listings couldn&apos;t be loaded.</p>
            <p className="mt-1 text-muted">Check your connection and try again.</p>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 font-semibold text-ink hover:border-ink/30 disabled:opacity-60"
            >
              <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
              Try again
            </button>
          </div>
        ) : (
          <ul
            key={city}
            aria-live="polite"
            aria-busy={isLoading || isFetching}
            className={`no-scrollbar -mx-5 mt-8 flex snap-x scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 transition-opacity sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 lg:gap-5 ${
              isFetching && !isLoading ? "opacity-60" : ""
            }`}
          >
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className={itemClass}>
                  <ListingCardSkeleton />
                </li>
              ))}

            {!isLoading &&
              listings.map((listing, i) => (
                <li key={listing.id} className={`animate-settle ${itemClass}`} style={{ animationDelay: `${i * 50}ms` }}>
                  <ListingCard listing={listing} />
                </li>
              ))}

            {/* Fills the row (or replaces it when empty) with a prompt to post. */}
            {!isLoading && listings.length < PAGE_SIZE && (
              <li className={`${listings.length === 0 ? "sm:col-span-2 lg:col-span-4" : ""} ${itemClass}`}>
                <Link
                  href="/auth/signup?role=LISTER"
                  className="flex h-full min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-line p-6 text-center transition-colors hover:border-sky hover:bg-sky-soft/40"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-sky text-white">
                    <Plus className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-ink">
                    {listings.length === 0
                      ? `No services ${city === "All cities" ? "listed" : `in ${city}`} yet`
                      : `Offer a service${city === "All cities" ? "" : ` in ${city}`}`}
                  </span>
                  <span className="text-sm text-muted">List yours for free and reach people near you</span>
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>
    </section>
  );
}
