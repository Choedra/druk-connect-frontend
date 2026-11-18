"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert } from "lucide-react";

import { useMyRestrictions } from "../../lister-restrictions/hooks/useMyRestrictions";

/** Shown in the lister navigation only while the account is restricted. */
export function RestrictionNavLink() {
  const pathname = usePathname();
  const { data: restrictions } = useMyRestrictions();
  if (restrictions?.restricted !== true) return null;

  const active = pathname.startsWith("/lister-dashboard/account-suspended");
  return (
    <Link
      href="/lister-dashboard/account-suspended"
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? "border-danger bg-danger text-white"
          : "border-danger/25 bg-danger-tint text-danger hover:border-danger/50"
      }`}
    >
      <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="flex-1">Account Suspended</span>
      <span className={`h-2 w-2 shrink-0 rounded-full ${active ? "bg-white" : "bg-danger"}`} aria-label="Restriction active" />
    </Link>
  );
}
