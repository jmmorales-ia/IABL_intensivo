import Link from "next/link";
import type { Day } from "@prisma/client";
import { formatDayDate } from "@/lib/format";

export default function DayCard({
  day,
  completed,
  isNext,
}: {
  day: Day;
  completed: boolean;
  isNext: boolean;
}) {
  const locked = !day.is_unlocked;

  const badgeClass = locked
    ? "bg-white/5 text-text-secondary"
    : completed
      ? "bg-accent text-white shadow-glow"
      : isNext
        ? "border border-accent bg-accent/15 text-accent animate-pulse-glow"
        : "border border-accent/40 bg-accent/10 text-accent";

  const content = (
    <div
      className={`flex items-center gap-4 rounded-lg border-l-4 bg-card px-5 py-4 transition ${
        locked
          ? "border-white/10 opacity-55"
          : isNext
            ? "border-accent shadow-glow hover:bg-card/80"
            : "border-accent/70 hover:bg-card/80"
      }`}
    >
      <div
        className={`flex h-11 w-11 flex-none items-center justify-center rounded-full text-base font-semibold transition ${badgeClass}`}
      >
        {day.day_number}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs tracking-wide text-text-secondary">
          {formatDayDate(day.date)}
        </div>
        <div className="mt-0.5 truncate text-[15px] font-medium text-text-primary">
          {day.title}
        </div>
        {day.is_live_session && day.live_session_label && (
          <div className="mt-1 text-xs font-medium text-accent">{day.live_session_label}</div>
        )}
        {isNext && !locked && (
          <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-accent">
            Toca hoy
          </div>
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
