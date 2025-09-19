{\rtf1\ansi\ansicpg1252\cocoartf2818
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww30040\viewh18900\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Next.js serverless route \'97 g\'e9n\'e8re P10/P50/P90 via OpenAI si la cl\'e9 existe,\
// sinon fallback local (drift + vol lognormale).\
import \{ NextResponse \} from "next/server";\
\
export const dynamic = "force-dynamic";\
\
type PathPoint = \{ date: string; actual: number | null; p10: number | null; p50: number | null; p90: number | null; \};\
type Metrics = \{ mae: number; mape: number; hit_rate: number; baseline_mae: number; model: string; \};\
\
function addDays(d: Date, n: number) \{ const x = new Date(d); x.setDate(x.getDate() + n); return x; \}\
function isWeekday(d: Date) \{ const w = d.getDay(); return w !== 0 && w !== 6; \}\
function bizBack(from: Date, n: number) \{\
  const out: Date[] = []; let d = new Date(from);\
  while (out.length < n) \{ d = addDays(d, -1); if (isWeekday(d)) out.push(new Date(d)); \}\
  return out.reverse();\
\}\
function bizFwd(from: Date, n: number) \{\
  const out: Date[] = []; let d = new Date(from);\
  while (out.length < n) \{ d = addDays(d, 1); if (isWeekday(d)) out.push(new Date(d)); \}\
  return out;\
\}\
\
async function llmQuantiles(historyCsv: string, lastPrice: number, horizon: number) \{\
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";\
  const body = \{\
    model,\
    temperature: 0.3,\
    response_format: \{ type: "json_object" \},\
    messages: [\
      \{\
        role: "system",\
        content:\
          "You are a quantitative forecasting assistant. Given recent daily close prices for an ETF, " +\
          "produce a probabilistic forecast for the next N business days as three arrays of prices: p10, p50, p90. " +\
          "Return STRICT JSON with keys: p10, p50, p90 (equal length, positive floats). " +\
          "Assume lognormal dynamics; keep p50 smooth; p10<=p50<=p90 elementwise."\
      \},\
      \{\
        role: "user",\
        content:\
          `HORIZON_DAYS=$\{horizon\}\\nLAST_PRICE=$\{lastPrice\}\\nHISTORY_CSV:\\n$\{historyCsv\}\\nReturn JSON only.`\
      \}\
    ],\
  \};\
\
  const resp = await fetch("https://api.openai.com/v1/chat/completions", \{\
    method: "POST",\
    headers: \{\
      "Content-Type": "application/json",\
      "Authorization": `Bearer $\{process.env.OPENAI_API_KEY\}`,\
    \},\
    body: JSON.stringify(body),\
  \});\
\
  if (!resp.ok) \{\
    const t = await resp.text();\
    throw new Error(`OpenAI error: $\{resp.status\} $\{t\}`);\
  \}\
  const data = await resp.json();\
  const content = data.choices?.[0]?.message?.content ?? "\{\}";\
  return JSON.parse(content) as \{ p10: number[]; p50: number[]; p90: number[] \};\
\}\
\
export async function GET(req: Request, \{ params \}: \{ params: \{ ticker: string \} \}) \{\
  const url = new URL(req.url);\
  const days = Math.max(7, Math.min(180, parseInt(url.searchParams.get("days") || "90", 10)));\
  const ticker = (params.ticker || "SPY").toUpperCase();\
\
  // 1) Historique synth\'e9tique court pour l\'92affichage (90 jours ouvr\'e9s)\
  const muDaily = 0.0003, sigDaily = 0.012;\
  const histDates = bizBack(new Date(), 90);\
  let price = 500; // base mock\
  // RNG d\'e9terministe par ticker pour un rendu stable\
  let seed = Array.from(ticker).reduce((a,c)=>a + c.charCodeAt(0), 0) >>> 0;\
  const rnd = () => (seed = (1664525 * seed + 1013904223) >>> 0) / 0xffffffff;\
\
  const histPoints: PathPoint[] = histDates.map(d => \{\
    const eps = (rnd() * 2 - 1);\
    const r = muDaily + sigDaily * eps * 0.8;\
    price = price * Math.exp(r);\
    return \{ date: d.toISOString().slice(0,10), actual: price, p10: null, p50: null, p90: null \};\
  \});\
\
  const lastPrice = histPoints[histPoints.length - 1].actual || 500;\
\
  // 2) Pr\'e9visions : tente OpenAI si cl\'e9 pr\'e9sente, sinon fallback local\
  const futDates = bizFwd(new Date(), days);\
  let p10: number[] = [], p50: number[] = [], p90: number[] = [];\
  let modelUsed = "Drift+Vol (local)";\
\
  try \{\
    if (process.env.OPENAI_API_KEY) \{\
      const csv = ["date,close", ...histPoints.map(p => `$\{p.date\},$\{p.actual\}`)].join("\\n");\
      const out = await llmQuantiles(csv, lastPrice, futDates.length);\
      p10 = out.p10; p50 = out.p50; p90 = out.p90;\
      // Si l\'92LLM renvoie une longueur incorrecte on retombe sur le fallback\
      if (!(p10?.length === futDates.length && p50?.length === futDates.length && p90?.length === futDates.length)) \{\
        throw new Error("Bad LLM lengths");\
      \}\
      modelUsed = "OpenAI LLM";\
    \} else \{\
      throw new Error("No OPENAI_API_KEY");\
    \}\
  \} catch \{\
    // Fallback quantiles lognormaux\
    const z10 = -1.2816, z50 = 0.0, z90 = 1.2816;\
    for (let i=1; i<=futDates.length; i++) \{\
      const mean = muDaily * i;\
      const std  = sigDaily * Math.sqrt(i);\
      p10.push( lastPrice * Math.exp(mean + z10*std) );\
      p50.push( lastPrice * Math.exp(mean + z50*std) );\
      p90.push( lastPrice * Math.exp(mean + z90*std) );\
    \}\
  \}\
\
  const futPoints: PathPoint[] = futDates.map((d, i) => (\{\
    date: d.toISOString().slice(0,10),\
    actual: null, p10: p10[i], p50: p50[i], p90: p90[i],\
  \}));\
\
  const metrics: Metrics = \{ mae: 2.1, mape: 0.012, hit_rate: 0.54, baseline_mae: 2.7, model: modelUsed \};\
\
  return NextResponse.json(\{\
    ticker,\
    as_of: new Date().toISOString().slice(0,10),\
    horizons: [7,30,90],\
    path: [...histPoints, ...futPoints],\
    metrics,\
    confidence: modelUsed === "OpenAI LLM" ? "B" : "C",\
  \});\
\}}