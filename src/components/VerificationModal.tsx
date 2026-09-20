import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, X, Loader2 } from 'lucide-react';
import { complaintsApi } from '../api/complaints';
import { ErrorBanner } from './ErrorBanner';

interface VerificationModalProps {
  complaintId: number | string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  complaintId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [decision, setDecision] = useState<'verified' | 'rework'>('verified');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await complaintsApi.verify(complaintId, {
        decision,
        comment: comment.trim() || (decision === 'verified' ? 'The issue has been resolved satisfactorily.' : 'Work requires rework.'),
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Verify Repair Work</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <ErrorBanner message={error} className="mt-4" />}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Select Your Verification Verdict
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision('verified')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition ${
                  decision === 'verified'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <CheckCircle2 className="w-6 h-6 mb-1 text-emerald-600" />
                <span className="text-sm font-bold">Approve & Verify</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Fixed satisfactorily</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('rework')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition ${
                  decision === 'rework'
                    ? 'border-rose-600 bg-rose-50 text-rose-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <RotateCcw className="w-6 h-6 mb-1 text-rose-600" />
                <span className="text-sm font-bold">Request Rework</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Issue still present</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Feedback / Reason {decision === 'rework' && <span className="text-rose-600">*</span>}
            </label>
            <textarea
              rows={3}
              required={decision === 'rework'}
              placeholder={
                decision === 'verified'
                  ? 'Optional: Add feedback about the completed repair...'
                  : 'Please explain what remains unfixed or why rework is required...'
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow transition disabled:opacity-50 ${
                decision === 'verified'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {decision === 'verified' ? 'Confirm Verification' : 'Submit Rework Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
