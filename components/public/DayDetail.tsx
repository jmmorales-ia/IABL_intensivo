"use client";

import { useState } from "react";
import type { Day } from "@prisma/client";
import { formatFullDate } from "@/lib/format";
import { markDayComplete } from "@/lib/actions/public";

export default function DayDetail({
  studentId,
  day,
  initiallyCompleted,
}: {
  studentId: string;
  day: Day;
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
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-sm text-text-secondary">
          Día {day.day_number} · {formatFullDate(day.date)}
          {day.time_estimate_minutes ? ` · ${day.time_estimate_minutes} min` : ""}
        </p>
        <h1 className="mt-1 text-xl font-semibold text-text-primary">{day.title}</h1>
        {day.is_live_session && day.live_session_label && (
          <p className="mt-1 text-sm text-accent">{day.live_session_label}</p>
        )}
      </header>

      {day.why_today && (
        <section className="rounded border-l-4 border-accent bg-card p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Por qué hoy
          </h2>
          <p className="prose-content mt-2 text-text-primary">{day.why_today}</p>
        </section>
      )}

      {day.action_html && (
        <section className="rounded border-l-4 border-accent bg-card p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
            La acción
          </h2>
          <div
            className="prose-content mt-2 text-text-primary"
            dangerouslySetInnerHTML={{ __html: day.action_html }}
          />
        </section>
      )}

      {(day.audio_url || day.video_url) && (
        <section className="rounded border-l-4 border-accent bg-card p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Material de apoyo
          </h2>
          <div className="mt-2 flex flex-col gap-2">
            {day.audio_url && (
              <a
                href={day.audio_url}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline"
              >
                Escuchar audio del día
              </a>
            )}
            {day.video_url && (
              <a
                href={day.video_url}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline"
              >
                Ver vídeo de apoyo
              </a>
            )}
          </div>
        </section>
      )}

      {day.proof_required && (
        <section className="rounded border-l-4 border-accent bg-card p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Prueba requerida
          </h2>
          <p className="prose-content mt-2 text-text-primary">{day.proof_required}</p>
        </section>
      )}

      {day.note_html && (
        <section className="rounded border-l-4 border-accent bg-card p-4">
          <div
            className="prose-content text-sm text-text-secondary"
            dangerouslySetInnerHTML={{ __html: day.note_html }}
          />
        </section>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="button"
        onClick={handleComplete}
        disabled={completed || submitting}
        className="rounded bg-accent px-4 py-3 text-center font-medium text-white transition hover:bg-accent/90 disabled:cursor-default disabled:bg-accent/40"
      >
        {completed ? "Hecho ✓" : submitting ? "Guardando…" : "Lo he hecho"}
      </button>
    </div>
  );
}
