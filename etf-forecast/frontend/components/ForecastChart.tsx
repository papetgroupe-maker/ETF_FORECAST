"use client";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from "recharts";
import { useMemo, useState } from "react";
import InfoTooltip from "./InfoTooltip";

export type Point = { date: string; actual: number | null; p10: number | null; p50: number | null; p90: number | null; };
export default function ForecastChart({ series }: { series: Point[] }) {
  const [showBands, setShowBands] = useState(true);
  const [showMedian, setShowMedian] = useState(true);
  const [showActual, setShowActual] = useState(true);

  const data = useMemo(() => series.map((d) => ({
    date: d.date,
    actual: d.actual ?? null,
    p10: d.p10 ?? null,
    p50: d.p50 ?? null,
    p90: d.p90 ?? null,
  })), [series]);

  const todayIndex = useMemo(() => data.findIndex(d => d.actual === null && (d.p50 !== null || d.p10 !== null)), [data]);
  const todayX = todayIndex >= 0 ? data[todayIndex].date : undefined;

  const format = (v: number) => (v >= 1000 ? v.toFixed(0) : v.toFixed(2));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const row: any = Object.assign({}, ...payload.map((p: any) => ({ [p.dataKey]: p.value })));
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs shadow-soft">
        <div className="font-medium">{label}</div>
        {row.actual != null && <div className="text-[var(--mut)] mt-1">Cours: <span className="text-white">{format(row.actual)}</span></div>}
        {row.p50 != null && <div className="text-[var(--mut)]">P50: <span className="text-white">{format(row.p50)}</span></div>}
        {row.p10 != null && row.p90 != null && (
          <div className="text-[var(--mut)]">Intervalle 80%: <span className="text-white">{format(row.p10)} – {format(row.p90)}</span></div>
        )}
        <div className="mt-2 text-[10px] text-[var(--mut)]">Indicatif — pas un conseil en investissement.</div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap gap-2 text-sm">
        <button onClick={() => setShowActual(v => !v)} className={`badge ${showActual ? "border-white/50" : ""}`}>Cours</button>
        <button onClick={() => setShowMedian(v => !v)} className={`badge ${showMedian ? "border-white/50" : ""}`}>P50 (médiane)</button>
        <button onClick={() => setShowBands(v => !v)} className={`badge ${showBands ? "border-white/50" : ""}`}>P10–P90 (80%)</button>
        <span className="ml-auto text-xs text-[var(--mut)]">
          Comment lire ?
          <InfoTooltip label="Lire le graphique">
            <p>La courbe <strong>Cours</strong> montre l’historique réel. Les zones dégradées représentent les <strong>bandes de confiance</strong> entre <em>P10</em> et <em>P90</em>.</p>
            <p className="mt-1">La ligne verticale indique le passage à l’horizon futur.</p>
          </InfoTooltip>
        </span>
      </div>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5b8cff" stopOpacity={0.32} />
                <stop offset="100%" stopColor="#5b8cff" stopOpacity={0.06} />
              </linearGradient>
              <linearGradient id="median" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a259ff" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#a259ff" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="actual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0.4}/>
              </linearGradient>
            </defs>

            <XAxis dataKey="date" hide />
            <YAxis tickFormatter={format} stroke="rgba(255,255,255,0.6)" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ display: "none" }} />

            {showBands && (
              <>
                <Area type="monotone" dataKey="p90" stroke="none" fill="url(#band)" dot={false} activeDot={false} />
                <Area type="monotone" dataKey="p10" stroke="none" fill="url(#band)" dot={false} activeDot={false} />
              </>
            )}
            {showMedian && <Area type="monotone" dataKey="p50" stroke="url(#median)" fill="none" dot={false} strokeWidth={2} />}
            {showActual && <Area type="monotone" dataKey="actual" stroke="url(#actual)" fill="none" dot={false} strokeWidth={2.2} />}

            {todayX && (
              <ReferenceLine x={todayX} stroke="rgba(255,255,255,0.35)" strokeDasharray="3 4" label={{ value: "Aujourd'hui", position: "top", fill: "rgba(255,255,255,0.55)", fontSize: 12 }} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
