import { apiFetch } from "@/src/lib/api/client";
import { useAuthStore } from "@/src/features/auth/store/authStore";
import type { LoginUser } from "@/src/features/auth/types/login";

export interface Profile extends LoginUser {
  bio: string | null;
  location: string | null;
  profileImageUrl: string | null;
  showEmail: boolean;
  showPhoneNumber: boolean;
}
export interface ContactChallenge {
  challengeId: string;
  maskedDestination: string;
  expiresAt: string;
  resendAfterSeconds: number;
  message: string;
}
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await apiFetch(`/api/v1/users/me${path}`, { ...options, cache: "no-store" });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "Unable to save your changes. Please try again.");
  return data as T;
}
export function syncProfile(profile: Profile) {
  useAuthStore.getState().updateUser(profile);
  return profile;
}
const json = (method: string, body: unknown): RequestInit => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
export const getProfile = () => request<Profile>("/profile").then(syncProfile);
export const saveProfile = (body: Pick<Profile, "firstName" | "lastName" | "bio" | "location">) => request<Profile>("/profile", json("PATCH", body)).then(syncProfile);
export const savePrivacy = (body: Pick<Profile, "showEmail" | "showPhoneNumber">) => request<Profile>("/privacy", json("PATCH", body)).then(syncProfile);
export const uploadPhoto = (image: File) => {
  const form = new FormData();
  form.append("image", image);
  return request<Profile>("/profile-image", { method: "PUT", body: form }).then(syncProfile);
};
export const removePhoto = () => request<Profile>("/profile-image", { method: "DELETE" }).then(syncProfile);
export const startContactChange = (channel: "EMAIL" | "PHONE", destination: string, currentPassword: string) => request<ContactChallenge>("/contact-changes", json("POST", { channel, destination, currentPassword }));
export const verifyContactChange = (challengeId: string, otp: string) => request<Profile>("/contact-changes/verify", json("POST", { challengeId, otp })).then(syncProfile);
