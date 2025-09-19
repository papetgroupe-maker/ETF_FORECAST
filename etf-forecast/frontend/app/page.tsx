import Link from "next/link";
import TiltCard from "@/components/TiltCard";

export default function Home() {
  return (
    <div className="grid gap-10">
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Prévisions ETF <span className="text-brand-500">claires</span> et <span className="text-brand-500">probabilistes</span>
          </h1>
          <p className="text-[var(--mut)] mt-4 max-w-xl">
            Visualisez le cours <em>réel</em>, l’historique et des scénarios P10/P50/P90.
            Un design sobre, rapide et moderne — sans conseil en investissement.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/explore" className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white">Explorer les ETF</Link>
            <Link href="/methodology" className="px-4 py-2 rounded-xl border border-[var(--border)]">Méthodologie</Link>
          </div>
        </div>
        <TiltCard className="card p-6">
          <div className="aspect-[16/10] w-full rounded-xl bg-gradient-to-br from-brand-600/20 to-purple-600/20 border border-[var(--border)]" />
          <div className="mt-4 text-sm text-[var(--mut)]">
            Astuce : passez sur <strong>SPY</strong>, <strong>QQQ</strong>, <strong>GLD</strong>, <strong>TLT</strong>…
          </div>
        </TiltCard>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "Historique + Prévisions", desc: "Sur un seul graphe, avec bandes P10/P50/P90." },
          { title: "Design sobre & moderne", desc: "Glassmorphism, fonds 3D subtils et interactions fluides." },
          { title: "Catalogue exhaustif", desc: "Recherche + filtres (classe d’actifs, région, secteur)." }
        ].map((f) => (
          <div key={f.title} className="card p-5">
            <div className="font-semibold">{f.title}</div>
            <p className="text-sm text-[var(--mut)] mt-2">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
