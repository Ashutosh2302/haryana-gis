"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";

interface CaptureModalProps {
  open: boolean;
  onConfirm: (notes: string) => void;
  onCancel: () => void;
}

export default function CaptureModal({
  open,
  onConfirm,
  onCancel,
}: CaptureModalProps) {
  const [notes, setNotes] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setNotes("");
      window.setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      data-capture-ignore=""
      className="fixed inset-0 z-[2000] flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-md rounded-[24px] border border-white/70 bg-white p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.5)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <Camera className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                Capture Map View
              </h3>
              <p className="text-sm text-slate-500">
                Export current view as PDF
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5">
          <label
            htmlFor="capture-notes"
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500"
          >
            Notes (optional)
          </label>
          <textarea
            ref={textareaRef}
            id="capture-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes for this export..."
            rows={3}
            className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(notes.trim())}
            className="rounded-2xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
