import { Users } from "lucide-react";

export default function EmptyVouches() {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-soft">
        <Users className="h-6 w-6 text-sky" />
      </div>

      <h3 className="mt-4 font-semibold text-ink">No vouches yet</h3>

      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        You haven&apos;t vouched for anyone yet. When you vouch for a trusted lister,
        they&apos;ll appear here.
      </p>
    </div>
  );
}
