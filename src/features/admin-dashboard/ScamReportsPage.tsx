"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ReporterHistoryPanel } from "./ui/ReporterHistoryPanel";
import { useState, type FormEvent } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShieldAlert,
  X,
} from "lucide-react";

import { usePendingScamReports } from "./hooks/usePendingScamReports";
import { useModerateScamReport } from "./hooks/useModerateScamReport";
import type { ScamReport, ScamModerationAction, ScamReportFilter } from "./types/scamReport";
import { PageHeader, buttonSecondary } from "@/src/shared/dashboard/PageHeader";

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function ScamReportsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ScamReportFilter>("PENDING");
  const [historyReportId, setHistoryReportId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const pageSize = 10;

  const { data, isPending, isError, error, refetch, isFetching } =
    usePendingScamReports(page, pageSize, statusFilter);

  const moderationMutation = useModerateScamReport();

  const [selectedReport, setSelectedReport] = useState<ScamReport | null>(null);

  const [moderationAction, setModerationAction] =
    useState<ScamModerationAction | null>(null);

  const [moderationReason, setModerationReason] = useState("");
  const [moderationNotice, setModerationNotice] = useState("");

  function openModerationModal(
    report: ScamReport,
    action: ScamModerationAction,
  ) {
    moderationMutation.reset();
    setModerationNotice("");
    setSelectedReport(report);
    setModerationAction(action);
    setModerationReason("");
  }

  function closeModerationModal() {
    if (moderationMutation.isPending) return;

    setSelectedReport(null);
    setModerationAction(null);
    setModerationReason("");
    moderationMutation.reset();
  }

  async function handleModerationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedReport || !moderationAction) return;

    const reason = moderationReason.trim();

    if (!reason) return;

    try {
      const result = await moderationMutation.mutateAsync({
        reportId: selectedReport.reportId,
        payload: {
          action: moderationAction,
          reason,
        },
      });

      setPage(1);
      setModerationNotice(
        result.message ??
          `Report ${
            moderationAction === "APPROVE" ? "approved" : "rejected"
          } successfully.`,
      );

      setSelectedReport(null);
      setModerationAction(null);
      setModerationReason("");
    } catch {
      // The mutation error is displayed inside the modal.
    }
  }

  return (
    <div>
      <div className="space-y-8">
        <PageHeader
          title="Scam reports"
          description="Review suspicious listings reported by the community."
          actions={
            <button type="button" onClick={() => void queryClient.invalidateQueries({ queryKey: ["admin", "scam-reports"] })} disabled={isFetching} className={buttonSecondary}>
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
              Refresh reports
            </button>
          }
        />

        {/* Moderation success notification */}
        {moderationNotice && (
          <div
            role="status"
            className="flex items-start justify-between gap-3
              rounded-lg border border-green-200 bg-green-50 p-4
              text-sm text-green-800"
          >
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{moderationNotice}</p>
            </div>

            <button
              type="button"
              onClick={() => setModerationNotice("")}
              aria-label="Dismiss notification"
              className="rounded p-1 hover:bg-green-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Summary cards */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="text-sm font-medium text-muted">{statusFilter === "ALL" ? "All reports" : `${statusFilter.charAt(0)}${statusFilter.slice(1).toLowerCase()} reports`}</p>

            <p className="mt-2 text-3xl font-bold text-ink">
              {isPending || isError ? "—" : (data?.totalElements ?? 0)}
            </p>

            <p className="mt-1 text-xs text-muted">{statusFilter === "PENDING" ? "Reports awaiting review" : "Reports matching this status"}</p>
          </div>

          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="text-sm font-medium text-muted">Current page</p>

            <p className="mt-2 text-3xl font-bold text-ink">
              {isPending || isError ? "—" : (data?.currentPage ?? page)}
            </p>

            <p className="mt-1 text-xs text-muted">
              {pageSize} reports per page
            </p>
          </div>
        </section>

        <label className="flex flex-wrap items-center gap-3 text-sm font-medium text-ink">
          Report status
          <select value={statusFilter} onChange={event => { setStatusFilter(event.target.value as ScamReportFilter); setPage(1); setHistoryReportId(null); }} className="rounded-lg border border-line bg-surface px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand/40">
            <option value="ALL">All reports</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </label>

        {/* Reports list */}
        <section className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">
                {statusFilter === "PENDING" ? "Reports awaiting review" : "Scam report history"}
              </h2>

              <p className="mt-1 text-sm text-muted">
                Review each report before making a moderation decision.
              </p>
            </div>

            <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              {statusFilter}
            </span>
          </div>

          {/* Loading state */}
          {isPending && (
            <div className="space-y-4 p-5" aria-label="Loading reports">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-lg bg-background"
                />
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="p-10 text-center">
              <AlertTriangle className="mx-auto h-9 w-9 text-danger" />

              <h3 className="mt-3 font-semibold text-ink">
                Unable to load reports
              </h3>

              <p className="mt-2 text-sm text-muted">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong. Please try again."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 rounded-lg bg-brand px-4 py-2.5
                  text-sm font-semibold text-ink hover:opacity-90"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isPending && !isError && data?.reports.length === 0 && (
            <div className="p-12 text-center">
              <ShieldAlert className="mx-auto h-10 w-10 text-muted" />

              <h3 className="mt-3 font-semibold text-ink">
                No {statusFilter === "ALL" ? "scam" : statusFilter.toLowerCase()} reports
              </h3>

              <p className="mt-2 text-sm text-muted">
                There are no scam reports matching this status.
              </p>
            </div>
          )}

          {/* Report cards */}
          {!isPending && !isError && data && data.reports.length > 0 && (
            <>
              <div className="divide-y divide-line">
                {data.reports.map((report) => (
                  <article
                    key={report.reportId}
                    className="space-y-5 p-5 transition-colors
                        hover:bg-background/50 sm:p-6"
                  >
                    {/* Listing and lister */}
                    <div
                      className="flex flex-col gap-3 sm:flex-row
                        sm:items-start sm:justify-between"
                    >
                      <div className="min-w-0">
                        <h3 className="break-words text-base font-semibold text-ink">
                          {report.sourceListingTitle}
                        </h3>

                        <p className="mt-1 text-sm text-muted">
                          Reported lister:{" "}
                          <span className="font-medium text-ink">
                            {report.reportedListerName}
                          </span>
                        </p>
                      </div>

                      <span
                        className="w-fit shrink-0 rounded-full
                          bg-amber-100 px-3 py-1 text-xs font-semibold
                          text-amber-800"
                      >
                        {report.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-background p-4">
                      <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Reported by</p><p className="mt-1 text-sm font-semibold text-ink">{report.reporterName || "Community member"}</p><p className="mt-1 text-xs text-muted">{report.reporterReportCount ?? "—"} reports submitted across all listings</p></div>
                      <button type="button" aria-expanded={historyReportId === report.reportId} onClick={() => setHistoryReportId(historyReportId === report.reportId ? null : report.reportId)} className={buttonSecondary}>{historyReportId === report.reportId ? "Hide reporter history" : "View reporter history"}</button>
                    </div>
                    {historyReportId === report.reportId && <ReporterHistoryPanel key={report.reporterUserId} reporterId={report.reporterUserId} currentReportId={report.reportId} onClose={() => setHistoryReportId(null)} />}

                    {/* Reason and date */}
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <p
                          className="text-xs font-semibold uppercase
                            tracking-wide text-muted"
                        >
                          Report reason
                        </p>

                        <p className="mt-2 text-sm font-medium text-ink">
                          {report.reason}
                        </p>
                      </div>

                      <div>
                        <p
                          className="text-xs font-semibold uppercase
                            tracking-wide text-muted"
                        >
                          Reported on
                        </p>

                        <p className="mt-2 text-sm text-ink">
                          {formatDate(report.reportedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div
                      className="rounded-lg border border-line
                        bg-background p-4"
                    >
                      <p
                        className="text-xs font-semibold uppercase
                          tracking-wide text-muted"
                      >
                        Additional details
                      </p>

                      <p
                        className="mt-2 whitespace-pre-wrap
                          break-words text-sm leading-6 text-ink"
                      >
                        {report.details || "No additional details provided."}
                      </p>
                    </div>

                    {/* IDs */}
                    <div
                      className="flex flex-col gap-2 border-t
                        border-line pt-4 text-xs text-muted
                        sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="break-all">
                        Report ID: {report.reportId}
                      </span>

                      <span className="break-all">
                        Listing ID: {report.sourceListingId}
                      </span>
                    </div>

                    {report.status !== "PENDING" && <div className="rounded-lg border border-line p-4 text-sm text-muted"><p>Reviewed {report.moderatedAt ? formatDate(report.moderatedAt) : "previously"}</p><p className="mt-2 whitespace-pre-wrap break-words text-ink">{report.moderationReason || "No moderation reason recorded."}</p></div>}
                    {report.status === "PENDING" && <>
                    {/* Moderation actions */}
                    <div
                      className="flex flex-col gap-3 border-t
                        border-line pt-4 sm:flex-row sm:justify-end"
                    >
                      <button
                        type="button"
                        onClick={() => openModerationModal(report, "REJECT")}
                        disabled={moderationMutation.isPending}
                        className="rounded-lg border border-line px-4
                            py-2.5 text-sm font-semibold text-danger
                            transition hover:bg-background
                            disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reject report
                      </button>

                      <button
                        type="button"
                        onClick={() => openModerationModal(report, "APPROVE")}
                        disabled={moderationMutation.isPending}
                        className="rounded-lg bg-brand px-4 py-2.5
                            text-sm font-semibold text-ink transition
                            hover:opacity-90 disabled:cursor-not-allowed
                            disabled:opacity-50"
                      >
                        Approve report
                      </button>
                    </div>
                    </>}
                  </article>
                ))}
              </div>

              {/* Pagination */}
              <footer
                className="flex flex-col gap-4 border-t border-line
                  p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-sm text-muted">
                  Showing {(data.currentPage - 1) * data.pageSize + 1}–
                  {Math.min(
                    data.currentPage * data.pageSize,
                    data.totalElements,
                  )}{" "}
                  of {data.totalElements} reports
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={!data.hasPrevious || isFetching}
                    onClick={() => setPage(data.currentPage - 1)}
                    className="inline-flex items-center gap-1 rounded-lg
                        border border-line px-3 py-2 text-sm font-medium
                        text-ink transition hover:bg-background
                        disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <span className="whitespace-nowrap text-sm text-muted">
                    {data.currentPage} / {data.totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={!data.hasNext || isFetching}
                    onClick={() => setPage(data.currentPage + 1)}
                    className="inline-flex items-center gap-1 rounded-lg
                        border border-line px-3 py-2 text-sm font-medium
                        text-ink transition hover:bg-background
                        disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </footer>
            </>
          )}
        </section>

        {/* Moderation confirmation modal */}
        {selectedReport && moderationAction && (
          <div
            className="fixed inset-0 z-50 flex items-center
              justify-center bg-black/50 p-4"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeModerationModal();
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="moderation-title"
              className="w-full max-w-lg rounded-xl bg-surface p-6 shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="moderation-title"
                    className="text-xl font-bold text-ink"
                  >
                    {moderationAction === "APPROVE"
                      ? "Approve scam report?"
                      : "Reject scam report?"}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    Listing:{" "}
                    <span className="font-medium text-ink">
                      {selectedReport.sourceListingTitle}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModerationModal}
                  disabled={moderationMutation.isPending}
                  aria-label="Close moderation modal"
                  className="rounded-md p-2 text-muted
                    hover:bg-background disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={handleModerationSubmit}
                className="mt-5 space-y-4"
              >
                <div>
                  <label
                    htmlFor="moderation-reason"
                    className="mb-2 block text-sm font-medium text-ink"
                  >
                    Moderation reason
                  </label>

                  <textarea
                    id="moderation-reason"
                    value={moderationReason}
                    onChange={(event) =>
                      setModerationReason(event.target.value)
                    }
                    placeholder={
                      moderationAction === "APPROVE"
                        ? "Explain why the report was verified..."
                        : "Explain why the report is being rejected..."
                    }
                    rows={4}
                    maxLength={1000}
                    required
                    disabled={moderationMutation.isPending}
                    className="w-full rounded-lg border border-line
                      bg-background px-3 py-3 text-sm text-ink
                      outline-none focus:ring-2 focus:ring-brand/40
                      disabled:opacity-60"
                  />

                  <p className="mt-1 text-right text-xs text-muted">
                    {moderationReason.length}/1000 characters
                  </p>
                </div>

                {moderationMutation.isError && (
                  <p
                    role="alert"
                    className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                  >
                    {moderationMutation.error instanceof Error
                      ? moderationMutation.error.message
                      : "Moderation failed. Please try again."}
                  </p>
                )}

                <div
                  className="flex flex-col-reverse gap-3 sm:flex-row
                  sm:justify-end"
                >
                  <button
                    type="button"
                    onClick={closeModerationModal}
                    disabled={moderationMutation.isPending}
                    className="rounded-lg border border-line px-4
                      py-2.5 text-sm font-medium text-ink
                      hover:bg-background disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      moderationMutation.isPending || !moderationReason.trim()
                    }
                    className={`rounded-lg px-4 py-2.5 text-sm
                      font-semibold text-white disabled:cursor-not-allowed
                      disabled:opacity-50 ${
                        moderationAction === "APPROVE"
                          ? "bg-green-700 hover:bg-green-800"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                  >
                    {moderationMutation.isPending
                      ? "Submitting..."
                      : moderationAction === "APPROVE"
                        ? "Confirm approval"
                        : "Confirm rejection"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
