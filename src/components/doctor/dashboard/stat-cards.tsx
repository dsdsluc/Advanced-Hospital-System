"use client";

import { CalendarCheck, ClipboardList, Clock, Users } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDoctor } from "@/lib/doctor-context";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "primary" | "secondary";
}) {
  return (
    <Card className="transition-shadow hover:shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "grid h-10 w-10 place-items-center rounded-xl border bg-background",
            accent === "primary" && "border-primary/20 bg-primary/10 text-primary",
            accent === "secondary" &&
              "border-secondary/20 bg-secondary/10 text-secondary",
            !accent && "border-border text-muted-foreground",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function StatSkeleton() {
  return (
    <Card className="transition-shadow hover:shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-1 h-8 w-12" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

export function DoctorStatCards() {
  const { doctorId } = useDoctor();
  const [stats, setStats] = useState<{
    todayAppointments: number;
    totalPatients: number;
    upcomingAppointments: number;
    completedThisMonth: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doctorId) {
      setStats(null);
      return;
    }

    setLoading(true);
    fetch(`/api/doctor/dashboard?doctorId=${doctorId}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setStats(d.stats))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [doctorId]);

  if (!doctorId) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300">
        Vui lòng chọn tài khoản bác sĩ để xem thống kê
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    );
  }

  const STATS = [
    {
      title: "Lịch khám hôm nay",
      value: stats.todayAppointments.toString(),
      subtitle: `${stats.todayAppointments} cuộc khám`,
      icon: CalendarCheck,
      accent: "primary" as const,
    },
    {
      title: "Bệnh nhân của tôi",
      value: stats.totalPatients.toString(),
      subtitle: `Tổng cộng ${stats.totalPatients} bệnh nhân`,
      icon: Users,
      accent: "secondary" as const,
    },
    {
      title: "Lịch hẹn sắp tới",
      value: stats.upcomingAppointments.toString(),
      subtitle: "7 ngày tới",
      icon: Clock,
      accent: undefined,
    },
    {
      title: "Hoàn tất tháng này",
      value: stats.completedThisMonth.toString(),
      subtitle: "Cuộc khám đã hoàn tất",
      icon: ClipboardList,
      accent: undefined,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {STATS.map((s) => (
        <StatCard key={s.title} {...s} />
      ))}
    </div>
  );
}
