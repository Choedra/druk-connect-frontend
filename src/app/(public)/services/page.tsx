import { Suspense } from "react";

import ServicesPage from "@/src/features/services/ServicesPage";

// ServicesPage reads filters from the URL with useSearchParams, so it
// needs a Suspense boundary (see Next docs: use-search-params).
export default function Services() {
  return (
    <Suspense fallback={<main id="main" className="min-h-[70vh] bg-canvas" />}>
      <ServicesPage />
    </Suspense>
  );
}
