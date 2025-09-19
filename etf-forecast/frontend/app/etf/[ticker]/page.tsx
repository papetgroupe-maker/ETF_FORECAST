"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ForecastChart from "@/components/ForecastChart";
import { forecastUrl } from "@/lib/api";
import InfoTooltip from "@/components/InfoTooltip";
import Explainer from "@/components/Explainer";
import OnboardingModal from "@/components/OnboardingModal";

type PathPoint = { date: string; actual: number | null; p10: number | null; p50: number | null; p90: number | null; };
type Metrics = { mae: number; mape: number; hit_rate: number; baseline_mae: number; model: string; };
type ForecastResp = { ticker: string; as_of: string; horizons: number[]; path: PathPoint[]; metrics: Metrics; confidence: string; };

function pct(a: number, b: number) { return b === 0 ? 0 : (a - b) / b; }

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
      try {
        const res = await axios.get(forecastUrl(ticker, 90));
        setData(res.data);
      } catch {
        try {
          const res = await axios.get(`/api/forecast/${encodeURIComponent(ticker)}?days=90`);
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

  const actualSeries = useMemo(() => (data?.path.filter(p => p.actual !== null) ?? []) as PathPoint[], [data]);
  const priceBox = useMemo(() => {
    if (!actualSeries.length) return null;
    const last = actualSeries[actualSeries.length-1].actual as number;
    const prev = actualSeries.length>1 ? (actualSeries[actualSeries.length-2].actual as number) : last;
    const mBack = actualSeries.length>22 ? (actualSeries[actualSeries.length-22].actual as number) : actualSeries[0].actual as number;
    const year = new Date().getFullYear().toString();
    const ytdIdx = actualSeries.findIndex(p => p.date.startsWith(year));
    const ytdBase = ytdIdx>=0 ? (actualSeries[ytdIdx].actual as number) : (actualSeries[0].actual as number);
    return { price: last, d1: pct(last, prev), m1: pct(last, mBack), ytd: pct(last, ytdBase) };
  }, [actualSeries]);

  const seriesForHorizon = useMemo(() => {
    if (!data) return [];
    const lastActualIdx = data.path.map(p => p.actual !== null).lastIndexOf(true);
    if (lastActualIdx < 0) return data.path;
    const fut = data.path.slice(lastActualIdx + 1, lastActualIdx + 1 + horizon);
    return [...data.path.slice(0, lastActualIdx + 1), ...fut];
  }, [data, horizon]);

  return (
    <>
      <OnboardingModal />
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">ETF {ticker}</h1>
          <div className="flex items-center gap-2">
            {[7,30,90].map(h => (
              <button key={h} onClick={()=>setHorizon(h)}
                className={`px-3 py-1 rounded-xl text-sm border ${horizon===h ? "bg-black text-white" : "bg-white"}`}>{h}j</button>
            ))}
          </div>
        </div>

        {priceBox && (
          <div className="card p-5 flex flex-wrap items-center gap-6">
            <div>
              <div className="text-sm text-[var(--mut)]">Cours actuel</div>
              <div className="text-3xl font-bold">{priceBox.price.toFixed(2)}</div>
            </div>
            <div className="badge border-gray-300">1J { (priceBox.d1*100).toFixed(2)}%</div>
            <div className="badge border-gray-300">1M { (priceBox.m1*100).toFixed(2)}%</div>
            <div className="badge border-gray-300">YTD { (priceBox.ytd*100).toFixed(2)}%</div>
          </div>
        )}

        {loading && <div className="card p-6">Chargement…</div>}
        {error && <div className="card p-6 text-red-600">{error}</div>}

        {data && (
          <>
            <div className="card p-4"><ForecastChart series={seriesForHorizon} /></div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="font-semibold">
                  Métriques
                  <InfoTooltip label="À propos des métriques">
                    <p><strong>MAE</strong> (Mean Absolute Error) : erreur moyenne absolue entre prévisions et réalisés (plus petit = mieux).</p>
                    <p className="mt-1"><strong>MAPE</strong> : MAE ramenée au prix (en %).</p>
                    <p className="mt-1"><strong>Précision directionnelle</strong> : % de jours où la direction prévue (hausse/baisse) est correcte.</p>
                  </InfoTooltip>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-[var(--mut)]">
                  <li>MAE: <span className="text-white">{data.metrics.mae.toFixed(3)}</span></li>
                  <li>MAPE: <span className="text-white">{(data.metrics.mape*100).toFixed(2)}%</span></li>
                  <li>Précision directionnelle: <span className="text-white">{(data.metrics.hit_rate*100).toFixed(1)}%</span></li>
                  <li>Baseline MAE: <span className="text-white">{data.metrics.baseline_mae.toFixed(3)}</span></li>
                  <li>Modèle: <span className="text-white">{data.metrics.model}</span></li>
                </ul>
              </div>

              <div className="card p-6">
                <div className="font-semibold">
                  Confiance
                  <InfoTooltip label="Score de confiance">
                    <p>Lettre <strong>A–E</strong> basée sur l’avantage du modèle vs une prévision naïve (prix = hier).</p>
                    <p className="mt-1">A &gt;= 25% mieux • B &gt;= 10% • C &gt; 0% • D ≈ naïf • E &lt; naïf.</p>
                  </InfoTooltip>
                </div>
                <p className="mt-2">Score: <span className="font-semibold">{data.confidence}</span> (A=haut, E=faible)</p>
                <p className="text-sm text-[var(--mut)] mt-2">Prévisions indicatives. Aucune recommandation personnalisée.</p>
              </div>

              <div className="card p-6">
                <div className="font-semibold">Info</div>
                <p className="text-sm text-[var(--mut)] mt-2">Dernière mise à jour: {new Date(data.as_of).toLocaleDateString()}</p>
                <p className="text-sm text-[var(--mut)]">Horizons dispo: {data.horizons.join(", ")} jours</p>
              </div>
            </div>

            <Explainer title="Comment interpréter ce graphique ?">
              <ol className="list-decimal pl-5 space-y-2">
                <li><strong>Cours</strong> = historique réel.</li>
                <li><strong>P50</strong> = scénario médian ; <strong>P10–P90</strong> = fourchette 80%.</li>
                <li>La ligne verticale marque le passage au <strong>futur</strong>.</li>
                <li>Plus la bande est <strong>étroite</strong>, plus l’incertitude est limitée (pour ce modèle).</li>
                <li>Ces résultats <strong>ne garantissent rien</strong> et ne constituent pas un conseil.</li>
              </ol>
            </Explainer>
          </>
        )}
      </div>
    </>
  );
}
