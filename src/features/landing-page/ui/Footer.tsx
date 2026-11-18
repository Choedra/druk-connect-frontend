import Link from "next/link";

import { LISTING_CATEGORIES, LISTING_CITIES } from "@/src/features/listing/constants/categories";
import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "Services",
    links: LISTING_CATEGORIES.slice(0, 4).map((c) => ({
      label: c,
      href: `/services?category=${encodeURIComponent(c)}`,
    })),
  },
  {
    title: "Cities",
    links: LISTING_CITIES.slice(0, 4).map((c) => ({ label: c, href: `/services?city=${c}` })),
  },
  {
    title: "Bhutanese Marketplace",
    links: [
      { label: "List your service", href: "/auth/signup?role=LISTER" },
      { label: "Sign up to vouch", href: "/auth/signup?role=BUYER" },
      { label: "Sign in", href: "/auth/login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-panel font-landing text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-5 max-w-xs leading-relaxed text-white/60">
            Trusted services from the Bhutanese community across Australia.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white/50">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-white/80 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-white/45 sm:flex-row sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Bhutanese Marketplace</p>
          <p className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
