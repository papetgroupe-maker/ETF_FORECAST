"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem("etf-onboard-v1");
    if (!seen) setOpen(true);
  }, []);
  const close = () => { setOpen(false); if (typeof window !== "undefined") localStorage.setItem("etf-onboard-v1", "1"); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-black/50"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            initial={{ y: 30, opacity: 0, scale: .98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: .98 }}
            className="card w-[min(92vw,640px)] p-6"
          >
            <h3 className="text-xl font-semibold">Bienvenue 👋</h3>
            <p className="text-[var(--mut)] mt-2">
              Ici, vous visualisez le <strong>cours réel</strong>, l’historique et des <strong>prévisions probabilistes</strong>
              (bandes <em>P10 / P50 / P90</em>). Ce n’est <strong>pas</strong> un conseil en investissement.
            </p>
            <ul className="list-disc pl-5 mt-3 text-sm text-[var(--mut)] space-y-1">
              <li><strong>P50</strong> = scénario médian ; <strong>P10 / P90</strong> encadrent 80% des cas attendus.</li>
              <li>La précision varie selon les actifs et le contexte de marché.</li>
              <li>Consultez <Link href="/methodology">Méthodologie</Link> et <Link href="/glossary">Glossaire</Link>.</li>
            </ul>
            <div className="mt-4 flex justify-end">
              <button onClick={close} className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white">Commencer</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
