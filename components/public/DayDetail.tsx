"use client";

import { useState } from "react";
import { markDayComplete } from "@/lib/actions/public";
import DayContent, { type DayWithResources } from "./DayContent";

export default function DayDetail({
  studentId,
  day,
  initiallyCompleted,
}: {
  studentId: string;
  day: DayWithResources;
  initiallyCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleComplete() {
    setSubmitting(true);
    setError(null);
    try {
      await markDayComplete(studentId, day.id);
      setCompleted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se ha podido guardar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pb-24 sm:pb-0">
      <DayContent day={day} />
      {error && <p role="alert" className="mt-5 text-sm text-red-400">{error}</p>}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-white/10 bg-bg/95 px-4 py-3 backdrop-blur sm:static sm:mt-8 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        {day.proof_required && (
          <a
            href="#prueba"
            className="flex-none rounded-lg border border-white/20 px-3 py-3 text-sm font-medium text-text-primary hover:border-accent/60 sm:hidden"
          >
            Qué entregar
          </a>
        )}
        <button
          type="button"
          onClick={handleComplete}
          disabled={completed || submitting}
          className={`min-w-0 flex-1 rounded-lg px-4 py-3 text-center text-base font-semibold transition disabled:cursor-default sm:py-4 ${
            completed
              ? "bg-accent/25 text-accent"
              : "bg-accent text-white hover:bg-accent/90"
          }`}
        >
          {completed ? "Hecho ✓" : submitting ? "Guardando…" : "Lo he hecho"}
        </button>
      </div>
    </div>
  );
}
