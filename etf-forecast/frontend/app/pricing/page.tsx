export default function Pricing() {
  const plans = [
    {name: "Gratuit", price: "0 €", features: ["5 ETF", "Prévisions 1 semaine", "Mise à jour hebdo"], cta:"Commencer"},
    {name: "Pro", price: "19 €/mois", features: ["ETF illimités", "1–3 mois", "MAJ quotidienne", "Exports & alertes"], cta:"Souscrire"},
    {name: "Teams", price: "49 €/mois", features: ["5 sièges", "Dossiers partagés", "API limitée"], cta:"Nous contacter"}
  ];
  return (
    <div className="grid gap-8">
      <h1 className="text-2xl font-bold">Tarifs simples</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(p => (
          <div key={p.name} className="card p-6">
            <div className="text-lg font-semibold">{p.name}</div>
            <div className="text-3xl font-bold mt-2">{p.price}</div>
            <ul className="mt-4 space-y-2 text-gray-700">
              {p.features.map(f => <li key={f}>• {f}</li>)}
            </ul>
            <button className="btn btn-primary mt-6 w-full">{p.cta}</button>
          </div>
        ))}
      </div>
    </div>
  );
}