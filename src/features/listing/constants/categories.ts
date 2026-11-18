import {
  Briefcase,
  Car,
  GraduationCap,
  Home,
  LayoutGrid,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

/**
 * Single source of truth for listing categories.
 * These are the values saved by the "new listing" form, so filters and
 * category links must use exactly these strings or search returns nothing.
 */
export const LISTING_CATEGORIES = [
  "Food & Catering",
  "Education",
  "Transport",
  "Home Services",
  "Beauty & Wellness",
  "Professional Services",
  "Other",
] as const;

export type ListingCategory = (typeof LISTING_CATEGORIES)[number];

export type CategoryMeta = {
  name: ListingCategory;
  icon: LucideIcon;
  /** Short plain-language description for category tiles. */
  description: string;
  /** Tailwind classes for the tile / image placeholder (background + icon colour). */
  tile: string;
};

export const CATEGORY_META: Record<ListingCategory, CategoryMeta> = {
  "Food & Catering": {
    name: "Food & Catering",
    icon: UtensilsCrossed,
    description: "Home cooking, catering and community meals",
    tile: "bg-[#fff1e0] text-[#c4610a]",
  },
  Education: {
    name: "Education",
    icon: GraduationCap,
    description: "Tutoring, Dzongkha lessons and study help",
    tile: "bg-sky-soft text-sky",
  },
  Transport: {
    name: "Transport",
    icon: Car,
    description: "Airport pickups, car rental and moving help",
    tile: "bg-pine-soft text-pine",
  },
  "Home Services": {
    name: "Home Services",
    icon: Home,
    description: "Cleaning, repairs, childcare and tailoring",
    tile: "bg-[#efe9fd] text-[#6d3fd6]",
  },
  "Beauty & Wellness": {
    name: "Beauty & Wellness",
    icon: Sparkles,
    description: "Hair, beauty and wellbeing",
    tile: "bg-[#fde8ef] text-[#c2255c]",
  },
  "Professional Services": {
    name: "Professional Services",
    icon: Briefcase,
    description: "Tax returns, resumes and career advice",
    tile: "bg-[#e6f6f8] text-[#0e7c86]",
  },
  Other: {
    name: "Other",
    icon: LayoutGrid,
    description: "Everything else the community offers",
    tile: "bg-[#eef1f6] text-[#3b4a66]",
  },
};

const FALLBACK_META = CATEGORY_META.Other;

/** Looks up display info for any category string, including unknown ones from older listings. */
export function getCategoryMeta(category: string | null | undefined): CategoryMeta {
  return (category && CATEGORY_META[category as ListingCategory]) || FALLBACK_META;
}

export function isListingCategory(value: string | null | undefined): value is ListingCategory {
  return LISTING_CATEGORIES.includes(value as ListingCategory);
}

export const LISTING_CITIES = ["Melbourne", "Sydney", "Brisbane", "Adelaide", "Perth", "Canberra"] as const;

export type ListingCity = (typeof LISTING_CITIES)[number];

export function isListingCity(value: string | null | undefined): value is ListingCity {
  return LISTING_CITIES.includes(value as ListingCity);
}
