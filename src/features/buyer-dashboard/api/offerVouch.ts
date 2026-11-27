import { apiFetch } from "@/src/lib/api/client";

export interface ListerToVouch {
  userId: string;
  name: string;
  profileImageUrl: string | null;
  location: string | null;
  email: string | null;
  activeVouches: number;
  alreadyVouched: boolean;
  requestPending: boolean;
}
interface OfferedVouch {
  vouchId: string;
  listerUserId: string;
  listerName: string;
  vouchedAt: string;
  alreadyVouched: boolean;
  message: string;
}
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await apiFetch(`/api/v1/buyer/vouches${path}`, { ...options, cache: "no-store" });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "Unable to complete this vouch. Please try again.");
  return data as T;
}
export const searchListersToVouch = (query: string, signal?: AbortSignal) => request<ListerToVouch[]>(`/listers/search?${new URLSearchParams({ query })}`, { signal });
export const offerVouch = (listerId: string) => request<OfferedVouch>(`/listers/${encodeURIComponent(listerId)}`, { method: "POST" });
