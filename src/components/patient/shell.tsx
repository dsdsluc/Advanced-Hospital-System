"use client";

import * as React from "react";

import { PatientHeader } from "@/components/patient/header";
import { PatientSidebar } from "@/components/patient/sidebar";

const STORAGE_KEY = "qc.patientSidebarCollapsed";

export function PatientShell({ children }: { children: React.ReactNode }) {
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
    <div className="relative min-h-screen">
      {/* Soft gradient background with decorative blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50/70 to-teal-50/40 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-950" />
        <div className="absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/20" />
        <div className="absolute left-1/4 top-1/3 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-900/15" />
        <div className="absolute -left-32 bottom-1/4 h-96 w-96 rounded-full bg-sky-200/25 blur-3xl dark:bg-sky-900/15" />
        <div className="absolute bottom-16 right-1/3 h-60 w-60 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-900/10" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] gap-4 p-4 lg:gap-6 lg:p-6">
        <PatientSidebar
          collapsed={collapsed}
          className="sticky top-6 h-[calc(100vh-3rem)]"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-6">
          <PatientHeader
            className="sticky top-6"
            collapsed={collapsed}
            onToggleSidebar={() => setAndStore(!collapsed)}
          />
          <main className="min-w-0 flex-1 rounded-3xl border border-white/60 bg-white/50 p-6 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/50 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
