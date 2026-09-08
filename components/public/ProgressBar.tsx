export default function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-text-primary">
          {completed} de {total} días desbloqueados completados
        </span>
        <span className="text-text-secondary">{pct}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-card">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
