export type WithdrawalFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

export type PendingVouchWithdrawal = {
  withdrawalRequestId: string;
  vouchId: string;

  buyerUserId: string;
  buyerName: string;
  buyerEmail: string | null;
  buyerPhoneNumber: string | null;

  listerUserId: string;
  listerName: string;
  listerEmail: string | null;
  listerPhoneNumber: string | null;

  reason: string;

  status: "PENDING" | "APPROVED" | "REJECTED" | string;

  vouchedAt: string;
  requestedAt: string;
  moderatedAt: string | null;
  adminReason: string | null;
  listerRequestCount: number;
  listerUniqueRequesterCount: number;
};

export type PendingVouchWithdrawalsResponse = {
  requests: PendingVouchWithdrawal[];

  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;

  hasNext: boolean;
  hasPrevious: boolean;
};

export type ModerateVouchWithdrawalAction = "APPROVE" | "REJECT";

export type ModerateVouchWithdrawalRequest = {
  action: ModerateVouchWithdrawalAction;
  reason: string;
};

export type ModerateVouchWithdrawalResponse = {
  withdrawalRequestId: string;
  vouchId: string;
  status: "APPROVED" | "REJECTED" | string;
  adminReason: string;
  moderatedAt: string;
  message: string;
};

export type ListerWithdrawalHistory = {
  listerUserId: string;
  listerName: string;
  totalRequests: number;
  uniqueRequesters: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  firstRequestedAt: string | null;
  lastRequestedAt: string | null;
  history: PendingVouchWithdrawalsResponse;
};
