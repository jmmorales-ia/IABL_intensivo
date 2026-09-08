"use client";

import { useState } from "react";
import type { Day, Resource, SkillFile } from "@prisma/client";
import { formatFullDate } from "@/lib/format";
import { markDayComplete } from "@/lib/actions/public";
import CopyButton from "./CopyButton";

type DayWithResources = Day & { resources: Resource[]; skill_files: SkillFile[] };

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
    <div className="flex flex-col gap-8 sm:gap-10">
      <header>
        <p className="text-sm text-text-secondary">
          Día {day.day_number} · {formatFullDate(day.date)}
          {day.time_estimate_minutes ? ` · ${day.time_estimate_minutes} min` : ""}
        </p>
        <h1 className="mt-2 text-2xl font-semibold leading-snug text-text-primary sm:text-3xl">
          {day.title}
        </h1>
        {day.is_live_session && day.live_session_label && (
          <p className="mt-2 inline-block rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            {day.live_session_label}
          </p>
        )}
      </header>

      {day.why_today && (
        <section className="rounded-xl border-l-4 border-accent bg-card p-5 sm:p-7">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-text-secondary">
            Por qué hoy
          </h2>
          <p className="prose-content mt-4 text-[15px] text-text-primary sm:text-base">
            {day.why_today}
          </p>
        </section>
      )}

      {day.action_html && (
        <section className="rounded-xl border-l-4 border-accent bg-card p-5 shadow-glow sm:p-7">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            La acción
          </h2>
          <div
            className="prose-content mt-4 text-[15px] text-text-primary sm:text-base"
            dangerouslySetInnerHTML={{ __html: day.action_html }}
          />
        </section>
      )}

      {(day.resources.length > 0 || day.skill_files.length > 0) && (
        <section className="rounded-xl border-l-4 border-accent bg-card p-5 sm:p-7">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            Recursos de este día
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {day.resources.map((r) => (
              <div key={r.id} className="rounded-lg border border-white/10 bg-bg/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[15px] font-medium text-text-primary">{r.title}</h3>
                  {r.price_range && (
                    <span className="flex-none whitespace-nowrap text-xs font-semibold text-accent">
                      {r.price_range}
                    </span>
                  )}
                </div>
                <div
                  className="prose-content mt-2 text-sm text-text-secondary"
                  dangerouslySetInnerHTML={{ __html: r.content_html }}
                />
                <div className="mt-3">
                  <CopyButton html={r.content_html} />
                </div>
              </div>
            ))}

            {day.skill_files.map((s) => (
              <div key={s.id} className="rounded-lg border border-white/10 bg-bg/40 p-4">
                <h3 className="text-[15px] font-medium text-text-primary">{s.title}</h3>
                <div
                  className="prose-content mt-2 text-sm text-text-secondary"
                  dangerouslySetInnerHTML={{ __html: s.instructions_html }}
                />
                <a
                  href={s.download_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block rounded-lg border border-accent px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent hover:text-white hover:shadow-glow"
                >
                  Descargar
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {day.proof_required && (
        <section className="rounded-xl border-l-4 border-accent bg-card p-5 sm:p-7">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-text-secondary">
            Prueba requerida
          </h2>
          <p className="prose-content mt-4 text-[15px] text-text-primary sm:text-base">
            {day.proof_required}
          </p>
        </section>
      )}

      {day.note_html && (
        <section className="rounded-xl border-l-4 border-accent/50 bg-card p-5 sm:p-7">
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
        className={`rounded-lg px-4 py-4 text-center text-base font-semibold transition disabled:cursor-default ${
          completed
            ? "bg-accent/25 text-accent"
            : "bg-accent text-white shadow-glow-lg hover:bg-accent/90"
        }`}
      >
        {completed ? "Hecho ✓" : submitting ? "Guardando…" : "Lo he hecho"}
      </button>
    </div>
  );
}
