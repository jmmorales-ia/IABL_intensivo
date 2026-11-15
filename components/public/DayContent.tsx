import type { Day, Resource, SkillFile } from "@prisma/client";
import { formatFullDate } from "@/lib/format";
import CopyButton from "./CopyButton";

export type DayWithResources = Day & {
  resources: Resource[];
  skill_files: SkillFile[];
};

export default function DayContent({ day }: { day: DayWithResources }) {
  const sections = [
    day.why_today && { id: "por-que-hoy", label: "Por qué hoy" },
    day.action_html && { id: "la-accion", label: "La acción" },
    (day.resources.length > 0 || day.skill_files.length > 0) && {
      id: "recursos",
      label: "Recursos",
    },
    day.proof_required && { id: "prueba", label: "Prueba requerida" },
  ].filter((section): section is { id: string; label: string } => Boolean(section));

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <header className="rounded-2xl border border-white/10 bg-card/70 p-5 sm:p-7">
        <p className="text-sm text-text-secondary">
          Día {day.day_number} · {formatFullDate(day.date)}
          {day.time_estimate_minutes ? ` · ${day.time_estimate_minutes} min` : ""}
        </p>
        <h1 className="mt-3 text-2xl font-semibold leading-snug text-text-primary sm:text-3xl">
          {day.title}
        </h1>
        {day.is_live_session && day.live_session_label && (
          <p className="mt-4 inline-block rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            {day.live_session_label}
          </p>
        )}
      </header>

      {sections.length > 1 && (
        <nav aria-label="Secciones de este día" className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full border border-white/15 bg-card px-3 py-2 text-center text-xs font-medium text-text-secondary transition hover:border-accent/50 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              {section.label}
            </a>
          ))}
        </nav>
      )}

      {day.why_today && (
        <section id="por-que-hoy" className="scroll-mt-5 rounded-xl border border-white/10 bg-card p-5 sm:p-7">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-text-secondary">
            Por qué hoy
          </h2>
          <p className="prose-content mt-4 text-[15px] text-text-primary sm:text-base">
            {day.why_today}
          </p>
        </section>
      )}

      {day.action_html && (
        <section id="la-accion" className="scroll-mt-5 rounded-xl border border-accent/50 bg-card p-5 sm:p-7">
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
        <section id="recursos" className="scroll-mt-5 rounded-xl border border-white/10 bg-card p-5 sm:p-7">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-text-secondary">
            Recursos de este día
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {day.resources.map((resource) => (
              <details key={resource.id} className="group rounded-lg border border-white/10 bg-bg/40">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4 text-sm text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 flex-1 font-medium">{resource.title}</span>
                  {resource.price_range && (
                    <span className="max-w-[45%] break-all text-right text-xs font-semibold text-accent">
                      {resource.price_range}
                    </span>
                  )}
                  <span aria-hidden="true" className="text-text-secondary transition group-open:rotate-180">⌄</span>
                </summary>
                <div className="border-t border-white/10 px-4 pb-4 pt-3">
                  <div
                    className="prose-content text-sm text-text-secondary"
                    dangerouslySetInnerHTML={{ __html: resource.content_html }}
                  />
                  <div className="mt-3"><CopyButton html={resource.content_html} /></div>
                </div>
              </details>
            ))}
            {day.skill_files.map((skill) => (
              <details key={skill.id} className="group rounded-lg border border-white/10 bg-bg/40">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4 text-sm font-medium text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 flex-1">{skill.title}</span>
                  <span aria-hidden="true" className="text-text-secondary transition group-open:rotate-180">⌄</span>
                </summary>
                <div className="border-t border-white/10 px-4 pb-4 pt-3">
                  <div
                    className="prose-content text-sm text-text-secondary"
                    dangerouslySetInnerHTML={{ __html: skill.instructions_html }}
                  />
                  <a
                    href={skill.download_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block rounded-lg border border-accent px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent hover:text-white"
                  >
                    Descargar
                  </a>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {day.proof_required && (
        <section id="prueba" className="scroll-mt-5 rounded-xl border border-accent/40 bg-accent/5 p-5 sm:p-7">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            Prueba requerida
          </h2>
          <p className="prose-content mt-4 text-[15px] text-text-primary sm:text-base">
            {day.proof_required}
          </p>
        </section>
      )}

      {day.note_html && (
        <section className="rounded-xl border border-white/10 bg-card p-5 sm:p-7">
          <div
            className="prose-content text-sm text-text-secondary"
            dangerouslySetInnerHTML={{ __html: day.note_html }}
          />
        </section>
      )}
    </div>
  );
}
