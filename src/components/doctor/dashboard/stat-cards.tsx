import { CalendarCheck, ClipboardList, Clock, Users } from "lucide-react";
import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STATS = [
  {
    title: "Lịch khám hôm nay",
    value: "8",
    subtitle: "3 đã hoàn tất, 5 còn lại",
    icon: CalendarCheck,
    accent: "primary" as const,
  },
  {
    title: "Bệnh nhân của tôi",
    value: "47",
    subtitle: "Đang theo dõi điều trị",
    icon: Users,
    accent: "secondary" as const,
  },
  {
    title: "Hồ sơ cần cập nhật",
    value: "2",
    subtitle: "Từ cuộc khám hôm qua",
    icon: ClipboardList,
    accent: undefined,
  },
  {
    title: "Lịch hẹn tuần này",
    value: "34",
    subtitle: "Tăng 12% so với tuần trước",
    icon: Clock,
    accent: undefined,
  },
];

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

export function DoctorStatCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {STATS.map((s) => (
        <StatCard key={s.title} {...s} />
      ))}
    </div>
  );
}
