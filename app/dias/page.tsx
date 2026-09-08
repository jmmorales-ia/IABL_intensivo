"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

      <div className="mt-8 flex flex-col gap-3">
        {bundle.days.map((day) => (
          <DayCard
            key={day.id}
            day={day}
            completed={completedDayIds.has(day.id)}
            isNext={nextDay?.id === day.id}
          />
        ))}
      </div>

      <ResourceSection
        catalog={bundle.catalog}
        templates={bundle.templates}
        skillFiles={bundle.skillFiles}
      />
    </main>
  );
}
