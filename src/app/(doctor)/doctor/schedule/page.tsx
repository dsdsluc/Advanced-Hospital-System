import { ScheduleView } from "@/components/doctor/schedule/schedule-view";

export default function LichLamViecPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Lịch làm việc</h1>
        <p className="text-sm text-muted-foreground">
          Xem ca trực và lịch công tác theo tuần, tháng
        </p>
      </div>
      <ScheduleView />
    </div>
  );
}
