import Link from "next/link";
import type { Day } from "@prisma/client";
import { formatDayDate } from "@/lib/format";

export default function DayCard({ day, completed }: { day: Day; completed: boolean }) {
  const locked = !day.is_unlocked;

  const content = (
    <div
      className={`flex items-center gap-4 rounded border-l-4 bg-card px-4 py-3 transition ${
        locked ? "border-white/10 opacity-60" : "border-accent hover:bg-card/80"
      }`}
    >
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded bg-black/30 text-sm font-semibold text-text-primary">
        {day.day_number}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-text-secondary">{formatDayDate(day.date)}</div>
        <div className="truncate text-sm font-medium text-text-primary">{day.title}</div>
        {day.is_live_session && day.live_session_label && (
          <div className="mt-0.5 text-xs text-accent">{day.live_session_label}</div>
        )}
      </div>
      <div className="flex-none text-lg">
        {locked ? (
          <span aria-label="Bloqueado" title="Bloqueado" className="text-text-secondary">
            &#128274;
          </span>
        ) : completed ? (
          <span aria-label="Completado" title="Completado" className="text-accent">
            &#10003;
          </span>
        ) : null}
      </div>
    </div>
  );

  if (locked) {
    return <div className="cursor-not-allowed">{content}</div>;
  }

  return (
    <Link href={`/dias/${day.day_number}`} className="block">
      {content}
    </Link>
  );
}
