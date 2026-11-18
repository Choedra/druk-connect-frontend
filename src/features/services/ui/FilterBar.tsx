"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutGrid, MapPin } from "lucide-react";

import { CATEGORY_META, LISTING_CATEGORIES, LISTING_CITIES } from "@/src/features/listing/constants/categories";

type FilterBarProps = {
  activeCategory?: string;
  activeCity?: string;
  /** Builds a /services URL for a given category / city (and resets the page). */
  hrefFor: (changes: { category?: string | null; city?: string | null }) => string;
  /** "dashboard": fits inside the dashboard content column. */
  variant?: "public" | "dashboard";
};

/**
 * Horizontal filter bar for /services: category chips plus a city dropdown.
 * Every option is a real URL, so results are shareable and the back button works.
 */
export function FilterBar({ activeCategory, activeCity, hrefFor, variant = "public" }: FilterBarProps) {
  const router = useRouter();
  const listRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  // Fade only the edges that have more chips hidden behind them.
  const updateEdges = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    });
  }, []);

  // Centre the selected chip if it is past the edge of the row.
  // Waits for the web font so chip widths are final before measuring.
  useEffect(() => {
    let cancelled = false;
    const centreActive = () => {
      const el = listRef.current;
      const active = el?.querySelector<HTMLElement>('[aria-current="page"]');
      if (cancelled || !el) return;
      if (active) {
        const outOfView =
          active.offsetLeft < el.scrollLeft ||
          active.offsetLeft + active.offsetWidth > el.scrollLeft + el.clientWidth;
        if (outOfView) el.scrollLeft = active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2;
      }
      updateEdges();
    };
    document.fonts.ready.then(centreActive);
    window.addEventListener("resize", updateEdges);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", updateEdges);
    };
  }, [activeCategory, updateEdges]);

  const mask = `linear-gradient(to right, ${edges.start ? "black" : "transparent"}, black 40px, black calc(100% - 40px), ${
    edges.end ? "black" : "transparent"
  })`;

  const chips = [
    { value: "", label: "All", icon: LayoutGrid },
    ...LISTING_CATEGORIES.map((c) => ({ value: c, label: c, icon: CATEGORY_META[c].icon })),
  ];

  return (
    <div
      className={
        variant === "dashboard"
          ? "sticky top-16 z-20 -mx-5 border-b border-line bg-background/90 backdrop-blur-md sm:-mx-8 lg:-mx-10"
          : "sticky top-16 z-20 border-b border-line bg-white/90 backdrop-blur-md"
      }
    >
      <div
        className={`mx-auto flex flex-col gap-3 px-5 py-3 sm:px-8 lg:flex-row lg:items-center lg:gap-6 ${
          variant === "dashboard" ? "max-w-[calc(80rem+5rem)] lg:px-10" : "max-w-7xl"
        }`}
      >
        <nav aria-label="Categories" className="min-w-0 flex-1" style={{ maskImage: mask, WebkitMaskImage: mask }}>
          <ul
            ref={listRef}
            onScroll={updateEdges}
            className="no-scrollbar relative -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0"
          >
            {chips.map(({ value, label, icon: Icon }) => {
              const active = value === (activeCategory ?? "");
              return (
                <li key={label} className="shrink-0">
                  <Link
                    href={hrefFor({ category: value || null })}
                    scroll={false}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
                      active ? "border-ink bg-ink text-white" : "border-line text-ink hover:border-ink/30"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <label
          className={`relative flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors focus-within:border-sky ${
            activeCity ? "border-sky bg-sky-soft text-sky" : "border-line text-ink hover:border-ink/30"
          }`}
        >
          <MapPin className="h-4 w-4 opacity-70" aria-hidden="true" />
          <span className="sr-only">City</span>
          <select
            value={activeCity ?? ""}
            onChange={(e) => router.push(hrefFor({ city: e.target.value || null }), { scroll: false })}
            className="w-full cursor-pointer appearance-none bg-transparent pr-6 focus:outline-none lg:w-auto"
          >
            <option value="">All cities</option>
            {LISTING_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 opacity-60" aria-hidden="true" />
        </label>
      </div>
    </div>
  );
}
