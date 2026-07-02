"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const COLORS = ["#B5854F", "#5E8C6A", "#F3ECE1", "#8A6135", "#C29A3B"];

type Particle = {
  id: number;
  x: number; // horizontal drift, px
  y: number; // vertical travel, px
  rot: number;
  size: number;
  color: string;
  delay: number;
};

/** Dependency-free celebratory burst. Mount it (keyed) to fire once; it
 *  renders ~26 particles that fly up and fade, then removes itself. */
export default function Confetti() {
  const [gone, setGone] = useState(false);

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 260,
        y: -(60 + Math.random() * 150),
        rot: (Math.random() - 0.5) * 540,
        size: 6 + Math.random() * 6,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.12,
      })),
    [],
  );

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1400);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-6 z-[60] flex justify-center">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 40, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rot, scale: 0.7 }}
          transition={{ duration: 1.1, delay: p.delay, ease: "easeOut" }}
          className="absolute rounded-[2px]"
          style={{
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}
