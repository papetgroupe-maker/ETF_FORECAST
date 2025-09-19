export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-16">
      <div className="container py-8 text-sm text-[var(--mut)]">
        <p>
          Ce service fournit des outils d&apos;analyse et des projections statistiques,
          <span className="font-semibold"> sans conseil en investissement</span>. Les informations sont indicatives.
          Les performances passées ne préjugent pas des performances futures.
        </p>
        <p className="mt-3">© {new Date().getFullYear()} ETF Forecast</p>
      </div>
    </footer>
  );
}
