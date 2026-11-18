import { IncomingVouchRequests } from "@/src/features/buyer-dashboard/ui/IncomingVouchRequests";
import { PageHeader } from "@/src/shared/dashboard/PageHeader";

export default function RequestsPage() {
  return (
    <div>
      <PageHeader
        title="Vouch requests"
        description="Review requests from members who would like you to vouch for them."
      />

      <section aria-label="Vouch requests">
        <IncomingVouchRequests />
      </section>
    </div>
  );
}
