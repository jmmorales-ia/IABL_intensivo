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

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-8">
      <header>
        <p className="text-sm text-text-secondary">{bundle.edition.name}</p>
        <h1 className="mt-1 text-xl font-semibold text-text-primary">Hola, {studentName}</h1>
      </header>

      <div className="mt-6">
        <ProgressBar completed={completedUnlockedCount} total={unlockedDays.length} />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {bundle.days.map((day) => (
          <DayCard key={day.id} day={day} completed={completedDayIds.has(day.id)} />
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
