import { Suspense } from "react";

import BuyerServicesPage from "@/src/features/services/BuyerServicesPage";

// Filters live in the URL (useSearchParams), which needs a Suspense boundary.
export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <BuyerServicesPage />
    </Suspense>
  );
}
