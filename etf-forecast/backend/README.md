# Backend (FastAPI)

## Installation & démarrage
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export ALLOWED_ORIGINS=http://localhost:3000  # Windows PowerShell: $env:ALLOWED_ORIGINS="http://localhost:3000"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Endpoints:
- `GET /api/v1/health`
- `GET /api/v1/etf/trending`
- `GET /api/v1/etf/{ticker}/forecast?days=90`