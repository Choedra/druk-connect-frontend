"use client";

import Link from "next/link";
import { Bell, ChevronRight, Lock, Mail, Phone, Shield, Trash2, UserRound } from "lucide-react";

import { useAuthStore } from "@/src/features/auth/store/authStore";
import { PageHeader } from "./PageHeader";

/** Profile page shared by every dashboard: the signed-in user's real account details. */
export function AccountProfilePage({ roleLabel }: { roleLabel: string }) {
  const user = useAuthStore((state) => state.user);
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Your account";
  const initials =
    [user?.firstName, user?.lastName]
      .filter(Boolean)
      .map((part) => part!.charAt(0).toUpperCase())
      .join("") || "U";

  return (
    <div className="w-full max-w-3xl">
      <PageHeader title="Profile" description="Your account details." />

      <section className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex items-center gap-5 border-b border-line p-6">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-sky-soft text-xl font-bold text-sky">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-extrabold tracking-[-0.025em] text-ink">{name}</h2>
            <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-0.5 text-sm font-medium text-muted">
              <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
              {roleLabel}
            </p>
          </div>
        </div>

        <dl className="divide-y divide-line">
          <Field label="Email" value={user?.email} icon={<Mail className="h-4 w-4" />} />
          <Field label="Phone" value={user?.phoneNumber} icon={<Phone className="h-4 w-4" />} />
        </dl>
      </section>
    </div>
  );
}

function Field({ label, value, icon }: { label: string; value?: string | null; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 p-6">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-canvas text-muted" aria-hidden="true">
        {icon}
      </div>
      <div className="min-w-0">
        <dt className="text-sm font-medium text-muted">{label}</dt>
        <dd className={`mt-0.5 truncate text-[15px] ${value ? "text-ink" : "text-faint"}`}>{value || "Not added"}</dd>
      </div>
    </div>
  );
}

// The settings sub-pages are not built yet; these links are kept as they were.
const SETTINGS = [
  { title: "Account", description: "Manage your email and password.", icon: Lock, href: "/dashboard/settings/account" },
  {
    title: "Notifications",
    description: "Choose how you want to receive notifications.",
    icon: Bell,
    href: "/dashboard/settings/notifications",
  },
  {
    title: "Privacy",
    description: "Control your profile visibility and contact preferences.",
    icon: Shield,
    href: "/dashboard/settings/privacy",
  },
];

/** Settings page shared by every dashboard. */
export function AccountSettingsPage() {
  return (
    <div className="w-full max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Manage your account and preferences." />

      <section className="overflow-hidden rounded-2xl border border-line bg-white">
        <ul className="divide-y divide-line">
          {SETTINGS.map(({ title, description, icon: Icon, href }) => (
            <li key={href}>
              <Link href={href} className="group flex items-center gap-4 p-5 transition-colors hover:bg-canvas sm:p-6">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-soft text-sky">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
                  <p className="mt-0.5 text-sm text-muted">{description}</p>
                </div>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-faint transition-colors group-hover:text-sky"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-danger/20 bg-white p-6">
        <h2 className="text-lg font-bold text-ink">Delete your account</h2>
        <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted">
          Permanently remove your account, listings, and other associated information from Bhutanese
          Marketplace.
        </p>
        <button
          type="button"
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-danger/40 px-5 text-sm font-semibold text-danger transition-colors hover:bg-danger-tint"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete account
        </button>
      </section>
    </div>
  );
}
