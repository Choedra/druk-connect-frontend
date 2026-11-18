import {
  FileText,
  Handshake,
  History,
  LayoutDashboard,
  MessageSquare,
  MessageSquareText,
  Search,
  Settings,
  ShieldAlert,
  Star,
  Store,
  UserRound,
  Users,
} from "lucide-react";

import type { DashboardConfig } from "./DashboardShell";

export const BUYER_DASHBOARD: DashboardConfig = {
  home: "/buyer-dashboard",
  roleLabel: "Buyer",
  searchAction: "/buyer-dashboard/services",
  profileHref: "/buyer-dashboard/profile",
  primary: [
    { label: "Dashboard", href: "/buyer-dashboard", icon: LayoutDashboard },
    { label: "Browse Services", href: "/buyer-dashboard/services", icon: Search },
    { label: "Vouch Requests", href: "/buyer-dashboard/requests", icon: Users },
    { label: "Manage Vouches", href: "/buyer-dashboard/vouches", icon: Handshake },
    { label: "Service Availed History", href: "/buyer-dashboard/service-availed-history", icon: History },
  ],
  secondary: [
    { label: "Give feedback", href: "/buyer-dashboard/feedback", icon: MessageSquare },
    { label: "Profile", href: "/buyer-dashboard/profile", icon: UserRound },
    { label: "Settings", href: "/buyer-dashboard/settings", icon: Settings },
  ],
};

export const LISTER_DASHBOARD: DashboardConfig = {
  home: "/lister-dashboard",
  roleLabel: "Lister",
  profileHref: "/lister-dashboard/profile",
  primary: [
    { label: "Dashboard", href: "/lister-dashboard", icon: LayoutDashboard },
    { label: "My Listings", href: "/lister-dashboard/listings", icon: Store },
    { label: "Vouches", href: "/lister-dashboard/vouches", icon: Users },
    { label: "Service Availed History", href: "/lister-dashboard/service-availed-history", icon: History },
  ],
  secondary: [
    { label: "Give feedback", href: "/lister-dashboard/feedback", icon: MessageSquare },
    { label: "Profile", href: "/lister-dashboard/profile", icon: UserRound },
    { label: "Settings", href: "/lister-dashboard/settings", icon: Settings },
  ],
};

export const ADMIN_DASHBOARD: DashboardConfig = {
  home: "/admin-dashboard",
  roleLabel: "Admin",
  profileHref: "/admin-dashboard/profile",
  primary: [
    { label: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
    { label: "Reviews", href: "/admin-dashboard/reviews", icon: Star },
    { label: "Vouch Withdrawals", href: "/admin-dashboard/vouch-withdrawals", icon: Handshake },
    { label: "Scam Reports", href: "/admin-dashboard/scam-reports", icon: ShieldAlert },
    { label: "Appeals", href: "/admin-dashboard/appeals", icon: FileText },
    { label: "Feedback", href: "/admin-dashboard/feedback", icon: MessageSquareText },
  ],
  secondary: [
    { label: "Profile", href: "/admin-dashboard/profile", icon: UserRound },
    { label: "Settings", href: "/admin-dashboard/settings", icon: Settings },
  ],
};
