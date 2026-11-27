"use client";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getServiceAvailmentHistory,
  sendReviewRequest,
} from "../../reviews/api/reviewRequests";
import { useAuthStore } from "../../auth/store/authStore";
import { PageHeader, buttonSecondary } from "@/src/shared/dashboard/PageHeader";
import { RefreshCw } from "lucide-react";

export function ServiceAvailedHistory() {
  const [page, setPage] = useState(1);
  const [requested, setRequested] = useState<string[]>([]);
  const client = useQueryClient();
  const invitation = useMutation({
    mutationFn: (record: {
      listingId: string;
      buyerUserId: string;
      availmentId: string;
    }) => sendReviewRequest(record.listingId, record.buyerUserId),
    onSuccess: (_response, record) => {
      setRequested((current) => [...new Set([...current, record.availmentId])]);
      void client.invalidateQueries({
        queryKey: ["review-recipients", record.listingId],
      });
    },
  });
  const user = useAuthStore((state) => state.user);
  const buyer = user?.accessType === "BUYER";
  const history = useQuery({
    queryKey: ["service-availed-history", user?.id, page],
    queryFn: () => getServiceAvailmentHistory(page),
    enabled: Boolean(user),
    retry: false,
    refetchInterval: 10000,
  });
  return (
    <section className="space-y-6">
      <PageHeader
        title="Service Availed History"
        description={
          buyer
            ? "Services marked as availed for your account by their providers."
            : "Services you have marked as availed by Buyers."
        }
        actions={
          <button
            type="button"
            disabled={history.isFetching}
            onClick={() => {
              void history.refetch();
            }}
            className={buttonSecondary}
          >
            <RefreshCw className={`h-4 w-4 ${history.isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
            {history.isFetching ? "Refreshing…" : "Refresh history"}
          </button>
        }
      />
      {invitation.isSuccess && (
        <p role="status" className="rounded-md bg-brand-tint p-4">
          {invitation.data.message} Sent to {invitation.data.buyerName}.
        </p>
      )}
      {invitation.error && (
        <p role="alert" className="rounded-md bg-danger-tint p-4 text-danger">
          {invitation.error.message}
        </p>
      )}
      {history.isPending && <p role="status">Loading history…</p>}
      {history.error && (
        <p role="alert" className="rounded-md bg-danger-tint p-4 text-danger">
          {history.error.message}
        </p>
      )}
      {history.data?.availments?.length === 0 && (
        <div className="rounded-md border border-line bg-surface p-8 text-muted">
          No services have been marked as availed yet.
        </div>
      )}
      <div className="space-y-4">
        {history.data?.availments?.map((record) => (
          <article
            key={record.availmentId}
            className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-line bg-surface p-5"
          >
            <div>
              <h2 className="font-serif text-xl text-ink">
                {record.listingTitle}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {buyer
                  ? `Provider: ${record.listerName}`
                  : `Buyer: ${record.buyerName}`}
              </p>
              <p className="mt-1 text-sm text-muted">
                Marked as availed on{" "}
                {new Date(record.availedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold text-brand">
                Availed
              </span>
              {record.listingStatus === "ACTIVE" && (
                <Link
                  href={
                    buyer
                      ? `/buyer-dashboard/services/${record.listingId}`
                      : `/services/${record.listingId}`
                  }
                  className="text-sm text-brand underline"
                >
                  View service
                </Link>
              )}
              {buyer &&
                record.listingStatus === "ACTIVE" &&
                !record.alreadyReviewed && (
                  <Link
                    href={`/buyer-dashboard/services/${record.listingId}?review=true`}
                    className="rounded-md bg-brand px-4 py-2 text-sm text-white"
                  >
                    Leave a review
                  </Link>
                )}
              {!buyer &&
                record.listingStatus === "ACTIVE" &&
                !record.alreadyReviewed && (
                  <button
                    type="button"
                    disabled={invitation.isPending}
                    onClick={() => invitation.mutate(record)}
                    className="rounded-md bg-brand px-4 py-2 text-sm text-white disabled:opacity-50"
                  >
                    {invitation.isPending && invitation.variables?.availmentId === record.availmentId
                      ? "Sending…"
                      : requested.includes(record.availmentId)
                        ? "Send review reminder"
                        : "Request Review"}
                  </button>
                )}
              {record.alreadyReviewed && (
                <span className="text-sm text-muted">Review submitted</span>
              )}
              {record.listingStatus !== "ACTIVE" && (
                <span className="text-sm text-muted">
                  Service is no longer active
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
      {history.data && history.data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            disabled={!history.data.hasPrevious || history.isFetching}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {history.data.currentPage} of {history.data.totalPages}
          </span>
          <button
            disabled={!history.data.hasNext || history.isFetching}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
