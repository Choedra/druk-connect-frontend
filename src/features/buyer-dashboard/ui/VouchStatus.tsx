import { AlertCircle, CheckCircle2 } from "lucide-react";

type VouchStatusProps = {
  status: string;
  withdrawalPending: boolean;
};

export default function VouchStatus({
  status,
  withdrawalPending,
}: VouchStatusProps) {
  if (withdrawalPending) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
        <AlertCircle className="h-3.5 w-3.5" />
        Withdrawal pending
      </span>
    );
  }

  if (status === "ACTIVE") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-pine-soft px-2.5 py-1 text-xs font-medium text-pine">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-line/60 px-2.5 py-1 text-xs font-medium text-muted">
      {formatStatus(status)}
    </span>
  );
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
