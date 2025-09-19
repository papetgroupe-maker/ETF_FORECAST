from __future__ import annotations
import numpy as np
import pandas as pd

def _log_returns(close: pd.Series) -> pd.Series:
    return np.log(close).diff().dropna()

def _agg_quantiles(mu: float, sigma: float, horizon: int):
    # Normal aggregation: mean scales with t, std scales with sqrt(t)
    mean = mu * horizon
    std = sigma * np.sqrt(horizon)
    # Approximate 10/50/90% quantiles
    z10, z50, z90 = -1.2816, 0.0, 1.2816
    return (mean + z10*std, mean + z50*std, mean + z90*std)

def quantile_forecast(df: pd.DataFrame, future_dates: list):
    """
    Very simple MVP model:
      - Estimate daily log return mu & sigma on the last 120 obs
      - Project P10/P50/P90 on future horizons using lognormal aggregation
    Returns a DataFrame indexed by future_dates with columns p10,p50,p90 and horizons list [7,30,90]
    """
    close = df["close"].astype(float)
    lr = _log_returns(close)
    window = min(120, len(lr))
    mu = lr.tail(window).mean()
    sigma = lr.tail(window).std(ddof=1) or 1e-6
    last_price = close.iloc[-1]

    p10s, p50s, p90s = [], [], []
    for i, d in enumerate(future_dates, start=1):
        q10, q50, q90 = _agg_quantiles(mu, sigma, i)
        p10s.append(float(last_price * np.exp(q10)))
        p50s.append(float(last_price * np.exp(q50)))
        p90s.append(float(last_price * np.exp(q90)))

    out = pd.DataFrame({"p10": p10s, "p50": p50s, "p90": p90s}, index=pd.to_datetime(future_dates))
    horizons = [7, 30, 90]
    metrics = {"model": "Drift+Vol (lognormal)"}
    return out, horizons, metrics

def backtest_metrics(df: pd.DataFrame) -> dict:
    """
    Walk-forward backtest (very light):
      - For each t after warmup (120 obs), fit mu,sigma on window and predict next-day p50
      - Compute MAE, MAPE and directional hit-rate vs actual next day
      - Baseline: naive (predict next day's price = today's price)
    """
    close = df["close"].astype(float).copy()
    lr = np.log(close).diff()
    warmup = 120
    preds, actuals, base_preds = [], [], []
    for i in range(warmup, len(close)-1):
        window_lr = lr.iloc[max(1, i-warmup+1):i+1].dropna()
        if len(window_lr) < 10: 
            continue
        mu = window_lr.mean()
        sigma = window_lr.std(ddof=1) or 1e-6
        p_t = close.iloc[i]
        # next-day quantile median
        p50_next = p_t * np.exp(mu)
        preds.append(p50_next)
        actuals.append(close.iloc[i+1])
        base_preds.append(p_t)  # naive

    if len(actuals) == 0:
        return {"mae": 0.0, "mape": 0.0, "hit_rate": 0.5, "baseline_mae": 0.0, "model": "Drift+Vol (lognormal)"}

    import numpy as _np
    actuals = _np.array(actuals)
    preds = _np.array(preds)
    base_preds = _np.array(base_preds)

    mae = float(_np.mean(_np.abs(preds - actuals)))
    mape = float(_np.mean(_np.abs((preds - actuals) / (actuals + 1e-9))))
    # Directional accuracy: compare sign of next-day return vs predicted next-day change
    actual_rets = _np.sign(_np.diff(_np.r_[close.iloc[warmup-1], actuals]))
    pred_rets = _np.sign(preds - close.iloc[warmup: len(close)-1])
    hit = float(_np.mean(actual_rets == pred_rets))
    baseline_mae = float(_np.mean(_np.abs(base_preds - actuals)))

    return {"mae": mae, "mape": mape, "hit_rate": hit, "baseline_mae": baseline_mae, "model": "Drift+Vol (lognormal)"}