// frontend/app/api/forecast/[ticker]/route.ts
// Renvoie l'historique réel (Yahoo) + prévisions P10/P50/P90 (OpenAI si clé présente, sinon fallback).

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Hist = { date: string; close: number };
type PathPoint = { date: string; actual: number | null; p10: number | null; p50: number | null; p90: number | null; };
type Metrics = { mae: number; mape: number; hit_rate: number; baseline_mae: number; model: string; };

// --- utils dates
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function isWeekday(d: Date) { const w = d.getDay(); return w !== 0 && w !== 6; }
function bizFwd(from: Date, n: number) {
  const out: Date[] = []; let d = new Date(from);
  while (out.length < n) { d = addDays(d, 1); if (isWeekday(d)) out.push(new Date(d)); }
  return out;
}

// --- Yahoo Finance (non officiel, sans clé). Fallback si échec.
async function fetchYahooHistory(ticker: string, range = "2y", interval = "1d"): Promise<Hist[]> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=${range}&interval=${interval}&events=div%2Csplit`;
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }});
  if (!r.ok) throw new Error(`Yahoo ${r.status}`);
  const j = await r.json();
  const res = j?.chart?.result?.[0];
  const ts: number[] = res?.timestamp ?? [];
  const closes: (number|null)[] = res?.indicators?.quote?.[0]?.close ?? [];
  const out: Hist[] = [];
  for (let i=0; i<ts.length; i++) {
    const c = closes[i];
    if (typeof c === "number" && Number.isFinite(c)) {
      const d = new Date(ts[i] * 1000).toISOString().slice(0,10);
      out.push({ date: d, close: c });
    }
  }
  if (!out.length) throw new Error("No data");
  return out;
}

// --- OpenAI (JSON strict) — nécessite OPENAI_API_KEY
async function llmQuantiles(historyCsv: string, lastPrice: number, horizon: number) {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const body = {
    model, temperature: 0.3, response_format: { type: "json_object" },
    messages: [
      { role: "system", content:
        "You are a quantitative forecasting assistant. Given recent daily close prices for an ETF, " +
        "produce a probabilistic forecast for the next N business days as three arrays of prices: p10, p50, p90. " +
        "Return STRICT JSON with keys: p10, p50, p90 (equal length, positive floats). " +
        "Assume lognormal dynamics; keep p50 smooth; p10<=p50<=p90 elementwise." },
      { role: "user", content:
        `HORIZON_DAYS=${horizon}\nLAST_PRICE=${lastPrice}\nHISTORY_CSV:\n${historyCsv}\nReturn JSON only.` }
    ],
  };
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`OpenAI ${resp.status} ${await resp.text()}`);
  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content) as { p10: number[]; p50: number[]; p90: number[] };
  return parsed;
}

export async function GET(req: Request, { params }: { params: { ticker: string } }) {
  const url = new URL(req.url);
  const days = Math.max(7, Math.min(180, parseInt(url.searchParams.get("days") || "90", 10)));
  const ticker = (params.ticker || "SPY").toUpperCase();

  // 1) Historique réel (Yahoo) ou fallback synthétique si échec
  let history: Hist[] = [];
  try {
    history = await fetchYahooHistory(ticker, "2y", "1d");
  } catch {
    // fallback stable par ticker
    let seed = Array.from(ticker).reduce((a,c)=>a+c.charCodeAt(0),0)>>>0;
    const rnd = () => ((seed = (1664525*seed+1013904223)>>>0)/0xffffffff);
    const muDaily=0.0003, sigDaily=0.012;
    // 250 jours ouvrés ~ 1 an
    const dates: string[] = [];
    let d = new Date(); for (let i=0;i<300;i++) { d = addDays(d,-1); if (isWeekday(d)) dates.push(d.toISOString().slice(0,10)); }
    dates.reverse();
    let p=500;
    history = dates.map(day=>{
      const eps = rnd()*2-1; const r = muDaily + sigDaily*eps*0.8; p = p*Math.exp(r);
      return { date: day, close: p };
    });
  }

  // 2) Points historiques pour le graphe (on garde ~ 250 derniers)
  const histTail = history.slice(-250);
  const histPoints: PathPoint[] = histTail.map(h => ({ date: h.date, actual: h.close, p10: null, p50: null, p90: null }));
  const lastPrice = histTail[histTail.length-1]?.close ?? 500;

  // 3) Prévisions : OpenAI si possible, sinon lognormal local
  const futDates = bizFwd(new Date(), days);
  let p10: number[] = [], p50: number[] = [], p90: number[] = [];
  let modelUsed = "Drift+Vol (local)";
  try {
    if (process.env.OPENAI_API_KEY) {
      const csv = ["date,close", ...histTail.map(h => `${h.date},${h.close}`)].join("\n");
      const out = await llmQuantiles(csv, lastPrice, futDates.length);
      if (out?.p10?.length===futDates.length && out?.p50?.length===futDates.length && out?.p90?.length===futDates.length) {
        p10 = out.p10.map(Number); p50 = out.p50.map(Number); p90 = out.p90.map(Number);
        modelUsed = "OpenAI LLM";
      } else { throw new Error("bad lengths"); }
    } else { throw new Error("no key"); }
  } catch {
    const z10=-1.2816, z50=0.0, z90=1.2816, mu=0.0003, sig=0.012;
    for (let i=1;i<=futDates.length;i++) {
      const mean = mu*i, std = sig*Math.sqrt(i);
      p10.push(lastPrice*Math.exp(mean+z10*std));
      p50.push(lastPrice*Math.exp(mean+z50*std));
      p90.push(lastPrice*Math.exp(mean+z90*std));
    }
  }
  const futPoints: PathPoint[] = futDates.map((d,i)=>({
    date: d.toISOString().slice(0,10), actual: null, p10: p10[i], p50: p50[i], p90: p90[i]
  }));

  // 4) Mini métriques placeholder (ton vrai backtest viendra côté API dédiée)
  const metrics: Metrics = { mae: 2.1, mape: 0.012, hit_rate: 0.54, baseline_mae: 2.7, model: modelUsed };

  return NextResponse.json({
    ticker,
    as_of: new Date().toISOString().slice(0,10),
    horizons: [7,30,90],
    path: [...histPoints, ...futPoints],
    metrics,
    confidence: modelUsed==="OpenAI LLM" ? "B" : "C",
  });
}
