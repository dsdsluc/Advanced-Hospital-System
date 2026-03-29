import { CalendarDays } from "lucide-react";

export default function PatientAppointmentsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-blue-50 dark:bg-blue-950/40">
        <CalendarDays className="h-8 w-8 text-blue-500" />
      </div>
      <h1 className="mt-4 text-xl font-semibold">Lịch hẹn của tôi</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Quản lý toàn bộ lịch khám, đặt lịch mới và theo dõi trạng thái hẹn của bạn.
      </p>
    </div>
  );
}
