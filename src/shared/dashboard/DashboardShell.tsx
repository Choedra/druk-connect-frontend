"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, Search, X, type LucideIcon } from "lucide-react";

import { useAuthStore } from "@/src/features/auth/store/authStore";
import { Wordmark } from "@/src/shared/ui/Wordmark";
import { ADMIN_DASHBOARD, BUYER_DASHBOARD, LISTER_DASHBOARD } from "./configs";

const CONFIGS = { buyer: BUYER_DASHBOARD, lister: LISTER_DASHBOARD, admin: ADMIN_DASHBOARD };
export type DashboardRole = keyof typeof CONFIGS;

export type DashboardNavItem = { label: string; href: string; icon: LucideIcon };

export type DashboardConfig = {
  /** e.g. "/buyer-dashboard" */
  home: string;
  /** Shown under the user's name: "Buyer", "Lister", "Admin". */
  roleLabel: string;
  primary: DashboardNavItem[];
  secondary: DashboardNavItem[];
  /** Where the header search box sends queries (omit to hide search). */
  searchAction?: string;
  /** Where the avatar in the header links. */
  profileHref: string;
};

/**
 * Sidebar + top bar + content area shared by the buyer, lister and admin
 * dashboards, in the marketplace theme.
 */
export function DashboardShell({
  role,
  sidebarExtra,
  children,
}: {
  /** Which dashboard's navigation to show. */
  role: DashboardRole;
  /** Optional extra item under the main navigation (e.g. a restriction notice). */
  sidebarExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  const config = CONFIGS[role];
  return (
    <div className="theme-marketplace theme-dashboard min-h-screen bg-background text-ink">
      <Sidebar config={config} extra={sidebarExtra} />
      <div className="min-h-screen lg:pl-64">
        <TopBar config={config} extra={sidebarExtra} />
        <main id="main" className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function useSession() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Your account";
  const initial = user?.firstName?.charAt(0).toUpperCase() || "U";
  const logout = () => {
    clearSession();
    router.replace("/");
  };
  return { name, initial, logout };
}

function isActive(pathname: string, href: string, home: string) {
  if (href === home) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Sidebar({ config, extra }: { config: DashboardConfig; extra?: React.ReactNode }) {
  const pathname = usePathname();
  const { name, initial, logout } = useSession();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center px-6">
        <Link href={config.home} aria-label="Bhutanese Marketplace dashboard">
          <Wordmark className="text-[1.05rem]" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-5 pt-4">
        <nav aria-label="Dashboard" className="space-y-1">
          {config.primary.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(pathname, item.href, config.home)} />
          ))}
        </nav>

        {extra && <div className="mt-3">{extra}</div>}

        <div className="my-5 border-t border-line" />

        <nav aria-label="Account" className="space-y-1">
          {config.secondary.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(pathname, item.href, config.home)} />
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-canvas p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-soft text-sm font-bold text-sky">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{name}</p>
              <p className="text-xs text-muted">{config.roleLabel}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-sm font-semibold text-muted transition-colors hover:border-ink/20 hover:text-ink"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavLink({
  item: { label, href, icon: Icon },
  active,
  onNavigate,
}: {
  item: DashboardNavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
        active ? "bg-ink text-white" : "text-muted hover:bg-canvas hover:text-ink"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}

function SearchBox({ action, className = "" }: { action: string; className?: string }) {
  return (
    <form action={action} role="search" className={className}>
      <label className="flex items-center gap-2.5 rounded-full border border-line bg-canvas px-4 py-2 focus-within:border-sky">
        <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        <span className="sr-only">Search services</span>
        <input
          type="search"
          name="q"
          placeholder="Search services or providers"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint"
        />
      </label>
    </form>
  );
}

function TopBar({ config, extra }: { config: DashboardConfig; extra?: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { initial, logout } = useSession();
  const close = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="flex h-full items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-canvas lg:hidden"
              aria-expanded={open}
              aria-controls="dashboard-mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href={config.home} aria-label="Bhutanese Marketplace dashboard" className="lg:hidden">
              <Wordmark className="text-base sm:text-[1.05rem]" />
            </Link>

            {config.searchAction && <SearchBox action={config.searchAction} className="hidden w-80 lg:block" />}
          </div>

          <Link
            href={config.profileHref}
            className="grid h-10 w-10 place-items-center rounded-full bg-sky-soft text-sm font-bold text-sky transition-colors hover:bg-sky hover:text-white"
            aria-label="Open your profile"
          >
            {initial}
          </Link>
        </div>
      </header>

      {open && (
        <div
          id="dashboard-mobile-menu"
          className="fixed inset-x-0 top-16 z-20 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-line bg-white px-5 pb-5 pt-3 shadow-[0_24px_40px_-24px_rgba(15,23,42,0.25)] lg:hidden"
        >
          {config.searchAction && <SearchBox action={config.searchAction} className="mb-3" />}

          <nav aria-label="Dashboard" className="space-y-1">
            {[...config.primary, ...config.secondary].map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isActive(pathname, item.href, config.home)}
                onNavigate={close}
              />
            ))}
          </nav>

          {extra && (
            <div className="mt-3" onClick={close}>
              {extra}
            </div>
          )}

          <button
            type="button"
            onClick={logout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-muted hover:text-ink"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </>
  );
}
