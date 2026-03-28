"use client";

import * as React from "react";
import Image from "next/image";

import { DoctorHeader } from "@/components/doctor/header";
import { DoctorSidebar } from "@/components/doctor/sidebar";

const STORAGE_KEY = "qc.doctorSidebarCollapsed";

export function DoctorShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === "1") setCollapsed(true);
    } catch {}
  }, []);

  const setAndStore = React.useCallback((next: boolean) => {
    setCollapsed(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {}
  }, []);

  return (
    <div className="relative min-h-screen p-4 lg:p-6">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2400&q=80"
          alt="Nền bệnh viện"
          fill
          priority
          sizes="100vw"
          className="object-cover blur-md"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/65 via-white/55 to-white/45 dark:from-black/70 dark:via-black/60 dark:to-black/55" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1600px] gap-4 lg:min-h-[calc(100vh-3rem)] lg:gap-6">
        <DoctorSidebar
          collapsed={collapsed}
          className="sticky top-6 h-[calc(100vh-3rem)]"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-6">
          <DoctorHeader
            className="sticky top-6"
            collapsed={collapsed}
            onToggleSidebar={() => setAndStore(!collapsed)}
          />
          <main className="min-w-0 flex-1 rounded-[2rem] border border-white/50 bg-white/40 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/40 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
