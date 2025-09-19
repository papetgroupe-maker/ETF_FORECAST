"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InfoTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        aria-label={`Info: ${label}`}
        onClick={() => setOpen((v) => !v)}
        className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border)] text-xs text-[var(--mut)] hover:text-white hover:border-white/40"
        type="button"
      >i</button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: .98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: .98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute left-1/2 z-50 w-[280px] -translate-x-1/2 -translate-y-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-[13px] shadow-soft"
          >
            <div className="mb-1 font-medium text-sm">{label}</div>
            <div className="text-[var(--mut)] leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
