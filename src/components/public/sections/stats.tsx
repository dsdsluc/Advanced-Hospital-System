"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const stats = [
  { value: 50000, suffix: "+", label: "Bệnh nhân tin tưởng" },
  { value: 150, suffix: "+", label: "Bác sĩ & chuyên gia" },
  { value: 15, suffix: "", label: "Chuyên khoa" },
  { value: 98, suffix: "%", label: "Hài lòng dịch vụ" },
];

function AnimatedStat({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) =>
    v >= 1000 ? Math.round(v).toLocaleString("vi-VN") : Math.round(v).toString()
  );
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setTimeout(() => {
            animate(mv, value, { duration: 1.8, ease: "easeOut" });
          }, delay);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [mv, value, delay]);

  return (
    <div ref={ref} className="text-center text-white">
      <div className="text-4xl font-bold tracking-tight lg:text-5xl">
        <motion.span>{rounded}</motion.span>
        {suffix}
      </div>
      <div className="mt-2 text-sm text-white/70">{label}</div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="border-y bg-primary py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={i * 120}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
