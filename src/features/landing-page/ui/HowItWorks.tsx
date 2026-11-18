"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  MessageCircle,
  Search,
  Star,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

type Step = { icon: LucideIcon; title: string; text: string };
type Mode = "find" | "offer";

const FLOWS: Record<Mode, { label: string; steps: Step[]; cta: { label: string; href: string } }> = {
  find: {
    label: "I need a service",
    steps: [
      { icon: Search, title: "Search your city", text: "Filter by category and city to find providers near you." },
      {
        icon: MessageCircle,
        title: "Contact the provider",
        text: "Sign in and message them on WhatsApp, straight from the listing.",
      },
      { icon: Star, title: "Leave a review", text: "Once you've used the service, rate it to help the next person." },
    ],
    cta: { label: "Browse services", href: "/services" },
  },
  offer: {
    label: "I offer a service",
    steps: [
      { icon: UserPlus, title: "Create your account", text: "Sign up as a provider and verify your email." },
      {
        icon: BadgeCheck,
        title: "Get two vouches",
        text: "Ask two members who know you to vouch for you. It keeps the marketplace trustworthy.",
      },
      {
        icon: ClipboardList,
        title: "Post your listing",
        text: "Add photos, your price and availability. People contact you directly.",
      },
    ],
    cta: { label: "List your service", href: "/auth/signup?role=LISTER" },
  },
};

export function HowItWorks() {
  const [mode, setMode] = useState<Mode>("find");
  const flow = FLOWS[mode];

  return (
    <section id="how-it-works" className="scroll-mt-20 py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div>
          <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">How it works</h2>
          <p className="mt-3 max-w-md text-lg text-muted">Simple whether you&apos;re looking for help or offering it.</p>

          <div role="tablist" aria-label="Choose a guide" className="mt-8 inline-flex rounded-full border border-line bg-canvas p-1">
            {(Object.keys(FLOWS) as Mode[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                id={`how-tab-${key}`}
                aria-selected={mode === key}
                aria-controls="how-panel"
                onClick={() => setMode(key)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  mode === key ? "bg-ink text-white" : "text-muted hover:text-ink"
                }`}
              >
                {FLOWS[key].label}
              </button>
            ))}
          </div>

          <Link
            href={flow.cta.href}
            className="mt-8 flex w-fit items-center gap-1.5 font-semibold text-sky hover:underline hover:underline-offset-4"
          >
            {flow.cta.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div id="how-panel" role="tabpanel" aria-labelledby={`how-tab-${mode}`}>
          <ol key={mode} className="relative">
            {flow.steps.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                className="animate-settle relative flex gap-5 pb-10 last:pb-0"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* connector line between steps */}
                {i < flow.steps.length - 1 && (
                  <span aria-hidden="true" className="absolute left-6 top-14 bottom-2 w-px bg-line" />
                )}
                <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sky-soft text-sky">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="pt-1">
                  <p className="text-sm font-semibold text-muted">Step {i + 1}</p>
                  <h3 className="mt-0.5 text-xl font-bold text-ink">{title}</h3>
                  <p className="mt-1.5 max-w-md leading-relaxed text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
