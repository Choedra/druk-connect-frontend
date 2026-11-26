"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Menu, Plus, X } from "lucide-react";

import { useAuthStore } from "@/src/features/auth/store/authStore";
import { getDashboardRoute } from "@/src/shared/routes/getDashboardRoute";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { href: "/services", label: "Browse services" },
  { href: "/#categories", label: "Categories" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
];

const LINKS = {
  signIn: "/auth/login",
  signUpBuyer: "/auth/signup?role=BUYER",
  signUpLister: "/auth/signup?role=LISTER",
};

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrated = useAuthStore((s) => s.hydrated);
  const signedIn = hydrated && isAuthenticated && user;

  const isActive = (href: string) =>
    !href.includes("#") && pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-white/85 font-landing backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-[0.93rem] font-medium transition-colors hover:bg-canvas hover:text-ink ${
                isActive(l.href) ? "text-ink" : "text-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {signedIn ? (
            <Link
              href={getDashboardRoute(user)}
              className="inline-flex items-center gap-1.5 rounded-full bg-sky px-4.5 py-2.5 text-[0.93rem] font-semibold text-white transition-colors hover:bg-sky-dark"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href={LINKS.signIn}
                className="rounded-full px-4 py-2 text-[0.93rem] font-semibold text-ink hover:bg-canvas"
              >
                Sign in
              </Link>
              <Link
                href={LINKS.signUpBuyer}
                className="rounded-full border border-line px-4.5 py-2.5 text-[0.93rem] font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-canvas"
              >
                Sign up to vouch
              </Link>
              <Link
                href={LINKS.signUpLister}
                className="inline-flex items-center gap-1.5 rounded-full bg-sky px-4.5 py-2.5 text-[0.93rem] font-semibold text-white transition-colors hover:bg-sky-dark"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                List your service
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-ink hover:bg-canvas lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-line bg-white px-5 pb-5 pt-2 sm:px-8 lg:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 font-medium text-ink hover:bg-canvas"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          {signedIn ? (
            <Link
              href={getDashboardRoute(user)}
              className="mt-3 block rounded-full bg-sky px-4 py-2.5 text-center font-semibold text-white"
            >
              Go to dashboard
            </Link>
          ) : (
            <div className="mt-3 grid gap-2">
              <Link
                href={LINKS.signUpLister}
                className="rounded-full bg-sky px-4 py-2.5 text-center font-semibold text-white"
              >
                List your service
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={LINKS.signIn}
                  className="rounded-full border border-line px-4 py-2.5 text-center font-semibold"
                >
                  Sign in
                </Link>
                <Link
                  href={LINKS.signUpBuyer}
                  className="rounded-full border border-line px-4 py-2.5 text-center font-semibold"
                >
                  Sign up to vouch
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
