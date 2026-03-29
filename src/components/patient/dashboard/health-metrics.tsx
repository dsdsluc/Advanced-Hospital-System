import {
  Activity,
  Heart,
  Scale,
  TrendingDown,
  TrendingUp,
  Wind,
} from "lucide-react";
import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricStatus = "normal" | "good" | "warning";
type MetricTrend = "up" | "down" | "stable";

type HealthMetric = {
  label: string;
  value: string;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  status: MetricStatus;
  statusLabel: string;
  trend: MetricTrend;
  trendLabel: string;
  updatedAt: string;
};

const STATUS_STYLES: Record<MetricStatus, string> = {
  normal:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300",
  good: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
  warning:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
};

const METRICS: HealthMetric[] = [
  {
    label: "Nhịp tim",
    value: "72",
    unit: "bpm",
    icon: Heart,
    iconBg: "bg-rose-50 dark:bg-rose-950/30",
    iconColor: "text-rose-500",
    status: "normal",
    statusLabel: "Bình thường",
    trend: "stable",
    trendLabel: "Ổn định",
    updatedAt: "Hôm nay, 08:30",
  },
  {
    label: "Huyết áp",
    value: "120/80",
    unit: "mmHg",
    icon: Activity,
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-500",
    status: "good",
    statusLabel: "Tốt",
    trend: "down",
    trendLabel: "Giảm nhẹ",
    updatedAt: "Hôm qua, 14:00",
  },
  {
    label: "Cân nặng",
    value: "68",
    unit: "kg",
    icon: Scale,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-500",
    status: "normal",
    statusLabel: "Bình thường",
    trend: "stable",
    trendLabel: "Không đổi",
    updatedAt: "22/03/2026",
  },
  {
    label: "BMI",
    value: "23.4",
    unit: "",
    icon: Wind,
    iconBg: "bg-violet-50 dark:bg-violet-950/30",
    iconColor: "text-violet-500",
    status: "normal",
    statusLabel: "Lý tưởng",
    trend: "stable",
    trendLabel: "Duy trì tốt",
    updatedAt: "22/03/2026",
  },
];

function TrendIcon({ trend }: { trend: MetricTrend }) {
  if (trend === "up")
    return <TrendingUp className="h-3 w-3 text-rose-500" />;
  if (trend === "down")
    return <TrendingDown className="h-3 w-3 text-teal-500" />;
  return <Activity className="h-3 w-3 text-slate-400" />;
}

export function HealthMetrics() {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
        Chỉ số sức khỏe
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card
              key={metric.label}
              className="border-white/70 bg-white/70 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "grid h-10 w-10 place-items-center rounded-2xl",
                      metric.iconBg,
                    )}
                  >
                    <Icon className={cn("h-5 w-5", metric.iconColor)} />
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", STATUS_STYLES[metric.status])}
                  >
                    {metric.statusLabel}
                  </Badge>
                </div>

                <div className="mt-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {metric.value}
                    </span>
                    {metric.unit && (
                      <span className="text-sm text-muted-foreground">
                        {metric.unit}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {metric.label}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendIcon trend={metric.trend} />
                    <span>{metric.trendLabel}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {metric.updatedAt}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
