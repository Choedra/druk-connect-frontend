import { apiFetch } from "@/src/lib/api/client";
import type { ScamReportFilter, ScamReporterHistoryResponse } from "../types/scamReport";

export async function getScamReporterHistory(reporterId: string, page: number, status: ScamReportFilter, signal?: AbortSignal): Promise<ScamReporterHistoryResponse> {
  const params = new URLSearchParams({ page: String(page), size: "5" });
  if (status !== "ALL") params.set("status", status);
  const response = await apiFetch(`/api/v1/admin/lister-scam/reporters/${encodeURIComponent(reporterId)}/history?${params}`, { cache: "no-store", signal });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "Unable to load reporter history. Please try again.");
  return data as ScamReporterHistoryResponse;
}
