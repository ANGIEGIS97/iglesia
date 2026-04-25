export function formatDateBogota(dateStr: string): string {
  return new Date(dateStr + "T00:00:00-05:00").toLocaleDateString("es-CO", {
    timeZone: "America/Bogota",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateBogotaShort(dateStr: string): string {
  return new Date(dateStr + "T00:00:00-05:00").toLocaleDateString("es-CO", {
    timeZone: "America/Bogota",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function useFormatters() {
  return { formatDateBogota, formatDateBogotaShort };
}
