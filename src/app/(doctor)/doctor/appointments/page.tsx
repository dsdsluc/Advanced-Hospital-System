import { AppointmentsView } from "@/components/doctor/appointments/appointments-view";

export default function LichKhamPage() {
  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Lịch khám</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý và theo dõi toàn bộ lịch hẹn khám bệnh
        </p>
      </div>
      <AppointmentsView />
    </div>
  );
}
