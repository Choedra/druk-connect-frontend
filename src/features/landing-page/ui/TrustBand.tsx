import { BadgeCheck, ShieldAlert, Star } from "lucide-react";

const POINTS = [
  {
    icon: BadgeCheck,
    title: "Vouched-for providers",
    text: "Every provider needs two vouches from members who know them before they can post.",
  },
  {
    icon: Star,
    title: "Reviews from real customers",
    text: "Ratings come from community members who used the service.",
  },
  {
    icon: ShieldAlert,
    title: "Scam reports are reviewed",
    text: "Members can report a listing, and our admins review every report.",
  },
];

/** Slim band under the hero: why this marketplace is safer than a group chat. */
export function TrustBand() {
  return (
    <section aria-labelledby="trust-heading" className="border-b border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.2fr)] lg:items-center lg:gap-12">
        <h2 id="trust-heading" className="max-w-xs text-2xl font-extrabold leading-tight tracking-[-0.025em] text-ink">
          Built on the trust the community already has
        </h2>
        <ul className="grid gap-6 sm:grid-cols-3">
          {POINTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pine-soft text-pine">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-bold text-ink">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
