// frontend/app/glossary/page.tsx
export default function Glossary() {
  const TERMS: { term: string; def: string }[] = [
    { term: "P10 / P50 / P90", def: "Quantiles (10e, médian, 90e). P10–P90 encadre ~80% des issues attendues par le modèle." },
    { term: "Bande 80%", def: "Zone entre P10 et P90. Plus étroite = incertitude estimée plus faible (selon le modèle)." },
    { term: "MAE", def: "Mean Absolute Error — erreur moyenne absolue entre prévision et réalisé (en unités de prix)." },
    { term: "MAPE", def: "Mean Absolute Percentage Error — MAE rapportée au prix (en %)." },
    { term: "Précision directionnelle", def: "Proportion de jours où la direction (hausse/baisse) prévue est correcte." },
    { term: "Baseline naïve", def: "Référence simpliste : prix(t+1) = prix(t)." },
    { term: "Volatilité", def: "Amplitude moyenne des variations de prix ; agrégée en √t dans le cadre lognormal." },
    { term: "Horizon", def: "Nombre de jours ouvrés dans le futur couverts par la prévision." }
  ];

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">Glossaire</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {TERMS.map((t) => (
          <div key={t.term} className="card p-4">
            <div className="font-semibold">{t.term}</div>
            <p className="text-sm text-[var(--mut)] mt-1">{t.def}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
