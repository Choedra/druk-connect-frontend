import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CATEGORY_META, LISTING_CATEGORIES } from "@/src/features/listing/constants/categories";

/** Compact strip of every category: one row on desktop, a grid on phones. */
export function CategorySection() {
  return (
    <section id="categories" className="scroll-mt-20 border-y border-line bg-canvas py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-[-0.025em] text-ink">Browse by category</h2>
          <Link
            href="/services"
            className="hidden items-center gap-1.5 text-sm font-semibold text-sky hover:underline hover:underline-offset-4 sm:inline-flex"
          >
            All services
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {LISTING_CATEGORIES.map((name) => {
            const { icon: Icon, description, tile } = CATEGORY_META[name];
            return (
              <li key={name}>
                <Link
                  href={`/services?category=${encodeURIComponent(name)}`}
                  title={description}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-line bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-sky/40 hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span className={`grid h-11 w-11 place-items-center rounded-xl ${tile}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-bold leading-snug text-ink group-hover:text-sky">{name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
