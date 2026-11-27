import { VouchUserSearchResponse } from "../types/vouches";

export async function searchVouchUsers(
  userId: string,
  query: string,
): Promise<VouchUserSearchResponse[]> {
  const params = new URLSearchParams({
    query,
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/vouch-requests/users/${userId}/search?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    },
  );

  if (!res.ok) {
    const text = await res.text();

    throw new Error(text || "Failed to search members");
  }

  return res.json();
}
