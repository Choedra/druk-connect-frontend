"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronRight,
  Search,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

import { useBuyerDashboard } from "@/src/features/buyer-dashboard/hooks/useBuyerDashboard";
import { useListings } from "@/src/features/listing/hooks/useListings";
import {
  ListingCard,
  ListingCardSkeleton,
} from "@/src/features/landing-page/ui/ListingCard";
import { useAuthStore } from "@/src/features/auth/store/authStore";
import { PageHeader, SectionHeader, buttonPrimary } from "@/src/shared/dashboard/PageHeader";

export default function BuyerDashboardPage() {
  const { data: dashboard, isPending, isError } = useBuyerDashboard();
  const {
    data: listingsData,
    isPending: isListingsPending,
    isError: isListingsError,
  } = useListings(1, 3);
  const firstName = useAuthStore((state) => state.user?.firstName);

  const recommendedServices = listingsData?.listings ?? [];
  const statValue = (value: number | undefined) =>
    isPending || isError || value === undefined ? "—" : String(value);

  const attention = dashboard
    ? [
        {
          count: dashboard.pendingVouchRequestsReceived,
          label:
            dashboard.pendingVouchRequestsReceived === 1
              ? "vouch request waiting for you"
              : "vouch requests waiting for you",
          href: "/buyer-dashboard/requests",
          icon: Users,
        },
        {
          count: dashboard.pendingReviewInvitationCount,
          label:
            dashboard.pendingReviewInvitationCount === 1
              ? "service to review"
              : "services to review",
          href: "/buyer-dashboard/service-availed-history",
          icon: Star,
        },
      ].filter((item) => item.count > 0)
    : [];

  return (
    <div className="space-y-10">
      <PageHeader
        title={`Welcome back${firstName ? `, ${firstName}` : ""}`}
        description="Find trusted services from the Bhutanese community and keep track of your activity."
        actions={
          <Link href="/buyer-dashboard/services" className={buttonPrimary}>
            <Search className="h-4 w-4" aria-hidden="true" />
            Browse services
          </Link>
        }
      />

      {/* Things to act on */}
      {attention.length > 0 && (
        <section aria-label="Needs your attention" className="grid gap-3 sm:grid-cols-2">
          {attention.map(({ count, label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border border-sky/25 bg-sky-soft/60 px-5 py-4 transition-colors hover:border-sky/50 hover:bg-sky-soft"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-sky">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-[15px] text-ink">
                <span className="font-bold">{count}</span> {label}
              </span>
              <ChevronRight
                className="ml-auto h-5 w-5 text-sky transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Link>
          ))}
        </section>
      )}

      {/* Stats */}
      <section aria-label="Your activity" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <BuyerStatCard
          label="Services used"
          value={statValue(dashboard?.servicesAvailedCount)}
          description="Services you've availed"
          icon={BriefcaseBusiness}
          tone="bg-sky-soft text-sky"
        />
        <BuyerStatCard
          label="Providers"
          value={statValue(dashboard?.uniqueProvidersUsed)}
          description="Unique providers used"
          icon={Users}
          tone="bg-pine-soft text-pine"
        />
        <BuyerStatCard
          label="Reviews submitted"
          value={statValue(dashboard?.submittedReviewCount)}
          description="Your submitted reviews"
          icon={Star}
          tone="bg-[#fff1e0] text-[#c4610a]"
        />
      </section>

      {isError && (
        <p className="text-sm text-danger" role="alert">
          Unable to load your dashboard statistics. Please try again later.
        </p>
      )}

      {/* Recommended services */}
      <section>
        <SectionHeader
          title="Services you might need"
          description="Explore services from the community."
          actions={
            <Link
              href="/buyer-dashboard/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky hover:underline hover:underline-offset-4"
            >
              View all
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        {isListingsPending ? (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i}>
                <ListingCardSkeleton />
              </li>
            ))}
          </ul>
        ) : isListingsError ? (
          <p className="rounded-2xl border border-line bg-white px-5 py-8 text-center text-sm text-danger">
            Unable to load services. Please try again later.
          </p>
        ) : recommendedServices.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-white px-5 py-10 text-center text-sm text-muted">
            No services are available right now.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedServices.map((service) => (
              <li key={service.id}>
                <ListingCard listing={service} hrefBase="/buyer-dashboard/services" />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function BuyerStatCard({
  label,
  value,
  description,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted">{label}</p>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}>
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-4xl font-extrabold tracking-[-0.03em] text-ink">{value}</p>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </div>
  );
}
