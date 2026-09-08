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
    <div className="overflow-x-auto rounded border border-white/10">
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
  );
}
