// Si NEXT_PUBLIC_BACKEND_URL est défini, on appelle le backend externe.
// Sinon on utilise la route Next.js locale créée ci-dessus.
export const apiBase = () => process.env.NEXT_PUBLIC_BACKEND_URL?.trim() || "";

export const forecastUrl = (ticker: string, days: number) => {
  const be = apiBase();
  return be
    ? `${be}/api/v1/etf/${encodeURIComponent(ticker)}/forecast?days=${days}`
    : `/api/forecast/${encodeURIComponent(ticker)}?days=${days}`;
};
