"use client";

import { useState } from "react";

import type {
  ModerateVouchWithdrawalAction,
  PendingVouchWithdrawal,
} from "../types/vouchWithdrawal";
import ModerateVouchWithdrawalModal from "./ModerateVouchWithdrawalModal";

type AdminVouchWithdrawalTableProps = {
  requests: PendingVouchWithdrawal[];
  isSubmitting: boolean;
  error: string | null;
  onModerate: (
    request: PendingVouchWithdrawal,
    action: ModerateVouchWithdrawalAction,
    reason: string,
  ) => Promise<void>;
};

export default function AdminVouchWithdrawalTable({
  requests,
  isSubmitting,
  error,
  onModerate,
}: AdminVouchWithdrawalTableProps) {
  const [selectedRequest, setSelectedRequest] =
    useState<PendingVouchWithdrawal | null>(null);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setSelectedRequest(null);
  };

  const handleSubmit = async (
    action: ModerateVouchWithdrawalAction,
    reason: string,
  ) => {
    if (!selectedRequest) {
      return;
    }

    await onModerate(selectedRequest, action, reason);

    setSelectedRequest(null);
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-line bg-canvas">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Buyer
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Lister
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Reason
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Requested
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line">
              {requests.map((request) => (
                <WithdrawalRow
                  key={request.withdrawalRequestId}
                  request={request}
                  isSubmitting={isSubmitting}
                  onReview={() => setSelectedRequest(request)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <ModerateVouchWithdrawalModal
          request={selectedRequest}
          isSubmitting={isSubmitting}
          error={error}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}

type WithdrawalRowProps = {
  request: PendingVouchWithdrawal;
  isSubmitting: boolean;
  onReview: () => void;
};

function WithdrawalRow({
  request,
  isSubmitting,
  onReview,
}: WithdrawalRowProps) {
  return (
    <tr className="transition-colors hover:bg-canvas">
      <td className="px-5 py-4">
        <div>
          <p className="font-medium text-ink">{request.buyerName}</p>

          <p className="mt-1 text-sm text-muted">{request.buyerEmail}</p>

          <p className="mt-0.5 text-sm text-muted">
            {request.buyerPhoneNumber}
          </p>
        </div>
      </td>

      <td className="px-5 py-4">
        <div>
          <p className="font-medium text-ink">{request.listerName}</p>

          <p className="mt-1 text-sm text-muted">{request.listerEmail}</p>

          <p className="mt-0.5 text-sm text-muted">
            {request.listerPhoneNumber}
          </p>
        </div>
      </td>

      <td className="max-w-[300px] px-5 py-4">
        <p className="line-clamp-3 text-sm text-muted">{request.reason}</p>
      </td>

      <td className="whitespace-nowrap px-5 py-4 text-sm text-muted">
        {formatDate(request.requestedAt)}
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={request.status} />
      </td>

      <td className="px-5 py-4 text-right">
        <button
          type="button"
          onClick={onReview}
          disabled={isSubmitting}
          className="rounded-lg border border-sky/30 px-4 py-2 text-sm font-semibold text-sky transition-colors hover:bg-sky-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          Review
        </button>
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
      {formatStatus(status)}
    </span>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
