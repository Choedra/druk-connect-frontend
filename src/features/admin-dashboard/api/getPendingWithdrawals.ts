import { apiFetch } from "@/src/lib/api/client";
import type { PendingVouchWithdrawalsResponse, WithdrawalFilter } from "../types/vouchWithdrawal";

type GetPendingWithdrawalsParams = {
  status?: WithdrawalFilter;
  page?: number;
  size?: number;
};

export async function getPendingWithdrawals({
  status = "PENDING",
  page = 1,
  size = 10,
}: GetPendingWithdrawalsParams = {}): Promise<PendingVouchWithdrawalsResponse> {
  const searchParams = new URLSearchParams({
    status,
    page: String(page),
    size: String(size),
  });

  const response = await apiFetch(
    `/api/v1/admin/vouch-withdrawals?${searchParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Unable to load vouch withdrawals.");
  }

  return response.json();
}
