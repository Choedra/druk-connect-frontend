"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/src/features/auth/store/authStore";
import { ProfileAvatar } from "@/src/features/profile/ProfileAvatar";
import { VoucherTermsNotice } from "@/src/features/legal/VoucherTermsNotice";
import { offerVouch, searchListersToVouch, type ListerToVouch } from "../api/offerVouch";

const button = "min-h-10 rounded-md border border-sky/30 px-4 py-2 text-sm font-semibold text-sky transition hover:bg-sky-soft disabled:cursor-not-allowed disabled:opacity-50";

export function OfferVouchPanel() {
  const buyerId = useAuthStore(state => state.user?.id);
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ListerToVouch | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);
  const listers = useQuery({
    queryKey: ["buyer-vouch-listers", buyerId, query],
    queryFn: ({ signal }) => searchListersToVouch(query, signal),
    enabled: !!buyerId && query.length >= 2,
    staleTime: 0,
  });
  const give = useMutation({ mutationFn: offerVouch, onSuccess: () => {
    setSelected(null); setConfirmed(false);
    for (const key of ["buyer-vouch-listers", "given-vouches", "incoming-vouch-requests", "lister-vouches", "vouch-count", "buyer-dashboard", "lister-dashboard"]) {
      void client.invalidateQueries({ queryKey: [key] });
    }
  } });
  return <section className="rounded-md border border-line bg-white p-5 sm:p-6">
    <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-sky" /><h2 className="text-lg font-semibold text-ink">Find a lister</h2></div>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">You can vouch for a lister you know without waiting for a request. Two vouches is the minimum for a lister; more community members can also vouch.</p>
    <label className="relative mt-5 block max-w-2xl"><span className="sr-only">Find a lister to vouch for</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input type="search" maxLength={100} value={search} onChange={event => { setSearch(event.target.value); setSelected(null); setConfirmed(false); give.reset(); }} placeholder="Search a lister by name or shared email…" className="h-11 w-full rounded-md border border-line bg-canvas pl-10 pr-4 text-sm outline-none focus:border-sky" /></label>
    {search.trim().length === 1 && <p className="mt-2 text-xs text-muted">Type at least two characters.</p>}
    {give.isSuccess && <p role="status" className="mt-4 rounded-md bg-sky-soft p-3 text-sm text-sky">{give.data.message} {give.data.listerName}</p>}
    {give.isError && <p role="alert" className="mt-4 rounded-md bg-danger-tint p-3 text-sm text-danger">{give.error.message}</p>}
    {query.length >= 2 && search.trim() === query && <div className="mt-4 max-w-2xl">
      {listers.isPending && <p role="status" className="text-sm text-muted">Finding listers…</p>}
      {listers.isError && <div role="alert" className="text-sm text-danger"><p>{listers.error.message}</p><button type="button" className="mt-2 underline" onClick={() => void listers.refetch()}>Try again</button></div>}
      {listers.data?.map(lister => <div key={lister.userId} className="border-b border-line py-4 last:border-0">
        <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><ProfileAvatar name={lister.name} imageUrl={lister.profileImageUrl} className="h-11 w-11 text-sm" /><div className="min-w-0"><h3 className="font-semibold text-ink">{lister.name}</h3><p className="mt-1 break-all text-xs text-muted">{[lister.location,lister.email].filter(Boolean).join(" · ") || "Community lister"}</p><p className="mt-1 text-xs text-muted">{lister.activeVouches} active community vouches</p></div></div>
          <button type="button" className={button} disabled={give.isPending || lister.alreadyVouched} onClick={() => { setSelected(lister); setConfirmed(false); give.reset(); }}>{lister.alreadyVouched ? "Already vouched" : "Vouch for this lister"}</button>
        </div>
        {selected?.userId === lister.userId && !lister.alreadyVouched && <form className="mt-4 space-y-4 rounded-md border border-line bg-canvas p-4" onSubmit={event => { event.preventDefault(); if (confirmed) give.mutate(lister.userId); }}>
          <p className="text-sm font-semibold text-ink">Vouch for {lister.name}?</p>
          {lister.requestPending && <p className="text-xs text-muted">This will also accept their pending vouch request.</p>}
          <label className="flex items-start gap-2.5 text-sm leading-6 text-ink"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} className="mt-1.5 h-4 w-4 shrink-0" required /><span>I know this lister and want to vouch for them.</span></label>
          <VoucherTermsNotice action="giving a vouch" />
          <div className="flex flex-wrap gap-3"><button type="submit" disabled={!confirmed || give.isPending} className={button}>{give.isPending ? "Adding your vouch…" : "Confirm vouch"}</button><button type="button" disabled={give.isPending} className={button} onClick={() => { setSelected(null); setConfirmed(false); }}>Cancel</button></div>
        </form>}
      </div>)}
      {listers.isSuccess && listers.data.length === 0 && <p className="py-4 text-sm text-muted">No listers found. Try another name or shared email.</p>}
    </div>}
  </section>;
}
