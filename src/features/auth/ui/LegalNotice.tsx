import Link from "next/link";

import { termsHref, type TermsAudience } from "@/src/features/legal/terms";

const linkClass =
  "font-medium text-ink underline decoration-line-strong underline-offset-[3px] transition hover:decoration-ink";

/**
 * Shown under the sign-in and sign-up buttons.
 * Submitting the form counts as accepting the terms and privacy policy.
 *
 * Pass `terms` to link straight to one role's terms (for example "listers"
 * on the lister sign-up). Without it, the link goes to the /terms overview.
 */
export function LegalNotice({ terms }: { terms?: TermsAudience }) {
  return (
    <p className="mt-3 text-center text-[12.5px] leading-5 text-faint">
      By continuing, you agree to our{" "}
      <Link href={termsHref(terms)} target="_blank" className={linkClass}>
        Terms and Conditions
      </Link>{" "}
      and{" "}
      <Link href="/privacy" target="_blank" className={linkClass}>
        Privacy Policy
      </Link>
      .
    </p>
  );
}
