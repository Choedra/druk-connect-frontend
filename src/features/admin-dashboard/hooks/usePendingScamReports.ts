import { useQuery } from "@tanstack/react-query";
import { getPendingScamReports } from "../api/getPendingScamReports";

import type { ScamReportFilter } from "../types/scamReport";

export function usePendingScamReports(page: number, size: number = 10, status: ScamReportFilter = "PENDING") {
  return useQuery({
    queryKey: ["admin", "scam-reports", status, page, size],
    queryFn: () =>
      getPendingScamReports({
        status,
        page,
        size,
      }),
    staleTime: 30_000,
    retry: 1,
  });
}
