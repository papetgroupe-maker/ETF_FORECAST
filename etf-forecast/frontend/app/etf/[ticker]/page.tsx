"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { apiBase } from "@/lib/api";
import ForecastChart from "@/components/ForecastChart";

type PathPoint = { date: string; actual: number | null; p10: number | null; p50: number | null; p90: number | null; };
type Metrics = { mae: number; mape: number; hit_rate: number; baseline_mae: number; model: string; };
type ForecastResp = {
  ticker: string;
  as_of: string;
  horizons: number[];
  path: PathPoint[];
  metrics: Metrics;
  confidence: string;
};

export default function ETFPage() {
  const params = useParams<{ ticker: string }>();
  const ticker = (params?.ticker || "").toString().toUpperCase();
  const [data, setData] = useState<ForecastResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    axios.get(`${apiBase()}/api/v1/etf/${ticker}/forecast?days=90`)
      .then(res => setData(res.data))
      .catch(() => setError("Impossible de charger les prévisions."))
      .finally(() => setLoading(false));
  }, [ticker]);

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">ETF {ticker}</h1>
      {loading && <div className="card p-6">Chargement…</div>}
      {error && <div className="card p-6 text-red-600">{error}</div>}
      {data && (
        <>
          <div className="card p-4">
            <ForecastChart series={data.path} />
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
              <p className="text-sm text-gray-600 mt-2">Déterminé par la stabilité des métriques et la dispersion des bandes.</p>
            </div>
            <div className="card p-6">
              <div className="font-semibold">Info</div>
              <p className="text-sm text-gray-700 mt-2">Dernière mise à jour: {new Date(data.as_of).toLocaleDateString()}</p>
              <p className="text-sm text-gray-700">Horizons: {data.horizons.join(", ")} jours</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}