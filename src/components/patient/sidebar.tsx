"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  PATIENT_BRAND,
  PATIENT_NAV_ITEMS,
} from "@/components/patient/nav";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePatient } from "@/lib/patient-context";

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  const last2 = words.slice(-2);
  return last2
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

export function PatientSidebar({
  className,
  collapsed = false,
}: {
  className?: string;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const { patient } = usePatient();

  const displayName = patient?.name ?? "Bệnh nhân";
  const displayCode = patient?.code ?? "---";
  const displayGender = patient?.gender ?? "---";
  const initials = patient?.name ? getInitials(patient.name) : "BN";

  return (
    <TooltipProvider delayDuration={120}>
      <aside
        data-collapsed={collapsed ? "true" : "false"}
        className={cn(
          "hidden lg:flex lg:flex-col lg:gap-4",
          "lg:rounded-3xl lg:border lg:border-white/70 lg:bg-white/80 lg:shadow-xl lg:backdrop-blur-md",
          "lg:dark:border-white/10 lg:dark:bg-slate-900/80",
          "transition-[width] duration-200 ease-in-out",
          collapsed ? "lg:w-[88px] lg:px-2 lg:py-4" : "lg:w-[272px] lg:p-4",
          className,
        )}
      >
        {/* Patient profile section */}
        {!collapsed ? (
          <div className="px-1 pt-2">
            {/* Brand row */}
            <div className="mb-3 flex items-center gap-2.5 px-1">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 text-white shadow-sm shadow-blue-200/50 dark:shadow-blue-900/30">
                <span className="text-xs font-bold">QC</span>
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">
                  {PATIENT_BRAND.name}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {PATIENT_BRAND.tagline}
                </div>
              </div>
            </div>

            {/* Patient card */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50/60 p-4 dark:from-blue-950/40 dark:to-teal-950/30">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 text-white shadow-md shadow-blue-200/50 dark:shadow-blue-900/30">
                  <span className="text-sm font-bold">{initials}</span>
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {displayName}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {displayCode}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Badge className="border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-xs">
                  {displayGender}
                </Badge>
                <span className="text-xs text-muted-foreground">Giới tính</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center pt-2">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 text-white shadow-sm">
              <span className="text-xs font-bold">{initials}</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={cn("flex-1", collapsed ? "px-0" : "px-1")}>
          {!collapsed ? (
            <div className="px-3 pb-2 pt-1 text-xs font-medium text-muted-foreground">
              Điều hướng
            </div>
          ) : null}
          <div className="grid gap-1">
            {PATIENT_NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname?.startsWith(`${item.href}/`);
              const Icon = item.icon;

              const link = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center rounded-2xl text-sm transition-all duration-200",
                    collapsed
                      ? "justify-center px-3 py-3"
                      : "gap-3 px-4 py-2.5",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md shadow-blue-200/50 dark:shadow-blue-900/30"
                      : "text-slate-600 hover:bg-blue-50/80 dark:text-slate-400 dark:hover:bg-slate-800/60",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-slate-400 dark:text-slate-500",
                    )}
                  />
                  {!collapsed ? (
                    <span className="truncate font-medium">{item.title}</span>
                  ) : null}
                </Link>
              );

              if (!collapsed) return <div key={item.href}>{link}</div>;

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </nav>

        {/* Footer – last visit info */}
        {!collapsed ? (
          <div className="px-1 pb-2">
            <div className="rounded-2xl border border-blue-100/80 bg-blue-50/60 p-3 dark:border-blue-900/30 dark:bg-blue-950/30">
              <div className="flex items-center gap-2">
                <Heart className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Lần khám gần nhất
                </span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                ---
              </div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-500" />
                <span className="text-xs text-teal-600 dark:text-teal-400">
                  Sức khỏe ổn định
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </aside>
    </TooltipProvider>
  );
}
