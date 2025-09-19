// frontend/lib/api.ts
export function apiBase(): string {
  const v = process.env.NEXT_PUBLIC_BACKEND_URL;
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : "";
}

export function forecastUrl(ticker: string, days: number): string {
  const be = apiBase();
  const t = encodeURIComponent(ticker);
  return be
    ? `${be}/api/v1/etf/${t}/forecast?days=${days}`
    : `/api/forecast/${t}?days=${days}`;
}
