import { ChevronRight, Pill, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PrescriptionStatus = "active" | "completed" | "refill";

const STATUS_LABELS: Record<PrescriptionStatus, string> = {
  active: "Đang dùng",
  completed: "Đã xong",
  refill: "Cần tái cấp",
};

const STATUS_STYLES: Record<PrescriptionStatus, string> = {
  active:
    "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300",
  completed:
    "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400",
  refill:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
};

const PRESCRIPTIONS = [
  {
    id: 1,
    name: "Amoxicillin 500mg",
    dosage: "1 viên · 3 lần/ngày",
    daysLeft: 4,
    totalDays: 7,
    status: "active" as PrescriptionStatus,
    prescribedBy: "BS. Trần Thị Lan",
    pillBg: "bg-blue-100 dark:bg-blue-950/60",
    pillColor: "text-blue-600 dark:text-blue-400",
    barColor: "from-blue-500 to-teal-500",
  },
  {
    id: 2,
    name: "Paracetamol 650mg",
    dosage: "1 viên · Khi cần",
    daysLeft: 0,
    totalDays: 14,
    status: "completed" as PrescriptionStatus,
    prescribedBy: "BS. Trần Thị Lan",
    pillBg: "bg-slate-100 dark:bg-slate-800/60",
    pillColor: "text-slate-500 dark:text-slate-400",
    barColor: "from-slate-400 to-slate-500",
  },
  {
    id: 3,
    name: "Metformin 500mg",
    dosage: "2 viên · 2 lần/ngày",
    daysLeft: 3,
    totalDays: 30,
    status: "refill" as PrescriptionStatus,
    prescribedBy: "BS. Nguyễn Minh Khoa",
    pillBg: "bg-violet-100 dark:bg-violet-950/60",
    pillColor: "text-violet-600 dark:text-violet-400",
    barColor: "from-violet-400 to-purple-500",
  },
];

export function RecentPrescriptions() {
  return (
    <Card className="border-white/70 bg-white/70 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Pill className="h-4 w-4 text-teal-500" />
          <CardTitle className="text-base">Đơn thuốc hiện tại</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <Link href="/patient/prescriptions">
            Xem tất cả
            <ChevronRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="grid gap-3">
        {PRESCRIPTIONS.map((rx) => {
          const progress =
            rx.totalDays > 0 ? (rx.daysLeft / rx.totalDays) * 100 : 0;

          return (
            <div
              key={rx.id}
              className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/40 p-4 transition-colors hover:bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:bg-slate-800/50"
            >
              {/* Pill icon */}
              <div
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                  rx.pillBg,
                )}
              >
                <Pill className={cn("h-4 w-4", rx.pillColor)} />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {rx.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {rx.dosage}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {rx.status === "refill" && (
                      <RefreshCw className="h-3 w-3 shrink-0 text-amber-500" />
                    )}
                    <Badge
                      variant="outline"
                      className={cn("shrink-0 text-xs", STATUS_STYLES[rx.status])}
                    >
                      {STATUS_LABELS[rx.status]}
                    </Badge>
                  </div>
                </div>

                {/* Progress bar for active */}
                {rx.status === "active" && (
                  <div className="mt-2.5">
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>Còn lại</span>
                      <span>
                        {rx.daysLeft}/{rx.totalDays} ngày
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r transition-all",
                          rx.barColor,
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-1.5 text-xs text-muted-foreground">
                  Kê bởi {rx.prescribedBy}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
