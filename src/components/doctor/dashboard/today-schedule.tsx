import { Clock, MapPin } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ScheduleStatus = "Đã hoàn tất" | "Đang khám" | "Chờ khám" | "Vắng mặt";

interface ScheduleItem {
  id: string;
  time: string;
  patientName: string;
  patientCode: string;
  reason: string;
  room: string;
  status: ScheduleStatus;
}

const TODAY_SCHEDULE: ScheduleItem[] = [
  {
    id: "1",
    time: "08:00",
    patientName: "Nguyễn Văn An",
    patientCode: "BN-1024",
    reason: "Khám định kỳ – Tăng huyết áp",
    room: "302",
    status: "Đã hoàn tất",
  },
  {
    id: "2",
    time: "08:30",
    patientName: "Phạm Thị Bình",
    patientCode: "BN-0891",
    reason: "Tái khám – Tiểu đường type 2",
    room: "302",
    status: "Đã hoàn tất",
  },
  {
    id: "3",
    time: "09:00",
    patientName: "Lê Văn Cường",
    patientCode: "BN-1156",
    reason: "Đánh giá tim mạch",
    room: "302",
    status: "Đang khám",
  },
  {
    id: "4",
    time: "09:30",
    patientName: "Hoàng Thị Dung",
    patientCode: "BN-1302",
    reason: "Khám lần đầu – Đau khớp",
    room: "302",
    status: "Chờ khám",
  },
  {
    id: "5",
    time: "10:00",
    patientName: "Đỗ Minh Khoa",
    patientCode: "BN-0774",
    reason: "Xem kết quả xét nghiệm – Hen suyễn",
    room: "302",
    status: "Chờ khám",
  },
  {
    id: "6",
    time: "13:30",
    patientName: "Vũ Thị Lan",
    patientCode: "BN-0633",
    reason: "Tư vấn phác đồ điều trị",
    room: "302",
    status: "Chờ khám",
  },
  {
    id: "7",
    time: "14:00",
    patientName: "Ngô Văn Hùng",
    patientCode: "BN-1088",
    reason: "Tái khám – Viêm loét dạ dày",
    room: "302",
    status: "Chờ khám",
  },
  {
    id: "8",
    time: "14:30",
    patientName: "Trịnh Thị Mai",
    patientCode: "BN-0942",
    reason: "Khám định kỳ – Đái tháo đường",
    room: "302",
    status: "Chờ khám",
  },
];

function statusStyle(status: ScheduleStatus) {
  if (status === "Đã hoàn tất") return "bg-secondary/10 text-secondary";
  if (status === "Đang khám") return "bg-primary/10 text-primary";
  if (status === "Vắng mặt") return "bg-destructive/10 text-destructive";
  return "bg-muted text-muted-foreground";
}

function statusDot(status: ScheduleStatus) {
  if (status === "Đã hoàn tất") return "bg-secondary";
  if (status === "Đang khám") return "bg-primary animate-pulse";
  if (status === "Vắng mặt") return "bg-destructive";
  return "bg-muted-foreground";
}

export function TodaySchedule() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Lịch khám hôm nay
          </CardTitle>
          <Badge variant="outline">
            3 / 8 hoàn tất
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="grid gap-2">
          {TODAY_SCHEDULE.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group flex items-start gap-3 rounded-2xl border p-3 transition-colors hover:bg-accent/50",
                item.status === "Đang khám" && "border-primary/30 bg-primary/5",
              )}
            >
              {/* Time */}
              <div className="flex w-12 shrink-0 flex-col items-center gap-1 pt-0.5">
                <span className="text-sm font-semibold tabular-nums">{item.time}</span>
                <span className={cn("h-1.5 w-1.5 rounded-full", statusDot(item.status))} />
              </div>

              {/* Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{item.patientName}</div>
                    <div className="text-xs text-muted-foreground">{item.patientCode}</div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                      statusStyle(item.status),
                    )}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground truncate">{item.reason}</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  Phòng {item.room}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/doctor/appointments">Xem toàn bộ lịch khám</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
