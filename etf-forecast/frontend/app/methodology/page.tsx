export default function Methodology() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">Méthodologie</h1>

      <div className="card p-6">
        <h2 className="font-semibold">Aperçu</h2>
        <p className="text-sm text-[var(--mut)] mt-2">
          Les prévisions affichent trois courbes : <strong>P10</strong>, <strong>P50</strong> (médiane) et <strong>P90</strong>.
          Elles représentent un intervalle de confiance <em>indicatif</em> de 80% selon notre moteur de projection.
        </p>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold">Pipeline de données</h2>
        <ul className="list-disc pl-5 text-sm text-[var(--mut)] mt-2 space-y-1">
          <li>Historique de prix quotididiens (close) par ETF (source: Yahoo Chart API / provider équivalent).</li>
          <li>Nettoyage basique (tri chronologique, suppression des valeurs manquantes/anormales).</li>
          <li>Index business days ; l’axe temps ignore week-ends/jours fériés.</li>
        </ul>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold">Modèles</h2>
        <p className="text-sm text-[var(--mut)] mt-2">
          Par défaut, nous utilisons un modèle lognormal <em>drift + volatilité</em> sur les rendements pour approximer les quantiles.
          Si une clé est fournie, un moteur <strong>LLM</strong> (OpenAI) génère des trajectoires P10/P50/P90 en JSON strict à partir de l’historique récent.
        </p>
        <ul className="list-disc pl-5 text-sm text-[var(--mut)] mt-2 space-y-1">
          <li><strong>Lognormal</strong> : μ agrégé linéairement, σ par √t ; quantiles via seuils z (±1.2816 pour 10/90%).</li>
          <li><strong>LLM</strong> : consignes de robustesse (monotonicité P10≤P50≤P90, cohérence horizon) + fallback si sortie invalide.</li>
        </ul>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold">Évaluation</h2>
        <p className="text-sm text-[var(--mut)] mt-2">
          Un backtest léger calcule <strong>MAE</strong>, <strong>MAPE</strong> et la <strong>précision directionnelle</strong> vs baseline naïve
          (prix demain = prix aujourd’hui). Le score de confiance A–E reflète l’avantage relatif.
        </p>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold">Limites & Risques</h2>
        <ul className="list-disc pl-5 text-sm text-[var(--mut)] mt-2 space-y-1">
          <li>Les résultats sont indicatifs, sensibles au contexte de marché, aux ruptures de régime et aux chocs exogènes.</li>
          <li>Les données peuvent contenir du bruit ; l’agrégation de volatilité est une approximation.</li>
          <li>Les performances passées ne préjugent pas des performances futures.</li>
        </ul>
        <p className="text-xs text-[var(--mut)] mt-2">Ce site n’offre pas de conseil en investissement ni de recommandation personnalisée.</p>
      </div>
    </div>
  );
}
