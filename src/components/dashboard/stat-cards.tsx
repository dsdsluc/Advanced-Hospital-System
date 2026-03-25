import { CalendarCheck, Stethoscope, TrendingUp, Users } from "lucide-react";
import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/api/types";
import { formatCurrencyVND, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

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

export function StatCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Bệnh nhân"
        value={formatNumber(stats.patients)}
        subtitle="Tổng số đang quản lý"
        icon={Users}
        accent="primary"
      />
      <StatCard
        title="Bác sĩ"
        value={formatNumber(stats.doctors)}
        subtitle="Đang hoạt động"
        icon={Stethoscope}
        accent="secondary"
      />
      <StatCard
        title="Lịch hẹn"
        value={formatNumber(stats.appointments)}
        subtitle="Trong hôm nay"
        icon={CalendarCheck}
      />
      <StatCard
        title="Doanh thu"
        value={formatCurrencyVND(stats.revenue)}
        subtitle={`Tăng ${stats.revenueChangePct}% so với tuần trước`}
        icon={TrendingUp}
      />
    </div>
  );
}
