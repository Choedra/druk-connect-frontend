"use client";

import { ProfileAvatar } from "@/src/features/profile/ProfileAvatar";

import { formatAvailabilityDays } from "../../listing/utils/availability";

import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Clock3,
  Eye,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  ListingDetails,
  ListingImage,
  ListingReview,
} from "../../listing/types/listing";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../auth/store/authStore";
import { getCategoryMeta } from "../../listing/constants/categories";

import { RequestReviewPanel } from "../../reviews/ui/RequestReviewPanel";
import { recordReviewContact } from "../../reviews/api/reviewRequests";

type ServiceDetailProps = {
  listing: ListingDetails;
};

export function ServiceDetail({ listing }: ServiceDetailProps) {
  const [activeImage, setActiveImage] = useState(0);
  const contact = useWhatsAppContact(listing);

  const images = listing.images
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <main
      id="main"
      className="min-h-screen bg-white pb-28 font-landing text-ink lg:pb-0"
    >
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 lg:pb-24 lg:pt-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-muted"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 rounded-full py-1 pr-2 font-medium transition-colors hover:text-sky"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All services
          </Link>

          <span aria-hidden="true">/</span>

          <Link
            href={`/services?category=${encodeURIComponent(listing.listingCategory)}`}
            className="transition-colors hover:text-sky"
          >
            {listing.listingCategory}
          </Link>

          <span aria-hidden="true" className="hidden sm:inline">/</span>

          <span className="hidden max-w-60 truncate font-medium text-ink sm:inline">
            {listing.listingTitle}
          </span>
        </nav>

        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)] lg:gap-12">
          {/* Main content */}
          <div className="min-w-0">
            <ServiceGallery
              images={images}
              title={listing.listingTitle}
              category={listing.listingCategory}
              activeImage={activeImage}
              onImageChange={setActiveImage}
            />

            {/* Listing header */}
            <section className="mt-8">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-sky-soft px-3 py-1 text-xs font-semibold text-sky">
                  {listing.listingCategory}
                </span>
                {listing.serviceType && (
                  <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">
                    {listing.serviceType}
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <h1 className="max-w-2xl text-3xl font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-4xl">
                  {listing.listingTitle}
                </h1>

                <PriceBlock listing={listing} />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
                {listing.city && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {listing.city}
                  </span>
                )}

                {listing.averageRatingStar > 0 && (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                    <Star
                      className="h-4 w-4 fill-[#f5a524] text-[#f5a524]"
                      aria-hidden="true"
                    />
                    {listing.averageRatingStar.toFixed(1)}
                    <span className="font-normal text-muted">
                      ({listing.totalReviewer}{" "}
                      {listing.totalReviewer === 1 ? "review" : "reviews"})
                    </span>
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4" aria-hidden="true" />
                  Posted {formatDate(listing.createdAt)}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  {listing.views} views
                </span>
              </div>
            </section>

            {/* About */}
            <section className="mt-9 border-t border-line py-8">
              <SectionHeading>About this service</SectionHeading>

              <p className="max-w-2xl whitespace-pre-line text-base leading-7 text-muted">
                {listing.description}
              </p>
            </section>

            {/* Details */}
            {/* <section className="border-t border-line py-7">
              <SectionHeading>Service details</SectionHeading>

              <div className="grid sm:grid-cols-2 sm:gap-x-10">
                <DetailRow label="Cuisine" value={listing.cuisine} />

                <DetailRow
                  label="Minimum order"
                  value={String(listing.minimumOrder)}
                />

                <DetailRow label="Serves" value={String(listing.serves)} />

                <DetailRow
                  label="Availability"
                  value={formatAvailability(listing.availability)}
                />

                <DetailRow
                  label="Pricing"
                  value={
                    listing.pricingType === "FREE"
                      ? "Free"
                      : `${listing.currencyCode} ${listing.rateAmount?.toFixed(2) ?? "Contact provider"}`
                  }
                />
              </div>

              {listing.dietaryOptions.length > 0 && (
                <div className="mt-5">
                  <span className="text-sm text-muted">Dietary options</span>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {listing.dietaryOptions.map((option) => (
                      <span
                        key={option}
                        className="rounded-md border border-line bg-background px-2.5 py-1 text-xs font-medium text-muted"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section> */}

            {/* Availability */}
            <section className="border-t border-line py-8">
              <SectionHeading>Availability</SectionHeading>

              <div className="inline-flex items-center gap-2 rounded-full bg-pine-soft px-4 py-2 text-sm font-semibold text-pine">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                {formatAvailability(listing.availability)}
              </div>

              <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
                Availability can vary depending on the size of your order and
                your requirements. Contact the provider to confirm the details
                before booking.
              </p>
            </section>

            {/* Reviews */}
            <section className="border-t border-line py-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SectionHeading className="mb-0">Reviews</SectionHeading>

                <RatingSummary
                  rating={listing.averageRatingStar}
                  reviews={listing.totalReviewer}
                />
              </div>

              {listing.reviews.length > 0 ? (
                <ul className="mt-6 flex flex-col gap-3">
                  {listing.reviews.map((review, index) => (
                    <li key={getReviewKey(review, index)}>
                      <ReviewCard review={review} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
                  <p className="font-semibold">No reviews yet</p>
                  <p className="mt-1 text-sm text-muted">
                    Used this service? Your review helps the next person
                    decide.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
            <ProviderCard listing={listing} contact={contact} />

            <div className="rounded-2xl bg-sky-soft/60 p-5">
              <div className="flex gap-3">
                <ShieldCheck
                  className="mt-0.5 h-5 w-5 shrink-0 text-sky"
                  aria-hidden="true"
                />

                <div>
                  <h2 className="text-sm font-bold">Before you book</h2>

                  <p className="mt-1.5 text-sm leading-6 text-muted">
                    Confirm the service details, price, dietary requirements,
                    availability, and booking details directly with the provider
                    before making payment.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile contact bar: the sidebar sits below all the content on small screens */}
      {listing.lister.whatsappLink && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-5 py-3 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold">{getPriceLabel(listing)}</p>
              <p className="truncate text-xs text-muted">
                {listing.lister.name}
              </p>
            </div>
            <WhatsAppButton onClick={contact.open} compact />
          </div>
        </div>
      )}
    </main>
  );
}

/**
 * WhatsApp contact behaviour (unchanged): signed-out visitors are sent to
 * sign in; buyers have the contact recorded and are taken to the review flow.
 */
function useWhatsAppContact(listing: ListingDetails) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [error, setError] = useState("");

  const open = () => {
    if (!isAuthenticated) {
      const redirectPath = `/services/${listing.id}`;

      router.push(`/auth/login?redirect=${encodeURIComponent(redirectPath)}`);

      return;
    }

    if (listing.lister.whatsappLink) {
      window.open(listing.lister.whatsappLink, "_blank", "noopener,noreferrer");
      if (user?.accessType === "BUYER") {
        setError("");
        void recordReviewContact(listing.id)
          .then(() =>
            router.push(
              `/buyer-dashboard/services/${listing.id}?contactReturn=true`,
            ),
          )
          .catch((err) => setError(err.message));
      }
    }
  };

  return { open, error, user, isAuthenticated };
}

type Contact = ReturnType<typeof useWhatsAppContact>;

function WhatsAppButton({
  onClick,
  compact = false,
}: {
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-sky text-[15px] font-semibold text-white shadow-[0_8px_20px_-10px_rgba(47,111,237,0.7)] transition-colors duration-200 hover:bg-sky-dark ${
        compact ? "ml-auto px-5" : "w-full px-4"
      }`}
    >
      <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
      {compact ? "WhatsApp" : "Message on WhatsApp"}
    </button>
  );
}

function ServiceGallery({
  images,
  title,
  category,
  activeImage,
  onImageChange,
}: {
  images: ListingImage[];
  title: string;
  category: string;
  activeImage: number;
  onImageChange: (index: number) => void;
}) {
  const imageUrls = images.map((image) => getImageUrl(image.imageUrl));

  if (!imageUrls.length) {
    const meta = getCategoryMeta(category);
    const Icon = meta.icon;
    return (
      <div
        className={`grid aspect-video place-items-center rounded-3xl ${meta.tile}`}
      >
        <Icon className="h-16 w-16 opacity-80" strokeWidth={1.4} aria-hidden="true" />
      </div>
    );
  }

  const safeActiveImage = activeImage < imageUrls.length ? activeImage : 0;
  const hasSideImages = imageUrls.length > 1;

  return (
    <div>
      {/* Desktop gallery */}
      <div
        className={`hidden aspect-[16/8.5] gap-2 sm:grid ${
          hasSideImages ? "sm:grid-cols-[2fr_1fr]" : ""
        }`}
      >
        <GalleryImage
          image={imageUrls[safeActiveImage]}
          title={title}
          active={false}
          onClick={() => undefined}
          className={`h-full ${hasSideImages ? "rounded-l-3xl rounded-r-lg" : "rounded-3xl"}`}
        />

        {hasSideImages && (
          <div className="grid min-h-0 grid-rows-2 gap-2">
            {imageUrls.slice(1, 3).map((image, index) => {
              const imageIndex = index + 1;

              return (
                <GalleryImage
                  key={image}
                  image={image}
                  title={`${title} image ${imageIndex + 1}`}
                  active={safeActiveImage === imageIndex}
                  onClick={() => onImageChange(imageIndex)}
                  className={`h-full rounded-lg ${
                    index === 0 ? "rounded-tr-3xl" : "rounded-br-3xl"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile gallery */}
      <div className="sm:hidden">
        <div className="aspect-4/3 overflow-hidden rounded-3xl bg-canvas">
          {/* eslint-disable-next-line @next/next/no-img-element -- images come from the backend host */}
          <img
            src={imageUrls[safeActiveImage]}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>

        {imageUrls.length > 1 && (
          <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
            {imageUrls.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => onImageChange(index)}
                className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                  safeActiveImage === index ? "border-sky" : "border-transparent"
                }`}
                aria-label={`View image ${index + 1}`}
                aria-pressed={safeActiveImage === index}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- images come from the backend host */}
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryImage({
  image,
  title,
  active,
  onClick,
  className = "",
}: {
  image: string;
  title: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative min-h-0 w-full overflow-hidden bg-canvas ${
        active ? "ring-2 ring-sky ring-offset-2" : ""
      } ${className}`}
      aria-label={`View ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- images come from the backend host */}
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
      />
    </button>
  );
}

function PriceBlock({ listing }: { listing: ListingDetails }) {
  return (
    <div className="shrink-0 sm:text-right">
      <div
        className={`text-3xl font-extrabold tracking-tight ${
          listing.pricingType === "FREE" ? "text-pine" : "text-ink"
        }`}
      >
        {getPriceLabel(listing)}
      </div>

      {listing.pricingType === "PAID" && (
        <p className="mt-1 max-w-52 text-xs leading-5 text-muted sm:ml-auto">
          Contact the provider to confirm the final price and booking details.
        </p>
      )}
    </div>
  );
}

function ProviderCard({
  listing,
  contact,
}: {
  listing: ListingDetails;
  contact: Contact;
}) {
  const { lister } = listing;
  const { user } = contact;

  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.25)]">
      {/* Provider */}
      <div className="flex items-center gap-3.5">
        <ProfileAvatar name={lister.name} imageUrl={lister.profileImageUrl} className="h-14 w-14 text-base" />

        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold">{lister.name}</h2>

          <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-pine">
            <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            Verified provider
          </p>
        </div>
      </div>

      {/* Vouches */}
      <div className="mt-5 flex items-center gap-2 rounded-2xl bg-pine-soft px-4 py-3">
        <ShieldCheck className="h-4 w-4 shrink-0 text-pine" aria-hidden="true" />

        <span className="text-sm font-semibold text-pine">
          Vouched by {lister.activeVouches}{" "}
          {lister.activeVouches === 1 ? "member" : "members"}
        </span>

        {lister.vouches.length > 0 && (
          <div className="ml-auto flex">
            {lister.vouches.slice(0, 3).map((vouch, index) => (
              <VouchAvatar
                key={vouch.vouchId}
                name={vouch.voucherName}
                imageUrl={vouch.profileImageUrl}
                className={index > 0 ? "-ml-2" : ""}
              />
            ))}
          </div>
        )}
      </div>

      {lister.vouches.length > 0 && (
        <p className="mt-2 px-1 text-xs text-muted">
          {lister.vouches
            .slice(0, 3)
            .map((vouch) => vouch.voucherName)
            .join(", ")}
          {lister.vouches.length > 3 &&
            ` and ${lister.vouches.length - 3} more`}
        </p>
      )}

      {/* Provider stats */}
      <dl className="my-5 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line py-4">
        <ProviderStat
          value={
            listing.averageRatingStar > 0
              ? listing.averageRatingStar.toFixed(1)
              : "—"
          }
          label="Rating"
        />

        <ProviderStat value={String(listing.totalReviewer)} label="Reviews" />

        <ProviderStat
          value={formatMonthYear(listerMemberDate(listing))}
          label="Listed"
        />
      </dl>

      {user?.id === lister.userId && user.accessType === "LISTER" && (
        <RequestReviewPanel listingId={listing.id} />
      )}
      {contact.error && (
        <p role="alert" className="mb-3 text-sm text-danger">
          {contact.error}
        </p>
      )}
      {/* WhatsApp */}
      {lister.whatsappLink && (
        <>
          <WhatsAppButton onClick={contact.open} />
          {!contact.isAuthenticated && (
            <p className="mt-2 text-center text-xs text-muted">
              You&apos;ll be asked to sign in first.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function VouchAvatar({ name, imageUrl, className = "" }: {
  name: string;
  imageUrl?: string | null;
  className?: string;
}) {
  return <ProfileAvatar name={name} imageUrl={imageUrl} className={`h-7 w-7 text-[10px] border-2 border-pine-soft ${className}`} />;
}

function RatingSummary({
  rating,
  reviews,
}: {
  rating: number;
  reviews: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-3xl font-extrabold">
        {rating > 0 ? rating.toFixed(1) : "—"}
      </span>

      <div>
        <Stars rating={rating} size="h-4 w-4" />

        <p className="mt-1 text-xs text-muted">
          {reviews} {reviews === 1 ? "review" : "reviews"}
        </p>
      </div>
    </div>
  );
}

function Stars({ rating, size }: { rating: number; size: string }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={`${size} ${
            index < rounded ? "fill-[#f5a524] text-[#f5a524]" : "text-line-strong"
          }`}
        />
      ))}
    </div>
  );
}

function ProviderStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col-reverse px-2 text-center">
      <dt className="mt-0.5 text-xs text-muted">{label}</dt>
      <dd className="truncate text-base font-bold">{value}</dd>
    </div>
  );
}

// Used by the "Service details" section that is currently commented out above.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-line py-3.5">
      <span className="text-sm text-muted">{label}</span>

      <span className="text-right text-sm font-semibold text-ink">{value}</span>
    </div>
  );
}

function ReviewCard({ review }: { review: ListingReview }) {
  const name = review.reviewerName ?? "Anonymous";
  return (
    <article className="rounded-2xl border border-line p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-canvas text-xs font-bold text-muted">
            {getInitials(name) || "?"}
          </span>
          <div>
            <p className="text-sm font-semibold">{name}</p>
            {typeof review.rating === "number" && (
              <Stars rating={review.rating} size="h-3.5 w-3.5" />
            )}
          </div>
        </div>

        {review.createdAt && (
          <span className="text-xs text-muted">
            {formatDate(review.createdAt)}
          </span>
        )}
      </div>

      {review.comment && (
        <p className="mt-3 text-sm leading-6 text-muted">{review.comment}</p>
      )}
    </article>
  );
}

function SectionHeading({
  children,
  className = "mb-4",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`text-xl font-bold tracking-tight ${className}`}>
      {children}
    </h2>
  );
}

function getPriceLabel(listing: ListingDetails) {
  if (listing.pricingType === "FREE") return "Free";
  if (listing.rateAmount === null) return "Contact provider";
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: listing.currencyCode || "AUD",
      maximumFractionDigits: listing.rateAmount % 1 === 0 ? 0 : 2,
    }).format(listing.rateAmount);
  } catch {
    return `${listing.currencyCode} ${listing.rateAmount.toFixed(2)}`;
  }
}

function formatAvailability(availability: ListingDetails["availability"]) {
  return formatAvailabilityDays(availability);
}

function formatMonthYear(value: string) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-AU", { month: "short", year: "numeric" }).format(date);
}

function formatDate(value: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getImageUrl(imageUrl: string) {
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getReviewKey(review: ListingReview, index: number) {
  return (
    review.id ??
    `${review.reviewerName ?? "review"}-${review.createdAt ?? index}`
  );
}

function listerMemberDate(listing: ListingDetails) {
  /*
   * The current listing API does not provide a memberSince field.
   * Use the listing creation date as a safe fallback until the
   * backend exposes the provider's actual registration date.
   */
  return listing.createdAt;
}
