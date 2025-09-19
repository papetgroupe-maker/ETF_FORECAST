"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// util simple pour composer les classes sans dépendance
function cx(...k: Array<string | false | null | undefined>) {
  return k.filter(Boolean).join(" ");
}

const links = [
  { href: "/", label: "Accueil" },
  { href: "/explore", label: "Explorer" },
  { href: "/methodology", label: "Méthodologie" },
  { href: "/glossary", label: "Glossaire" },
  { href: "/faq", label: "FAQ" },
  { href: "/pricing", label: "Tarifs" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg bg-black/30 border-b border-[var(--border)]">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          ETF Forecast
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cx(
                "px-3 py-2 rounded-xl text-sm hover:bg-white/5 transition-colors",
                pathname === l.href && "bg-white/5"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
