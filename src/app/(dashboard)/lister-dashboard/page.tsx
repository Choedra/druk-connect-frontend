"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { ReputationCard } from "@/src/features/lister-dashboard/ui/ReputationCard";
import { StatCard } from "@/src/features/lister-dashboard/ui/StatCard";
import {
  ListingCard,
  ListingCardSkeleton,
} from "@/src/features/landing-page/ui/ListingCard";
import { useMyListings } from "@/src/features/listing/hooks/useMyListings";
import { useListerDashboard } from "@/src/features/lister-dashboard/hooks/useListerDashboard";
import {
  PageHeader,
  SectionHeader,
  buttonPrimary,
} from "@/src/shared/dashboard/PageHeader";
import { useAuthStore } from "@/src/features/auth/store/authStore";

export default function DashboardPage() {
  const firstName = useAuthStore((state) => state.user?.firstName);
  const { data, isLoading, isError, error } = useListerDashboard();
  const myListings = useMyListings();
  const recentListings = (myListings.data?.listings ?? []).slice(0, 4);

  const formatNumber = (value: number | null | undefined) =>
    value == null ? "—" : value.toLocaleString();

  const formatRating = (value: number | null | undefined) =>
    value == null ? "—" : value.toFixed(1);

  return (
    <div className="space-y-10">
      <PageHeader
        title={`Welcome back${firstName ? `, ${firstName}` : ""}`}
        description="Manage your listings, respond to buyers, and build your reputation in the community."
        actions={
          <Link href="/lister-dashboard/listings/new" className={buttonPrimary}>
            <Plus className="h-4 w-4" />
            Create listing
          </Link>
        }
      />

      {isError && (
        <div
          role="alert"
          className="border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error instanceof Error
            ? error.message
            : "Unable to load dashboard analytics. Please try again."}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active listings"
          value={isLoading ? "..." : formatNumber(data?.activeListings)}
          description={
            isLoading
              ? "Loading analytics..."
              : `${formatNumber(data?.inactiveListings)} inactive listings`
          }
        />

        <StatCard
          label="Total views"
          value={isLoading ? "..." : formatNumber(data?.totalListingViews)}
          description="All-time listing views"
        />

        <StatCard
          label="Buyers served"
          value={isLoading ? "..." : formatNumber(data?.uniqueBuyersServed)}
          description={
            isLoading
              ? "Loading analytics..."
              : `${formatNumber(data?.servicesAvailedLast30Days)} services availed in 30 days`
          }
        />

        <StatCard
          label="Rating"
          value={isLoading ? "..." : formatRating(data?.averageRating)}
          description={
            isLoading
              ? "Loading analytics..."
              : `${formatNumber(data?.approvedReviewCount)} approved reviews`
          }
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div>
          <SectionHeader
            title="Your listings"
            description="The services you offer to the community."
            actions={
              <Link
                href="/lister-dashboard/listings"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky hover:underline hover:underline-offset-4"
              >
                View all
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />

          {myListings.isPending ? (
            <ul className="grid gap-5 sm:grid-cols-2" aria-busy="true">
              {Array.from({ length: 2 }).map((_, i) => (
                <li key={i}>
                  <ListingCardSkeleton />
                </li>
              ))}
            </ul>
          ) : recentListings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center">
              <p className="font-semibold text-ink">
                You haven&apos;t listed a service yet
              </p>
              <p className="mt-1 text-sm text-muted">
                List one and people in your city can find you.
              </p>
              <Link
                href="/lister-dashboard/listings/new"
                className={`${buttonPrimary} mt-5`}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create listing
              </Link>
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2">
              {recentListings.map((listing) => (
                <li key={listing.id}>
                  <ListingCard
                    listing={{ ...listing, cuisine: "", listerName: "" }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <ReputationCard
          loading={isLoading}
          averageRating={data?.averageRating}
          reviewCount={data?.approvedReviewCount}
          vouchCount={data?.activeVouchCount}
        />
      </section>
    </div>
  );
}
