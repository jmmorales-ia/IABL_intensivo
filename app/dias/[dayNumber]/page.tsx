"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Day } from "@prisma/client";
import { getStudentSession, getDayForStudent } from "@/lib/actions/public";
import { getStoredStudentId, clearStoredStudentId } from "@/lib/client/storage";
import DayDetail from "@/components/public/DayDetail";

export default function DayPage() {
  const router = useRouter();
  const params = useParams<{ dayNumber: string }>();
  const dayNumber = Number(params.dayNumber);

  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [day, setDay] = useState<Day | null>(null);
  const [completed, setCompleted] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const id = getStoredStudentId();
      if (!id) {
        router.replace("/");
        return;
      }

      const session = await getStudentSession(id);
      if (!session) {
        clearStoredStudentId();
        router.replace("/");
        return;
      }

      if (!Number.isFinite(dayNumber)) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const result = await getDayForStudent(id, dayNumber);
      if (!result) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setStudentId(id);
      setDay(result.day);
      setCompleted(result.completed);
      setLoading(false);
    })();
  }, [dayNumber, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-text-secondary">Cargando…</p>
      </main>
    );
  }

  if (notFound || !day) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-text-primary">No se ha encontrado este día.</p>
        <Link href="/dias" className="text-accent underline">
          Volver a la lista
        </Link>
      </main>
    );
  }

  if (!day.is_unlocked) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-text-primary">Este día todavía está bloqueado.</p>
        <Link href="/dias" className="text-accent underline">
          Volver a la lista
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-10 sm:px-8 sm:py-14">
      <Link
        href="/dias"
        className="text-sm text-text-secondary transition hover:text-accent"
      >
        &larr; Todos los días
      </Link>
      <div className="mt-6">
        <DayDetail studentId={studentId!} day={day} initiallyCompleted={completed} />
      </div>
    </main>
  );
}
