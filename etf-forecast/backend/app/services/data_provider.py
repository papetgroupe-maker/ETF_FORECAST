from __future__ import annotations
import pandas as pd
from pathlib import Path
from datetime import date, timedelta

DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "sample"

def get_history_df(ticker: str) -> pd.DataFrame:
    """
    MVP: read local CSV under backend/app/data/sample/{ticker}.csv with columns: date, close
    If not found, try SPY as default. Index is datetime.
    """
    paths = [
        DATA_DIR / f"{ticker.upper()}.csv",
        DATA_DIR / "SPY.csv"
    ]
    for p in paths:
        if p.exists():
            df = pd.read_csv(p, parse_dates=["date"])
            df = df.sort_values("date").set_index("date")
            return df[["close"]].copy()
    return pd.DataFrame(columns=["close"])

class BusinessCalendar:
    """Simple business day calendar skipping weekends."""
    def next_business_days(self, start: date, days: int) -> list[date]:
        res = []
        d = start
        while len(res) < days:
            d = d + timedelta(days=1)
            if d.weekday() < 5:  # 0=Mon .. 4=Fri
                res.append(d)
        return res