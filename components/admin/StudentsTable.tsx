"use client";

import { useMemo, useState } from "react";
import { formatDateTime } from "@/lib/format";

type StudentRow = {
  id: string;
  name: string;
  created_at: Date;
  completedCount: number;
  lastCompletedAt: Date | null;
  lastCompletedDayNumber: number | null;
  totalUnlockedDays: number;
};

type SortKey = "name" | "completedCount" | "lastCompletedAt";

export default function StudentsTable({ students }: { students: StudentRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("completedCount");
  const [asc, setAsc] = useState(false);

  const sorted = useMemo(() => {
    const copy = [...students];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "completedCount") cmp = a.completedCount - b.completedCount;
      else if (sortKey === "lastCompletedAt") {
        const at = a.lastCompletedAt ? new Date(a.lastCompletedAt).getTime() : 0;
        const bt = b.lastCompletedAt ? new Date(b.lastCompletedAt).getTime() : 0;
        cmp = at - bt;
      }
      return asc ? cmp : -cmp;
    });
    return copy;
  }, [students, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setAsc((a) => !a);
    } else {
      setSortKey(key);
      setAsc(false);
    }
  }

  function Th({ label, sortKeyValue }: { label: string; sortKeyValue: SortKey }) {
    return (
      <th
        className="cursor-pointer select-none px-3 py-2 font-medium"
        onClick={() => toggleSort(sortKeyValue)}
      >
        {label}
        {sortKey === sortKeyValue ? (asc ? " ▲" : " ▼") : ""}
      </th>
    );
  }

  if (students.length === 0) {
    return <p className="text-text-secondary">Todavía no hay alumnos en esta edición.</p>;
  }

  return (
    <div className="overflow-x-auto rounded border border-white/10">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-card text-left text-text-secondary">
            <Th label="Nombre" sortKeyValue="name" />
            <Th label="Días completados" sortKeyValue="completedCount" />
            <th className="px-3 py-2 font-medium">Último día marcado</th>
            <Th label="Fecha del último" sortKeyValue="lastCompletedAt" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => (
            <tr key={s.id} className="border-b border-white/5 text-text-primary">
              <td className="px-3 py-2">{s.name}</td>
              <td className="px-3 py-2">
                {s.completedCount} / {s.totalUnlockedDays}
              </td>
              <td className="px-3 py-2 text-text-secondary">
                {s.lastCompletedDayNumber ? `Día ${s.lastCompletedDayNumber}` : "—"}
              </td>
              <td className="px-3 py-2 text-text-secondary">
                {s.lastCompletedAt ? formatDateTime(s.lastCompletedAt) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
