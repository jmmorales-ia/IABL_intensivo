"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Day, Edition, Resource, SkillFile } from "@prisma/client";
import {
  getStudentSession,
  getEditionBundle,
  getProgressForStudent,
} from "@/lib/actions/public";
import { getStoredStudentId, clearStoredStudentId } from "@/lib/client/storage";
import DayCard from "@/components/public/DayCard";
import ProgressBar from "@/components/public/ProgressBar";
import ResourceSection from "@/components/public/ResourceSection";

type Bundle = {
  edition: Edition;
  days: Day[];
  catalog: Resource[];
  templates: Resource[];
  skillFiles: SkillFile[];
};

export default function DiasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [completedDayIds, setCompletedDayIds] = useState<Set<string>>(new Set());
  const [activeView, setActiveView] = useState<"days" | "resources">("days");

  useEffect(() => {
    (async () => {
      const studentId = getStoredStudentId();
      if (!studentId) {
        router.replace("/");
        return;
      }

      const session = await getStudentSession(studentId);
      if (!session) {
        clearStoredStudentId();
        router.replace("/");
        return;
      }

      const [data, progress] = await Promise.all([
        getEditionBundle(session.edition_id),
        getProgressForStudent(studentId),
      ]);

      if (!data) {
        router.replace("/");
        return;
      }

      setStudentName(session.name);
      setBundle(data);
      setCompletedDayIds(new Set(progress.map((p) => p.day_id)));
      setLoading(false);
    })();
  }, [router]);

  if (loading || !bundle) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-text-secondary">Cargando…</p>
      </main>
    );
  }

  const unlockedDays = bundle.days.filter((d) => d.is_unlocked);
  const completedUnlockedCount = unlockedDays.filter((d) => completedDayIds.has(d.id)).length;
  const nextDay = unlockedDays.find((d) => !completedDayIds.has(d.id));
  const weeks = [
    { label: "Semana 1", from: 1, to: 7 },
    { label: "Semana 2", from: 8, to: 14 },
    { label: "Semana 3", from: 15, to: 21 },
    { label: "Semana 4", from: 22, to: 30 },
  ];

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-10 sm:px-8 sm:py-14">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {bundle.edition.name}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-text-primary sm:text-3xl">
          Hola, {studentName}
        </h1>
      </header>

      <div className="mt-8">
        <ProgressBar completed={completedUnlockedCount} total={unlockedDays.length} />
      </div>

      <div role="group" aria-label="Contenido del intensivo" className="mt-8 grid grid-cols-2 rounded-xl border border-white/10 bg-card p-1">
        <button
          type="button"
          aria-pressed={activeView === "days"}
          onClick={() => setActiveView("days")}
          className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${activeView === "days" ? "bg-accent/15 text-accent" : "text-text-secondary hover:text-text-primary"}`}
        >
          Días
        </button>
        <button
          type="button"
          aria-pressed={activeView === "resources"}
          onClick={() => setActiveView("resources")}
          className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${activeView === "resources" ? "bg-accent/15 text-accent" : "text-text-secondary hover:text-text-primary"}`}
        >
          Recursos
        </button>
      </div>

      {activeView === "days" ? (
        <div id="panel-days" className="mt-8">
          {nextDay && (
            <Link
              href={`/dias/${nextDay.day_number}`}
              className="mb-10 block rounded-2xl border border-accent/50 bg-accent/10 p-5 transition hover:border-accent hover:bg-accent/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent sm:p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Continúa por aquí · Día {nextDay.day_number}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <h2 className="text-lg font-semibold text-text-primary sm:text-xl">{nextDay.title}</h2>
                <span aria-hidden="true" className="flex-none text-xl text-accent">→</span>
              </div>
            </Link>
          )}
          <div className="flex flex-col gap-10">
            {weeks.map((week) => {
              const weekDays = bundle.days.filter((day) => day.day_number >= week.from && day.day_number <= week.to);
              if (weekDays.length === 0) return null;
              return (
                <section key={week.label} aria-label={week.label}>
                  <h2 className="mb-4 border-b border-white/10 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                    {week.label}
                  </h2>
                  <div className="flex flex-col gap-3">
                    {weekDays.map((day) => (
                      <DayCard
                        key={day.id}
                        day={day}
                        completed={completedDayIds.has(day.id)}
                        isNext={nextDay?.id === day.id}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      ) : (
        <div id="panel-resources">
          <ResourceSection
            catalog={bundle.catalog}
            templates={bundle.templates}
            skillFiles={bundle.skillFiles}
          />
        </div>
      )}
    </main>
  );
}
