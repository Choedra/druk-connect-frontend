import { PageHeader } from "@/src/shared/dashboard/PageHeader";
import FeedbackForm from "./ui/FeedbackForm";

export default function FeedbackPage() {
  return (
    <div className="w-full max-w-3xl">
      <PageHeader
        title="Give feedback"
        description="Help us improve Bhutanese Marketplace by reporting bugs or sharing suggestions."
      />
      <FeedbackForm />
    </div>
  );
}
