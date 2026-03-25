import { listAppointments } from "@/lib/api";
import { AppointmentsList } from "@/components/appointments/appointments-list";

export default async function AppointmentsPage() {
  const data = await listAppointments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Lịch hẹn</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lịch khám trong ngày và sắp tới, hiển thị theo bố cục rõ ràng và dễ theo dõi.
        </p>
      </div>
      <AppointmentsList data={data} />
    </div>
  );
}

