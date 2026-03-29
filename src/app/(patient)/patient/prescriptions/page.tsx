import { Pill } from "lucide-react";

export default function PatientPrescriptionsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-50 dark:bg-emerald-950/40">
        <Pill className="h-8 w-8 text-emerald-500" />
      </div>
      <h1 className="mt-4 text-xl font-semibold">Đơn thuốc</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Xem và quản lý các đơn thuốc được kê bởi bác sĩ, theo dõi lịch uống thuốc hàng ngày.
      </p>
    </div>
  );
}
