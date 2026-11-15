"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Day } from "@prisma/client";
import { toggleDayLock } from "@/lib/actions/admin";
import { formatDayDate } from "@/lib/format";

export default function DaysTable({ days }: { days: Day[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleToggle(dayId: string) {
    setPendingId(dayId);
    try {
      await toggleDayLock(dayId);
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 md:hidden">
        {days.map((day) => (
          <article key={day.id} className="rounded-xl border border-white/10 bg-card p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                {day.day_number}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-text-secondary">{formatDayDate(day.date)}</p>
                <h2 className="mt-1 text-sm font-semibold leading-snug text-text-primary">{day.title}</h2>
                {day.is_live_session && (
                  <p className="mt-2 text-xs font-medium text-accent">{day.live_session_label || "Directo"}</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => handleToggle(day.id)}
                disabled={pendingId === day.id}
                aria-label={`${day.is_unlocked ? "Bloquear" : "Desbloquear"} día ${day.day_number}`}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                  day.is_unlocked ? "bg-accent/15 text-accent" : "bg-white/5 text-text-secondary"
                }`}
              >
                {day.is_unlocked ? "Desbloqueado" : "Bloqueado"}
              </button>
              <Link href={`/admin/days/${day.id}`} className="rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-text-primary hover:border-accent/50 hover:text-accent">
                Editar
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-xl border border-white/10 md:block">
        <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-card text-left text-text-secondary">
            <th className="px-3 py-2 font-medium">#</th>
            <th className="px-3 py-2 font-medium">Fecha</th>
            <th className="px-3 py-2 font-medium">Título</th>
            <th className="px-3 py-2 font-medium">Directo</th>
            <th className="px-3 py-2 font-medium">Estado</th>
            <th className="px-3 py-2 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.id} className="border-b border-white/5 text-text-primary">
              <td className="px-3 py-2 text-text-secondary">{day.day_number}</td>
              <td className="px-3 py-2">{formatDayDate(day.date)}</td>
              <td className="px-3 py-2">{day.title}</td>
              <td className="px-3 py-2 text-text-secondary">
                {day.is_live_session ? day.live_session_label || "Sí" : "—"}
              </td>
              <td className="px-3 py-2">
                <button
                  type="button"
                  onClick={() => handleToggle(day.id)}
                  disabled={pendingId === day.id}
                  className={`rounded px-2 py-1 text-xs font-medium transition disabled:opacity-50 ${
                    day.is_unlocked
                      ? "bg-accent/15 text-accent"
                      : "bg-white/5 text-text-secondary"
                  }`}
                >
                  {day.is_unlocked ? "Desbloqueado" : "Bloqueado"}
                </button>
              </td>
              <td className="px-3 py-2 text-right">
                <Link href={`/admin/days/${day.id}`} className="text-accent hover:underline">
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </>
  );
}
