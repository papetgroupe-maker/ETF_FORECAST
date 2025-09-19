import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-8">
      <section className="text-center card p-8">
        <h1 className="text-3xl md:text-5xl font-bold">Des prévisions ETF claires, chiffrées et transparentes.</h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Projections probabilistes (P10/P50/P90) à 1 semaine, 1 mois, 3 mois. Backtests publics. Pas de promesses, des chiffres.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <a href="/explore" className="btn btn-primary">Essayer gratuitement</a>
          <a href="/methodology" className="btn">Voir la méthodologie</a>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          {title: "Prévisions probabilistes", desc: "Rubans P10 / P50 / P90 avec score de confiance."},
          {title: "Transparence totale", desc: "Backtests, métriques publiques, aucune magie noire."},
          {title: "Alertes intelligentes", desc: "Bientôt : alertes quand la proba de baisse monte."}
        ].map((f, i) => (
          <div key={i} className="card p-6">
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-gray-600 mt-2">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}