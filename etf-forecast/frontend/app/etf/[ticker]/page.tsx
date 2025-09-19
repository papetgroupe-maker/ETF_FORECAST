"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ForecastChart from "@/components/ForecastChart";
import { forecastUrl } from "@/lib/api";

type PathPoint = { date: string; actual: number | null; p10: number | null; p50: number | null; p90: number | null; };
type Metrics = { mae: number; mape: number; hit_rate: number; baseline_mae: number; model: string; };
type ForecastResp = {
  ticker: string; as_of: string; horizons: number[]; path: PathPoint[]; metrics: Metrics; confidence: string;
};

export default function ETFPage() {
  const params = useParams<{ ticker: string }>();
  const ticker = (params?.ticker || "").toString().toUpperCase();
  const [data, setData] = useState<ForecastResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [horizon, setHorizon] = useState<number>(90);

  useEffect(() => {
    if (!ticker) return;
    const load = async () => {
      setLoading(true); setError(null);
      const primary = forecastUrl(ticker, 90);
      const local = `/api/forecast/${encodeURIComponent(ticker)}?days=90`;
      try {
        const res = await axios.get(primary);
        setData(res.data);
      } catch {
        try {
          const res = await axios.get(local);
          setData(res.data);
        } catch {
          setError("Impossible de charger les prévisions.");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [ticker]);

  const seriesForHorizon = useMemo(() => {
    if (!data) return [];
    const lastActualIdx = data.path.map(p => p.actual !== null).lastIndexOf(true);
    if (lastActualIdx < 0) return data.path;
    const fut = data.path.slice(lastActualIdx + 1, lastActualIdx + 1 + horizon);
    return [...data.path.slice(0, lastActualIdx + 1), ...fut];
  }, [data, horizon]);

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ETF {ticker}</h1>
        <div className="flex items-center gap-2">
          {[7,30,90].map(h => (
            <button key={h}
              onClick={()=>setHorizon(h)}
              className={`px-3 py-1 rounded-xl text-sm border ${horizon===h ? "bg-black text-white" : "bg-white"}`}>
              {h}j
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="card p-6">Chargement…</div>}
      {error && <div className="card p-6 text-red-600">{error}</div>}

      {data && (
        <>
          <div className="card p-4">
            <ForecastChart series={seriesForHorizon} />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6">
              <div className="font-semibold">Métriques (backtest)</div>
              <ul className="mt-3 space-y-1 text-sm text-gray-700">
                <li>MAE: {data.metrics.mae.toFixed(3)}</li>
                <li>MAPE: {(data.metrics.mape*100).toFixed(2)}%</li>
                <li>Précision directionnelle: {(data.metrics.hit_rate*100).toFixed(1)}%</li>
                <li>Baseline MAE: {data.metrics.baseline_mae.toFixed(3)}</li>
                <li>Modèle: {data.metrics.model}</li>
              </ul>
            </div>
            <div className="card p-6">
              <div className="font-semibold">Confiance</div>
              <p className="mt-2 text-gray-700">Score: {data.confidence} (A=haut, E=faible)</p>
              <p className="text-sm text-gray-600 mt-2">Prévisions indicatives. Aucune recommandation personnalisée.</p>
            </div>
            <div className="card p-6">
              <div className="font-semibold">Info</div>
              <p className="text-sm text-gray-700 mt-2">Dernière mise à jour: {new Date(data.as_of).toLocaleDateString()}</p>
              <p className="text-sm text-gray-700">Horizons dispo: {data.horizons.join(", ")} jours</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
