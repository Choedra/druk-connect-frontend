import Link from "next/link";
import { ArrowRight, BadgeCheck, Star } from "lucide-react";

type ReputationCardProps = {
  averageRating?: number;
  reviewCount?: number;
  vouchCount?: number;
  loading?: boolean;
};

/** The lister's trust signals, from the lister dashboard data. */
export function ReputationCard({ averageRating, reviewCount, vouchCount, loading }: ReputationCardProps) {
  const show = (value: number | undefined, digits = 0) =>
    loading || value === undefined ? "—" : value.toFixed(digits);

  return (
    <section className="flex h-full flex-col rounded-2xl border border-line bg-white p-6">
      <h2 className="text-xl font-bold tracking-[-0.015em] text-ink">Your reputation</h2>
      <p className="mt-1 text-sm text-muted">What buyers see when they choose a provider.</p>

      <dl className="mt-6 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line py-4">
        <div className="flex flex-col-reverse items-center px-2 text-center">
          <dt className="mt-1 text-xs text-muted">Rating</dt>
          <dd className="flex items-center gap-1 text-xl font-extrabold text-ink">
            <Star className="h-4 w-4 fill-[#f5a524] text-[#f5a524]" aria-hidden="true" />
            {averageRating ? show(averageRating, 1) : "—"}
          </dd>
        </div>
        <div className="flex flex-col-reverse items-center px-2 text-center">
          <dt className="mt-1 text-xs text-muted">Reviews</dt>
          <dd className="text-xl font-extrabold text-ink">{show(reviewCount)}</dd>
        </div>
        <div className="flex flex-col-reverse items-center px-2 text-center">
          <dt className="mt-1 text-xs text-muted">Vouches</dt>
          <dd className="text-xl font-extrabold text-ink">{show(vouchCount)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-pine-soft p-4 text-sm text-pine">
        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>More vouches and reviews help buyers trust you.</p>
      </div>

      <Link
        href="/lister-dashboard/vouches"
        className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-sky hover:underline hover:underline-offset-4"
      >
        Ask for vouches
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
