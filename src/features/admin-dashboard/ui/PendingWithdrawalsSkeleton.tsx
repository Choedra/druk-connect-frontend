export default function PendingWithdrawalsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-7 w-52 rounded bg-line" />
        <div className="mt-2 h-4 w-96 rounded bg-line/60" />
      </div>

      <div className="h-24 w-full max-w-md rounded-2xl bg-line/60" />

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="h-12 bg-line/60" />

        <div className="divide-y divide-line">
          <div className="h-24" />
          <div className="h-24" />
          <div className="h-24" />
        </div>
      </div>
    </div>
  );
}
