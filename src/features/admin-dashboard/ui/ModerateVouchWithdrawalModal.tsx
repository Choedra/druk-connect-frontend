"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

import type {
  ModerateVouchWithdrawalAction,
  PendingVouchWithdrawal,
} from "../types/vouchWithdrawal";

type ModerateVouchWithdrawalModalProps = {
  request: PendingVouchWithdrawal;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (
    action: ModerateVouchWithdrawalAction,
    reason: string,
  ) => Promise<void>;
};

export default function ModerateVouchWithdrawalModal({
  request,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: ModerateVouchWithdrawalModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = async (action: ModerateVouchWithdrawalAction) => {
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      return;
    }

    await onSubmit(action, trimmedReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="moderate-vouch-title"
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-line px-6 py-5">
          <div>
            <h2
              id="moderate-vouch-title"
              className="text-lg font-semibold text-ink"
            >
              Review withdrawal
            </h2>

            <p className="mt-1 text-sm text-muted">
              Review the request before confirming your decision.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="rounded-lg p-1.5 text-faint transition-colors hover:bg-line/60 hover:text-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="rounded-xl bg-canvas p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-faint">
              Withdrawal request
            </p>

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-faint">Buyer</p>

                <p className="mt-1 text-sm font-medium text-ink">
                  {request.buyerName}
                </p>

                <p className="mt-0.5 text-xs text-muted">
                  {request.buyerEmail}
                </p>
              </div>

              <div>
                <p className="text-xs text-faint">Lister</p>

                <p className="mt-1 text-sm font-medium text-ink">
                  {request.listerName}
                </p>

                <p className="mt-0.5 text-xs text-muted">
                  {request.listerEmail}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-ink">
              Buyer&apos;s reason
            </p>

            <div className="rounded-xl border border-line bg-white p-3 text-sm leading-6 text-muted">
              {request.reason}
            </div>
          </div>

          <div>
            <label
              htmlFor="moderation-reason"
              className="mb-2 block text-sm font-medium text-ink"
            >
              Admin reason
            </label>

            <textarea
              id="moderation-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Add a reason for your decision..."
              rows={4}
              disabled={isSubmitting}
              className="w-full resize-none rounded-xl border border-line px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-faint focus:border-sky focus:ring-2 focus:ring-sky/10 disabled:cursor-not-allowed disabled:bg-canvas"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-line/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleSubmit("REJECT")}
            disabled={!reason.trim() || isSubmitting}
            className="bg-danger px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-danger/90 rounded-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Reject withdrawal"}
          </button>

          <button
            type="button"
            onClick={() => handleSubmit("APPROVE")}
            disabled={!reason.trim() || isSubmitting}
            className="flex items-center gap-2 bg-pine px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pine/90 rounded-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />

            {isSubmitting ? "Submitting..." : "Approve withdrawal"}
          </button>
        </div>
      </div>
    </div>
  );
}
