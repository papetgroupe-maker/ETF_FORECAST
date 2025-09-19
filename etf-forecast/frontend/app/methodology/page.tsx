export default function Methodology() {
  return (
    <article className="prose max-w-none">
      <h1>Méthodologie</h1>
      <p>
        Nos prévisions reposent sur un pipeline statistique simple pour le MVP : estimation de la dérive et de la volatilité 
        des rendements journaliers, puis projection des quantiles P10/P50/P90 par agrégation sur l&apos;horizon (√t).
      </p>
      <h2>Validation</h2>
      <ul>
        <li>Découpage <em>walk-forward</em> mensuel, sans fuite de données.</li>
        <li>Métriques publiées : MAE, MAPE, précision directionnelle.</li>
        <li>Comparaison à une baseline naïve (Buy & Hold / Marche aléatoire).</li>
      </ul>
      <h2>Transparence</h2>
      <p>
        Les hypothèses, les données et le code de calcul sont documentés côté API. Aucune recommandation personnalisée n&apos;est fournie.
      </p>
    </article>
  );
}