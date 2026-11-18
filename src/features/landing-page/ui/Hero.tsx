import Link from "next/link";
import { BadgeCheck, Gift, Star } from "lucide-react";

import { LISTING_CATEGORIES } from "@/src/features/listing/constants/categories";
import { HeroBoard } from "./HeroBoard";
import { SearchForm } from "./SearchForm";

// Four quick links fit on one line under the search box; the rest live in the category strip.
const QUICK_CATEGORIES = LISTING_CATEGORIES.slice(0, 4);

const PROMISES = [
  { icon: Gift, text: "Free to browse and post" },
  { icon: BadgeCheck, text: "Every provider vouched for" },
  { icon: Star, text: "Reviews from real customers" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-canvas">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14 lg:pb-24 lg:pt-20">
        {/* Message and search */}
        <div>
          <h1 className="max-w-2xl text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[3.6rem]">
            Buy, sell and find help from your community in Australia
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            The marketplace for Bhutanese people living in Australia. Rooms, food, jobs and trusted
            services from people near you.
          </p>

          <SearchForm className="mt-9 max-w-2xl" />

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">Popular:</span>
            {QUICK_CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/services?category=${encodeURIComponent(c)}`}
                className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:border-sky hover:text-sky"
              >
                {c}
              </Link>
            ))}
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6">
            {PROMISES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Icon className="h-4.5 w-4.5 text-pine" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Live proof: the newest real listings */}
        <HeroBoard />
      </div>
    </section>
  );
}
