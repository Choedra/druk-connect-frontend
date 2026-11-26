import Link from "next/link";

import { termsHref } from "./terms";

/** Shown wherever a member can accept a vouch request. */
export function VoucherTermsNotice({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-5 text-muted ${className}`}>
      By accepting a vouch request, you agree to the{" "}
      <Link
        href={termsHref("vouchers")}
        target="_blank"
        className="font-medium text-ink underline decoration-line-strong underline-offset-[3px] hover:decoration-ink"
      >
        Voucher Terms
      </Link>
      .
    </p>
  );
}
