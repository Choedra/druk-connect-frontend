"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Plus, Star } from "lucide-react";

import { getCategoryMeta } from "@/src/features/listing/constants/categories";
import { useSearchListings } from "@/src/features/listing/hooks/useSearchListings";
import type { ListingSearchResult } from "@/src/features/listing/types/listing";

const COUNT = 4;

/**
 * The hero's right-hand panel: real listings from the marketplace, so visitors see
 * the marketplace is active before they scroll.
 */
export function HeroBoard() {
  const { data, isLoading, isError } = useSearchListings({ page: 1, size: COUNT });
  const listings = data?.listings ?? [];

  return (
    <div className="relative">
      {/* soft offset card behind the board */}
      <div
        aria-hidden="true"
        className="absolute -right-3 -top-3 hidden h-full w-full rounded-[2rem] bg-sky/10 sm:block"
      />
      <div className="relative rounded-[2rem] border border-line bg-white p-3 shadow-[0_30px_70px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between px-4 pb-3 pt-3">
          <h2 className="text-lg font-bold tracking-[-0.015em] text-ink">On the marketplace now</h2>
          <span className="flex items-center gap-2 text-sm font-medium text-muted">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pine/60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-pine" />
            </span>
            Live
          </span>
        </div>

        <ul className="flex flex-col gap-1.5" aria-busy={isLoading}>
          {isLoading &&
            Array.from({ length: COUNT }).map((_, i) => (
              <li key={i} className="flex items-center gap-4 rounded-2xl bg-canvas p-3" aria-hidden="true">
                <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-line/70" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-line/70" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-line/70" />
                </div>
              </li>
            ))}

          {!isLoading && listings.map((listing) => <BoardRow key={listing.id} listing={listing} />)}

          {!isLoading && (isError || listings.length === 0) && (
            <li>
              <Link
                href="/auth/signup?role=LISTER"
                className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-line p-5 transition-colors hover:border-sky hover:bg-sky-soft/40"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sky text-white">
                  <Plus className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-ink">Be the first to list a service</span>
                  <span className="block text-sm text-muted">It&apos;s free and takes a few minutes.</span>
                </span>
              </Link>
            </li>
          )}
        </ul>

        <Link
          href="/services"
          className="mt-1.5 flex items-center justify-center gap-1.5 rounded-2xl px-4 py-3.5 text-sm font-semibold text-sky transition-colors hover:bg-sky-soft/50"
        >
          See all services
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function BoardRow({ listing }: { listing: ListingSearchResult }) {
  const meta = getCategoryMeta(listing.listingCategory);
  const Icon = meta.icon;
  const image = [...(listing.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)[0];
  const imageUrl = image
    ? image.imageUrl.startsWith("http")
      ? image.imageUrl
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}${image.imageUrl}`
    : null;
  const location = [listing.suburb, listing.state].filter(Boolean).join(", ");

  return (
    <li>
      <Link
        href={`/services/${listing.id}`}
        className="group flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-canvas"
      >
        <div className={`grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl ${imageUrl ? "bg-canvas" : meta.tile}`}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- images come from the backend host
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <Icon className="h-6 w-6" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink group-hover:text-sky">{listing.listingTitle}</p>
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-muted">
            {location && (
              <>
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{location}</span>
              </>
            )}
            <span className="hidden shrink-0 items-center gap-1 text-pine sm:inline-flex">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Vouched
            </span>
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className={`font-bold ${listing.pricingType === "FREE" ? "text-pine" : "text-ink"}`}>{price(listing)}</p>
          {listing.averageRatingStar > 0 && (
            <p className="mt-0.5 flex items-center justify-end gap-1 text-xs font-semibold text-ink">
              <Star className="h-3 w-3 fill-[#f5a524] text-[#f5a524]" aria-hidden="true" />
              {listing.averageRatingStar.toFixed(1)}
            </p>
          )}
        </div>
      </Link>
    </li>
  );
}

function price(listing: ListingSearchResult) {
  if (listing.pricingType === "FREE") return "Free";
  if (listing.rateAmount === null) return "Ask";
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: listing.currencyCode || "AUD",
      maximumFractionDigits: listing.rateAmount % 1 === 0 ? 0 : 2,
    }).format(listing.rateAmount);
  } catch {
    return `${listing.currencyCode} ${listing.rateAmount}`;
  }
}
