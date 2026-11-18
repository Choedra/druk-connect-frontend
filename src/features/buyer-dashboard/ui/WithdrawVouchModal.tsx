import { AlertCircle, X } from "lucide-react";

import type { GivenVouch } from "../types/vouchRequest";

type WithdrawVouchModalProps = {
  vouch: GivenVouch;
  reason: string;
  isSubmitting: boolean;
  error: string | null;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function WithdrawVouchModal({
  vouch,
  reason,
  isSubmitting,
  error,
  onReasonChange,
  onClose,
  onSubmit,
}: WithdrawVouchModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="withdraw-vouch-title"
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-line px-6 py-5">
          <div>
            <h2
              id="withdraw-vouch-title"
              className="text-lg font-semibold text-ink"
            >
              Withdraw your vouch?
            </h2>

            <p className="mt-1 text-sm text-muted">
              Your request will be reviewed by an administrator.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="rounded-lg p-1.5 text-faint hover:bg-line/60 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="rounded-xl bg-canvas p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-faint">
              Vouch for
            </p>

            <p className="mt-1 font-medium text-ink">
              {vouch.listerName}
            </p>
          </div>

          <div className="mt-5">
            <label
              htmlFor="withdrawal-reason"
              className="mb-2 block text-sm font-medium text-ink"
            >
              Reason for withdrawal
            </label>

            <textarea
              id="withdrawal-reason"
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              placeholder="Tell us why you can no longer vouch for this person..."
              rows={4}
              disabled={isSubmitting}
              className="w-full resize-none rounded-xl border border-line px-3 py-2.5 text-sm text-ink outline-none placeholder:text-faint focus:border-sky focus:ring-2 focus:ring-sky/10 disabled:bg-canvas"
            />

            <p className="mt-1.5 text-xs text-faint">
              Please provide a reason for the administrator to review.
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
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
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted hover:bg-line/60 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={!reason.trim() || isSubmitting}
            className="rounded-lg bg-danger px-5 py-2.5 text-sm font-semibold text-white hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit withdrawal"}
          </button>
        </div>
      </div>
    </div>
  );
}
