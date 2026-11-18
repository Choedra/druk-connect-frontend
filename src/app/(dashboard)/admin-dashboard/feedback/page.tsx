import AdminFeedbackList from "@/src/features/admin-dashboard/AdminFeedbackList";
import FeedbackAnalyticsCards from "@/src/features/admin-dashboard/FeedbackAnalyticsCards";
import { PageHeader } from "@/src/shared/dashboard/PageHeader";

export default function AdminFeedbackPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="User feedback"
        description="View and review feedback submitted by buyers, listers, and other users."
      />

      {/* Analytics overview */}
      <FeedbackAnalyticsCards />

      {/* Paginated feedback submissions */}
      <AdminFeedbackList />
    </div>
  );
}
