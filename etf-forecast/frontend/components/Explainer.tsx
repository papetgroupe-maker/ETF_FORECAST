"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Explainer({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{title}</div>
        <button onClick={() => setOpen(v => !v)} className="text-sm text-[var(--mut)] hover:text-white">
          {open ? "Masquer" : "Afficher"}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 text-sm text-[var(--mut)] leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
