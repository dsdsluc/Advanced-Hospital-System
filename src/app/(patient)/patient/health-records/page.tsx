import { ClipboardList } from "lucide-react";

export default function PatientHealthRecordsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-teal-50 dark:bg-teal-950/40">
        <ClipboardList className="h-8 w-8 text-teal-500" />
      </div>
      <h1 className="mt-4 text-xl font-semibold">Hồ sơ sức khỏe</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Xem toàn bộ lịch sử khám bệnh, chẩn đoán và kết quả điều trị của bạn.
      </p>
    </div>
  );
}
