import "./../styles/globals.css";
import Link from "next/link";

export const metadata = {
  title: "ETF Forecast — Projections probabilistes transparentes",
  description: "Des projections ETF claires, chiffrées et transparentes. Pas de promesses, des chiffres."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header className="border-b">
          <nav className="container flex items-center justify-between py-4">
            <Link className="font-semibold" href="/">ETF Forecast</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/explore">Explorer</Link>
              <Link href="/methodology">Méthodologie</Link>
              <Link href="/pricing">Tarifs</Link>
            </div>
          </nav>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="border-t mt-10">
          <div className="container py-6 text-sm text-gray-600">
            <p>
              Ce service fournit des outils d’analyse et des projections statistiques, <strong>sans conseil en investissement</strong>. 
              Les informations sont données à titre indicatif. Les performances passées ne préjugent pas des performances futures. 
              Vous restez seul responsable de vos décisions.
            </p>
            <p className="mt-2">© {new Date().getFullYear()} ETF Forecast</p>
          </div>
        </footer>
      </body>
    </html>
  );
}