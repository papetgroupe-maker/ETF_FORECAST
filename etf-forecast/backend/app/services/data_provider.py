from __future__ import annotations
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import date, timedelta

DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "sample"

def _synthetic_history(ticker: str, periods: int = 400, start_price: float = 500.0,
                       mu_daily: float = 0.0003, sigma_daily: float = 0.012) -> pd.DataFrame:
    """Historique boursier synthétique (jours ouvrés) reproductible par ticker."""
    seed = abs(hash(ticker.upper())) % (2**32)
    rng = np.random.default_rng(seed)
    dates = pd.bdate_range(end=pd.Timestamp.today().normalize(), periods=periods)
    rets = rng.normal(mu_daily, sigma_daily, periods)
    price = start_price * np.exp(np.cumsum(rets))
    df = pd.DataFrame({"close": price}, index=dates)
    df.index.name = "date"
    return df[["close"]]

def get_history_df(ticker: str) -> pd.DataFrame:
    """
    1) Essaye CSV local backend/app/data/sample/{TICKER}.csv
    2) Sinon SPY.csv si dispo
    3) Sinon génère un historique synthétique (aucune clé externe)
    """
    ticker = ticker.upper()
    p_ticker = DATA_DIR / f"{ticker}.csv"
    if p_ticker.exists():
        df = pd.read_csv(p_ticker, parse_dates=["date"]).sort_values("date").set_index("date")
        return df[["close"]].astype(float)

    p_spy = DATA_DIR / "SPY.csv"
    if p_spy.exists():
        df = pd.read_csv(p_spy, parse_dates=["date"]).sort_values("date").set_index("date")
        return df[["close"]].astype(float)

    return _synthetic_history(ticker)

class BusinessCalendar:
    """Jours ouvrés (lun→ven)."""
    def next_business_days(self, start: date, days: int) -> list[date]:
        res = []
        d = start
        while len(res) < days:
            d = d + timedelta(days=1)
            if d.weekday() < 5:
                res.append(d)
        return res
