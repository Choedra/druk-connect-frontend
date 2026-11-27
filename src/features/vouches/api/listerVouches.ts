import { apiFetch } from "@/src/lib/api/client";

export interface VoucherProfile {
  userId: string;
  name: string;
  profileImageUrl: string | null;
  location: string | null;
  bio: string | null;
  email: string | null;
  phoneNumber: string | null;
}
export interface ReceivedVouch {
  vouchId: string;
  member: VoucherProfile;
  vouchedAt: string;
}
export interface SentVouchRequest {
  requestId: string;
  memberName: string;
  profileImageUrl: string | null;
  status: string;
  requestedAt: string;
  respondedAt: string | null;
}
export interface VouchCandidate {
  userId: string;
  name: string;
  profileImageUrl: string | null;
  location: string | null;
  email: string | null;
  alreadyVouched: boolean;
  requestPending: boolean;
}
export interface VouchPage<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await apiFetch(`/api/v1/lister/vouches${path}`, { ...options, cache: "no-store" });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "Unable to load vouches. Please try again.");
  return data as T;
}
export const getReceivedVouches = (page: number) => request<VouchPage<ReceivedVouch>>(`?page=${page}`);
export const getSentVouchRequests = (page: number) => request<VouchPage<SentVouchRequest>>(`/requests?page=${page}`);
export const getVoucherProfile = (id: string) => request<VoucherProfile>(`/members/${encodeURIComponent(id)}`);
export const searchVouchCandidates = (query: string, signal?: AbortSignal) => request<VouchCandidate[]>(`/members/search?${new URLSearchParams({ query })}`, { signal });
export const createVouchRequest = (targetUserId: string, message: string) => request<unknown>("/requests", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ targetUserId, message }),
});
