from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import date
import os

from .services.data_provider import get_history_df, BusinessCalendar
from .services.models import quantile_forecast, backtest_metrics
from .services.openai_forecaster import llm_quantile_forecast

app = FastAPI(title="ETF Forecast API", version="0.2.0")

origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TrendingOut(BaseModel):
    tickers: list[str]

@app.get("/api/v1/health")
def health():
    return {"status": "ok"}

@app.get("/api/v1/etf/trending", response_model=TrendingOut)
def trending():
    return {"tickers": ["SPY", "QQQ", "EEM", "IEMB", "HYG", "GLD", "TLT"]}

class PathPoint(BaseModel):
    date: str
    actual: float | None
    p10: float | None
    p50: float | None
    p90: float | None

class Metrics(BaseModel):
    mae: float
    mape: float
    hit_rate: float
    baseline_mae: float
    model: str

class ForecastOut(BaseModel):
    ticker: str
    as_of: str
    horizons: list[int]
    path: list[PathPoint]
    metrics: Metrics
    confidence: str

@app.get("/api/v1/etf/{ticker}/forecast", response_model=ForecastOut)
def forecast(ticker: str, days: int = 90):
    df = get_history_df(ticker.upper())
    if df.empty or len(df) < 60:
        return ForecastOut(
            ticker=ticker.upper(),
            as_of=date.today().isoformat(),
            horizons=[7, 30, 90][: max(1, days//30)],
            path=[],
            metrics=Metrics(mae=0.0, mape=0.0, hit_rate=0.0, baseline_mae=0.0, model="NA"),
            confidence="E",
        )

    cal = BusinessCalendar()
    future_dates = cal.next_business_days(date.today(), days)

    engine = os.getenv("FORECAST_ENGINE", "auto")
    use_llm = engine == "llm" or (engine == "auto" and os.getenv("OPENAI_API_KEY"))

    try:
        if use_llm:
            path_df, horizons, _ = llm_quantile_forecast(df, future_dates)
        else:
            path_df, horizons, _ = quantile_forecast(df, future_dates)
    except Exception:
        # fallback robuste si l'LLM échoue
        path_df, horizons, _ = quantile_forecast(df, future_dates)

    # Historique (90j) + futur
    hist_tail = df.tail(90).copy()
    hist_points = [
        PathPoint(date=d.strftime("%Y-%m-%d"), actual=float(v), p10=None, p50=None, p90=None)
        for d, v in zip(hist_tail.index, hist_tail["close"])
    ]
    fut_points = [
        PathPoint(
            date=d.strftime("%Y-%m-%d"),
            actual=None,
            p10=float(row["p10"]),
            p50=float(row["p50"]),
            p90=float(row["p90"]),
        )
        for d, row in path_df.iterrows()
    ]

    m = backtest_metrics(df)
    rel = (m["baseline_mae"] + 1e-9) / (m["mae"] + 1e-9)
    if rel > 1.25:
        conf = "A"
    elif rel > 1.10:
        conf = "B"
    elif rel > 1.0:
        conf = "C"
    elif rel > 0.9:
        conf = "D"
    else:
        conf = "E"

    return ForecastOut(
        ticker=ticker.upper(),
        as_of=date.today().isoformat(),
        horizons=horizons,
        path=hist_points + fut_points,
        metrics=Metrics(mae=float(m["mae"]), mape=float(m["mape"]), hit_rate=float(m["hit_rate"]),
                        baseline_mae=float(m["baseline_mae"]), model=m["model"]),
        confidence=conf,
    )
