import { MapPin, Search } from "lucide-react";

import { LISTING_CITIES } from "@/src/features/listing/constants/categories";

type SearchFormProps = {
  /** Results page the form submits to. */
  action?: string;
  defaultQuery?: string;
  defaultCity?: string;
  /** Keeps the current category when searching from /services. */
  category?: string;
  /** Hide the city picker (on /services the city lives in the filter bar). */
  showCity?: boolean;
  size?: "lg" | "md";
  className?: string;
};

/**
 * Plain GET form to /services, so it works without JavaScript and the
 * results page reads everything from the URL.
 */
export function SearchForm({
  action = "/services",
  defaultQuery = "",
  defaultCity = "",
  category,
  showCity = true,
  size = "lg",
  className = "",
}: SearchFormProps) {
  const lg = size === "lg";

  return (
    <form
      action={action}
      role="search"
      className={`flex flex-col gap-2 rounded-3xl border border-line bg-white p-2 text-left sm:flex-row sm:items-center sm:rounded-full ${
        lg ? "shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)]" : ""
      } ${className}`}
    >
      <label className={`flex flex-1 items-center gap-3 px-4 ${lg ? "py-2.5" : "py-1.5"}`}>
        <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
        <span className="sr-only">What do you need help with?</span>
        <input
          name="q"
          type="search"
          defaultValue={defaultQuery}
          placeholder="Search services or providers"
          className="w-full bg-transparent text-base text-ink placeholder:text-faint focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
      </label>

      {showCity ? (
        <label
          className={`flex items-center gap-2 border-t border-line px-4 sm:border-l sm:border-t-0 ${lg ? "py-2.5" : "py-1.5"}`}
        >
          <MapPin className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <span className="sr-only">City</span>
          <select name="city" defaultValue={defaultCity} className="bg-transparent pr-1 text-base text-ink focus:outline-none">
            <option value="">All cities</option>
            {LISTING_CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      ) : (
        defaultCity && <input type="hidden" name="city" value={defaultCity} />
      )}

      {category && <input type="hidden" name="category" value={category} />}

      <button
        type="submit"
        className={`rounded-full bg-sky font-semibold text-white transition-colors hover:bg-sky-dark ${
          lg ? "px-7 py-3.5" : "px-6 py-2.5"
        }`}
      >
        Search
      </button>
    </form>
  );
}
