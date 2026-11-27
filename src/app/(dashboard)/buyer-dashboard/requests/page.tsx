import { IncomingVouchRequests } from "@/src/features/buyer-dashboard/ui/IncomingVouchRequests";
import { OfferVouchPanel } from "@/src/features/buyer-dashboard/ui/OfferVouchPanel";
import { PageHeader } from "@/src/shared/dashboard/PageHeader";

export default function RequestsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Vouch requests"
        description="Respond to vouch requests or find a lister you know and offer your vouch."
      />

      <OfferVouchPanel />

      <section aria-label="Vouch requests">
        <IncomingVouchRequests />
      </section>
    </div>
  );
}
