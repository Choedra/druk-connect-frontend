"use client";

import ServicesPage from "./ServicesPage";

/**
 * Browse Services inside the buyer dashboard. Same search, filters and cards
 * as the public /services page, with links kept inside the dashboard.
 */
export default function BuyerServicesPage() {
  return <ServicesPage basePath="/buyer-dashboard/services" variant="dashboard" />;
}
