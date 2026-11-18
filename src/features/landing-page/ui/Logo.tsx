import Link from "next/link";

import { Wordmark } from "@/src/shared/ui/Wordmark";

/** Site logo: the two-colour "Bhutanese Marketplace" wordmark, linking home. */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link href="/" aria-label="Bhutanese Marketplace home" className="inline-flex items-center">
      {/* Wordmark "light" = for light backgrounds; our "light" tone = white text for dark backgrounds */}
      <Wordmark tone={tone === "dark" ? "light" : "dark"} className="text-[1.15rem]" />
    </Link>
  );
}
