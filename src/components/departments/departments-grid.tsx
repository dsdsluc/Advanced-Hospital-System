import type { Department } from "@/lib/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DepartmentsGrid({ data }: { data: Department[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((d) => {
        const pct = Math.min(100, Math.round((d.occupied / d.capacity) * 100));
        const tone =
          pct >= 90 ? "destructive" : pct >= 70 ? "secondary" : "default";
        return (
          <Card key={d.id} className="transition-shadow hover:shadow-soft">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base">{d.name}</CardTitle>
                <Badge variant={tone}>
                  {d.occupied}/{d.capacity}
                </Badge>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Trưởng khoa: {d.head}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground">
                Công suất sử dụng
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{pct}%</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

