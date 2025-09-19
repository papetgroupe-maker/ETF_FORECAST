import "./../styles/globals.css";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const ThreeBG = dynamic(() => import("@/components/ThreeBG"), { ssr: false });

export const metadata: Metadata = {
  title: "ETF Forecast — Projections probabilistes pour ETF",
  description: "Cours réels, historique et prévisions P10/P50/P90. Design moderne, clair et rapide."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ThreeBG />
        <NavBar />
        <main className="container section">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
