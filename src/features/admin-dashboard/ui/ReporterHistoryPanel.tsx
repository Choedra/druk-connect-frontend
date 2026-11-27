"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useAuthStore } from "@/src/features/auth/store/authStore";
import { getScamReporterHistory } from "../api/getScamReporterHistory";
import type { ScamReportFilter } from "../types/scamReport";

function date(value: string) {
  return new Intl.DateTimeFormat("en-AU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
const button = "rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink hover:bg-background disabled:opacity-40";

export function ReporterHistoryPanel({ reporterId, currentReportId, onClose }: { reporterId: string; currentReportId: string; onClose: () => void }) {
  const adminId = useAuthStore(state => state.user?.id);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ScamReportFilter>("ALL");
  const result = useQuery({
    queryKey: ["admin", "scam-reports", "reporter-history", adminId, reporterId, status, page],
    queryFn: ({ signal }) => getScamReporterHistory(reporterId, page, status, signal),
    enabled: !!adminId,
    staleTime: 0,
    gcTime: 0,
  });
  const data = result.data;
  return <section aria-label="Reporter history" className="space-y-5 rounded-xl border border-brand/25 bg-background p-5">
    <div className="flex items-start justify-between gap-4"><div><h4 className="font-semibold text-ink">Reporter history{data ? ` · ${data.reporterName}` : ""}</h4><p className="mt-1 text-xs leading-5 text-muted">All reports submitted by this member, including the current report.</p></div><button type="button" aria-label="Close reporter history" className="rounded p-1 text-muted hover:bg-surface" onClick={onClose}><X className="h-4 w-4" /></button></div>
    {result.isPending && <p role="status" className="text-sm text-muted">Loading reporter history…</p>}
    {result.isError && <div role="alert" className="rounded-lg border border-danger/20 bg-danger-tint p-4 text-sm text-danger"><p>{result.error.message}</p><button type="button" className="mt-2 underline" onClick={() => void result.refetch()}>Try again</button></div>}
    {data && !result.isError && <>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Total submitted", data.totalReports], ["Pending", data.pendingReports], ["Approved", data.approvedReports], ["Rejected", data.rejectedReports]].map(([label, count]) => <div key={label} className="rounded-lg border border-line bg-surface p-3"><dt className="text-xs text-muted">{label}</dt><dd className="mt-1 text-xl font-bold text-ink">{count}</dd></div>)}</dl>
      <p className="text-xs text-muted">{data.firstReportedAt ? `First report: ${date(data.firstReportedAt)}` : "No reports submitted"}{data.lastReportedAt ? ` · Most recent: ${date(data.lastReportedAt)}` : ""}</p>
      <label className="flex flex-wrap items-center gap-3 text-xs font-medium text-ink">History status<select value={status} onChange={event => { setStatus(event.target.value as ScamReportFilter); setPage(1); }} className="rounded-lg border border-line bg-surface px-3 py-2"><option value="ALL">All reports</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select></label>
      <div className="divide-y divide-line rounded-lg border border-line bg-surface">{data.history.reports.map(report => <article key={report.reportId} className="space-y-3 p-4">
        <div className="flex flex-wrap justify-between gap-3"><div><h5 className="text-sm font-semibold text-ink">{report.sourceListingTitle}</h5><p className="mt-1 text-xs text-muted">Reported lister: {report.reportedListerName}</p></div><span className={`h-fit rounded-full px-2.5 py-1 text-xs font-semibold ${report.status === "APPROVED" ? "bg-green-100 text-green-800" : report.status === "REJECTED" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{report.status}</span></div>
        {report.reportId === currentReportId && <p className="text-xs font-semibold text-brand">Current report</p>}
        <p className="text-xs text-muted">Submitted {date(report.reportedAt)}</p>
        <p className="break-words text-sm font-medium text-ink">{report.reason}</p>
        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-muted">{report.details || "No additional details provided."}</p>
        {report.moderatedAt && <div className="border-t border-line pt-3"><p className="text-xs text-muted">Reviewed {date(report.moderatedAt)}</p><p className="mt-1 whitespace-pre-wrap break-words text-sm text-ink">{report.moderationReason || "No moderation reason recorded."}</p></div>}
      </article>)}{data.history.reports.length === 0 && <p className="p-5 text-sm text-muted">No reports match this status.</p>}</div>
      {data.history.totalPages > 1 && <nav aria-label="Reporter history pages" className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted">Page {data.history.currentPage} of {data.history.totalPages} · {data.history.totalElements} reports</span><div className="flex gap-2"><button type="button" className={button} disabled={!data.history.hasPrevious || result.isFetching} onClick={() => setPage(data.history.currentPage - 1)}>Previous</button><button type="button" className={button} disabled={!data.history.hasNext || result.isFetching} onClick={() => setPage(data.history.currentPage + 1)}>Next</button></div></nav>}
    </>}
  </section>;
}
