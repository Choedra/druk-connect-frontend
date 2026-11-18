import Link from "next/link";
import { MapPin, Star } from "lucide-react";

import { getCategoryMeta } from "@/src/features/listing/constants/categories";
import type { ListingSearchResult } from "@/src/features/listing/types/listing";

type ListingCardProps = {
  listing: ListingSearchResult;
  /** Where the card links to. Defaults to the public detail page. */
  hrefBase?: string;
};

export function ListingCard({ listing, hrefBase = "/services" }: ListingCardProps) {
  const meta = getCategoryMeta(listing.listingCategory);
  const Icon = meta.icon;
  const image = [...(listing.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)[0];
  const imageUrl = image ? resolveImageUrl(image.imageUrl) : null;
  const location = [listing.suburb, listing.state].filter(Boolean).join(", ");

  return (
    <Link
      href={`${hrefBase}/${listing.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.3)]"
    >
      <div className={`relative aspect-4/3 overflow-hidden ${imageUrl ? "bg-canvas" : meta.tile}`}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- images come from the backend host
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : (
          <div className="grid h-full place-items-center">
            <Icon className="h-12 w-12 opacity-80" strokeWidth={1.5} aria-hidden="true" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink">
          {listing.listingCategory}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className={`text-lg font-bold ${listing.pricingType === "FREE" ? "text-pine" : "text-ink"}`}>
            {getPriceLabel(listing)}
          </p>
          {listing.averageRatingStar > 0 && (
            <p className="flex shrink-0 items-center gap-1 text-sm font-semibold text-ink">
              <Star className="h-3.5 w-3.5 fill-[#f5a524] text-[#f5a524]" aria-hidden="true" />
              {listing.averageRatingStar.toFixed(1)}
              <span className="font-normal text-muted">({listing.totalReviewer})</span>
              <span className="sr-only">average rating</span>
            </p>
          )}
        </div>
        <h3 className="mt-1 font-medium leading-snug text-ink group-hover:underline group-hover:decoration-sky group-hover:underline-offset-4">
          {listing.listingTitle}
        </h3>
        <div className="mt-auto pt-3 text-sm text-muted">
          {location && (
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{location}</span>
            </p>
          )}
          {listing.listerName && <p className="mt-1 truncate">By {listing.listerName}</p>}
        </div>
      </div>
    </Link>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white" aria-hidden="true">
      <div className="aspect-4/3 animate-pulse bg-canvas" />
      <div className="space-y-2.5 p-4">
        <div className="h-5 w-20 animate-pulse rounded bg-line/60" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-line/60" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-line/60" />
      </div>
    </div>
  );
}

function resolveImageUrl(imageUrl: string) {
  return imageUrl.startsWith("http") ? imageUrl : `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}`;
}

function getPriceLabel(listing: ListingSearchResult) {
  if (listing.pricingType === "FREE") return "Free";
  if (listing.rateAmount === null) return "Contact provider";
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
