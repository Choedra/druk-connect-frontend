"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useAuthStore } from "@/src/features/auth/store/authStore";
import { getListerWithdrawalHistory } from "../api/getListerWithdrawalHistory";
import type { WithdrawalFilter } from "../types/vouchWithdrawal";

function date(value: string) {
  return new Intl.DateTimeFormat("en-AU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
const button = "rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-ink hover:bg-canvas disabled:opacity-40";

export function ListerWithdrawalHistoryPanel({ listerId, currentRequestId, onClose }: { listerId: string; currentRequestId: string; onClose: () => void }) {
  const adminId = useAuthStore(state => state.user?.id);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<WithdrawalFilter>("ALL");
  const result = useQuery({
    queryKey: ["admin-withdrawal-history", adminId, listerId, status, page],
    queryFn: ({ signal }) => getListerWithdrawalHistory(listerId, page, status, signal),
    enabled: !!adminId,
    staleTime: 0,
    gcTime: 0,
  });
  const data = result.data;
  return <section aria-label="Lister withdrawal history" className="space-y-5 rounded-xl border border-sky/25 bg-canvas p-5">
    <div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-ink">Withdrawal history{data ? ` · ${data.listerName}` : ""}</h3><p className="mt-1 text-xs leading-5 text-muted">All vouch withdrawal requests for this lister, including the current request. Multiple requests from the same buyer count as one distinct person.</p></div><button type="button" className="rounded p-1 text-muted hover:bg-white" aria-label="Close withdrawal history" onClick={onClose}><X className="h-4 w-4" /></button></div>
    {result.isPending && <p role="status" className="text-sm text-muted">Loading withdrawal history…</p>}
    {result.isError && <div role="alert" className="rounded-lg border border-danger/20 bg-danger-tint p-4 text-sm text-danger"><p>{result.error.message}</p><button type="button" className="mt-2 underline" onClick={() => void result.refetch()}>Try again</button></div>}
    {data && !result.isError && <>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-5">{[["Total requests",data.totalRequests],["Distinct people",data.uniqueRequesters],["Pending",data.pendingRequests],["Approved",data.approvedRequests],["Rejected",data.rejectedRequests]].map(([label,count]) => <div key={label} className="rounded-lg border border-line bg-white p-3"><dt className="text-xs text-muted">{label}</dt><dd className="mt-1 text-xl font-bold text-ink">{count}</dd></div>)}</dl>
      <p className="text-xs text-muted">{data.firstRequestedAt ? `First request: ${date(data.firstRequestedAt)}` : "No withdrawal requests"}{data.lastRequestedAt ? ` · Most recent: ${date(data.lastRequestedAt)}` : ""}</p>
      <label className="flex flex-wrap items-center gap-3 text-xs font-medium text-ink">History status<select value={status} onChange={event => { setStatus(event.target.value as WithdrawalFilter); setPage(1); }} className="rounded-lg border border-line bg-white px-3 py-2"><option value="ALL">All requests</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select></label>
      <div className="divide-y divide-line rounded-lg border border-line bg-white">{data.history.requests.map(request => <article key={request.withdrawalRequestId} className="space-y-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h4 className="text-sm font-semibold text-ink">{request.buyerName}</h4><p className="mt-1 text-xs text-muted">{[request.buyerEmail || "Email private",request.buyerPhoneNumber || "Phone number private"].join(" · ")}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${request.status === "APPROVED" ? "bg-green-100 text-green-800" : request.status === "REJECTED" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{request.status}</span></div>
        {request.withdrawalRequestId === currentRequestId && <p className="text-xs font-semibold text-sky">Current request</p>}
        <p className="text-xs text-muted">Requested {date(request.requestedAt)} · Vouched {date(request.vouchedAt)}</p>
        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-ink">{request.reason}</p>
        {request.moderatedAt && <div className="border-t border-line pt-3"><p className="text-xs text-muted">Reviewed {date(request.moderatedAt)}</p><p className="mt-1 whitespace-pre-wrap break-words text-sm text-ink">{request.adminReason || "No admin reason recorded."}</p></div>}
      </article>)}{data.history.requests.length === 0 && <p className="p-5 text-sm text-muted">No requests match this status.</p>}</div>
      {data.history.totalPages > 1 && <nav aria-label="Withdrawal history pages" className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted">Page {data.history.currentPage} of {data.history.totalPages} · {data.history.totalElements} requests</span><div className="flex gap-2"><button type="button" className={button} disabled={!data.history.hasPrevious || result.isFetching} onClick={() => setPage(data.history.currentPage-1)}>Previous</button><button type="button" className={button} disabled={!data.history.hasNext || result.isFetching} onClick={() => setPage(data.history.currentPage+1)}>Next</button></div></nav>}
    </>}
  </section>;
}
