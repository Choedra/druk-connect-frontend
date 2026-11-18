export default function ManageVouchesSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div>
        <div className="h-7 w-48 rounded bg-line" />
        <div className="mt-2 h-4 w-80 rounded bg-line/60" />
      </div>

      <div className="h-24 w-full max-w-md rounded-2xl bg-line/60" />

      <div>
        <div className="h-6 w-32 rounded bg-line" />
        <div className="mt-2 h-4 w-72 rounded bg-line/60" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-56 rounded-2xl bg-line/60" />
        <div className="h-56 rounded-2xl bg-line/60" />
      </div>
    </div>
  );
}
