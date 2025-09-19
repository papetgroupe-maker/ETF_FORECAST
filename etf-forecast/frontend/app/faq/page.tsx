// frontend/app/faq/page.tsx
export default function FAQ() {
  const QA: Array<{ q: string; a: string }> = [
    {
      q: "Est-ce un conseil en investissement ?",
      a: "Non. Ce site fournit des outils statistiques indicatifs et n’offre aucune recommandation personnalisée."
    },
    {
      q: "Pourquoi mes bandes sont larges ?",
      a: "Volatilité élevée, faible historique exploitable ou incertitude forte pour l’actif étudié."
    },
    {
      q: "Quelle fréquence de mise à jour ?",
      a: "À chaque chargement : l’historique est rafraîchi et les prévisions sont recalculées."
    },
    {
      q: "Puis-je télécharger les données ?",
      a: "Bientôt : export CSV/PNG depuis la page ETF."
    }
  ];

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">FAQ</h1>
      <div className="grid gap-3">
        {QA.map(({ q, a }) => (
          <div key={q} className="card p-4">
            <div className="font-semibold">{q}</div>
            <p className="text-sm text-[var(--mut)] mt-1">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
