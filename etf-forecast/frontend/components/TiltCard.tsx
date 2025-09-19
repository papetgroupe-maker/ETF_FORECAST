"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { PropsWithChildren } from "react";

export default function TiltCard({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rX = useTransform(y, [-50, 50], [8, -8]);
  const rY = useTransform(x, [-50, 50], [-8, 8]);

  return (
    <motion.div
      className={className}
      style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
