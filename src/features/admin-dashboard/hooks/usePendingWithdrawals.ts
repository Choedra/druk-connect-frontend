import { useQuery } from "@tanstack/react-query";

import { getPendingWithdrawals } from "../api/getPendingWithdrawals";

import type { WithdrawalFilter } from "../types/vouchWithdrawal";
import { useAuthStore } from "@/src/features/auth/store/authStore";

type UsePendingWithdrawalsParams = {
  status?: WithdrawalFilter;
  page?: number;
  size?: number;
};

export function usePendingWithdrawals({
  status = "PENDING",
  page = 1,
  size = 10,
}: UsePendingWithdrawalsParams = {}) {
  const adminId = useAuthStore(state => state.user?.id);
  return useQuery({
    queryKey: ["admin-pending-withdrawals", adminId, status, page, size],
    queryFn: () =>
      getPendingWithdrawals({
        status,
        page,
        size,
      }),
    enabled: !!adminId,
  });
}
