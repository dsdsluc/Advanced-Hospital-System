"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, CalendarDays, ShieldCheck } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

import { Button } from "@/components/ui/button";

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          animate(mv, target, { duration: 1.6, ease: "easeOut" });
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [mv, target]);

  return (
    <div ref={ref} className="text-2xl font-semibold">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </div>
  );
}

const trustBadges = [
  "Bộ Y Tế cấp phép",
  "ISO 9001:2015",
  "JCI Accredited",
];

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=2400&q=80"
          alt="Môi trường bệnh viện hiện đại"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white ring-1 ring-white/15 backdrop-blur"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Tiêu chuẩn an toàn & chất lượng quốc tế</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl"
          >
            Chăm sóc sức khỏe{" "}
            <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              toàn diện
            </span>{" "}
            cho bạn và gia đình
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-4 text-base leading-7 text-white/80 sm:text-lg"
          >
            Hệ thống dịch vụ y tế hiện đại, bác sĩ giàu kinh nghiệm và quy trình đặt
            lịch nhanh chóng — tối ưu trải nghiệm từ lần khám đầu tiên.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="gap-2">
              <Link href="/auth/login">
                <CalendarDays className="h-4 w-4" />
                Đặt lịch khám
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 bg-white/10 text-white hover:bg-white/15"
            >
              <a href="#services">
                Xem dịch vụ <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-2"
          >
            {trustBadges.map((badge) => (
              <div
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur"
              >
                <ShieldCheck className="h-3 w-3 text-green-400" />
                {badge}
              </div>
            ))}
          </motion.div>

          {/* Stat counters */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5 }}
            className="mt-10 grid gap-4 sm:grid-cols-3"
          >
            <div className="rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/15 backdrop-blur">
              <div className="text-2xl font-semibold">24/7</div>
              <div className="mt-1 text-sm text-white/75">Hỗ trợ & tư vấn</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/15 backdrop-blur">
              <CountUp target={150} suffix="+" />
              <div className="mt-1 text-sm text-white/75">Bác sĩ & chuyên gia</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/15 backdrop-blur">
              <CountUp target={98} suffix="%" />
              <div className="mt-1 text-sm text-white/75">Hài lòng dịch vụ</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <a
          href="#services"
          aria-label="Cuộn xuống"
          className="flex animate-bounce items-center justify-center text-white/50 transition-colors hover:text-white/80"
        >
          <ChevronDown className="h-6 w-6" />
        </a>
      </div>
    </section>
  );
}
