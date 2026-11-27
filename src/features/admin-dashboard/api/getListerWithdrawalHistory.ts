import { apiFetch } from "@/src/lib/api/client";
import type { ListerWithdrawalHistory, WithdrawalFilter } from "../types/vouchWithdrawal";

export async function getListerWithdrawalHistory(listerId: string, page: number, status: WithdrawalFilter, signal?: AbortSignal): Promise<ListerWithdrawalHistory> {
  const params = new URLSearchParams({ page: String(page), size: "5", status });
  const response = await apiFetch(`/api/v1/admin/vouch-withdrawals/listers/${encodeURIComponent(listerId)}/history?${params}`, { cache: "no-store", signal });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "Unable to load withdrawal history. Please try again.");
  return data as ListerWithdrawalHistory;
}
