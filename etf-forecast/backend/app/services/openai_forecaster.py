from __future__ import annotations
import os, json
import pandas as pd
from typing import List
from datetime import date
from openai import OpenAI

# Client OpenAI (clé via env OPENAI_API_KEY)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM = (
    "You are a quantitative forecasting assistant. "
    "Given recent daily close prices for an ETF, produce a probabilistic forecast "
    "for the next N business days as three arrays of prices: p10, p50, p90. "
    "Return STRICT JSON with keys: p10, p50, p90 (equal length, positive floats). "
    "Assume lognormal dynamics; keep p50 smooth; p10<=p50<=p90 elementwise."
)

def llm_quantile_forecast(df: pd.DataFrame, future_dates: List[date]):
    last_price = float(df['close'].iloc[-1])
    horizon = len(future_dates)
    hist = df.tail(180).reset_index()  # date, close
    csv = hist.to_csv(index=False)

    user = (
        f"HORIZON_DAYS={horizon}\n"
        f"LAST_PRICE={last_price}\n"
        "HISTORY_CSV:\n"
        f"{csv}\n"
        "Return JSON only."
    )

    resp = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        messages=[{"role":"system","content":SYSTEM},{"role":"user","content":user}],
        temperature=0.3,
        response_format={"type":"json_object"},
    )
    data = json.loads(resp.choices[0].message.content)

    p10 = [float(x) for x in data["p10"]]
    p50 = [float(x) for x in data["p50"]]
    p90 = [float(x) for x in data["p90"]]

    out = pd.DataFrame({"p10": p10, "p50": p50, "p90": p90}, index=pd.to_datetime(future_dates))
    horizons = [7, 30, 90]
    metrics = {"model": "OpenAI LLM"}
    return out, horizons, metrics
