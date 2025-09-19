"use client";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from "recharts";

type Point = { date: string; actual: number | null; p10: number | null; p50: number | null; p90: number | null; };

export default function ForecastChart({ series }: { series: Point[] }) {
  return (
    <div className="h-96 w-full">
      <ResponsiveContainer>
        <AreaChart data={series}>
          <defs>
            <linearGradient id="p90fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="p90" name="P90" stroke="#94a3b8" fillOpacity={1} fill="url(#p90fill)" />
          <Area type="monotone" dataKey="p10" name="P10" stroke="#cbd5e1" fillOpacity={0} />
          <Line type="monotone" dataKey="p50" name="P50" stroke="#334155" dot={false} />
          <Line type="monotone" dataKey="actual" name="Cours" stroke="#111827" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}