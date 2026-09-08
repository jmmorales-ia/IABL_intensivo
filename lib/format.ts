export function formatDayDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

export function formatFullDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
