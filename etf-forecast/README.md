# ETF Forecast — MVP complet (Frontend + Backend)

## Aperçu
- **Frontend** : Next.js 14 + Tailwind + Recharts
- **Backend** : FastAPI (prévisions P10/P50/P90 via drift+volatilité)
- **Données** : échantillon local `SPY.csv` (synthétique) pour démonstration

## Démarrer en local
1) **API**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export ALLOWED_ORIGINS=http://localhost:3000
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2) **Frontend**
```bash
cd frontend
npm i
export NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
npm run dev
```
Ouvrez `http://localhost:3000`, explorez un ETF (ex: **SPY**), consultez les bandes **P10/P50/P90** et les métriques.

## Notes
- Le modèle MVP utilise une hypothèse **lognormale** basée sur la dérive et la volatilité des rendements.
- La page **/methodology** documente les hypothèses; aucune recommandation personnalisée n'est fournie.
- Remplacez le provider de données par un service autorisé (EODHD, Twelve Data, etc.) pour la prod.
- Ajoutez l’auth et la facturation (Stripe/Paddle) ultérieurement.

## Licence & conformité
Ce code est fourni à titre de démonstration. Vous êtes responsable de la conformité (AMF/MiFID II) et des licences de données.