import { RecordsList } from "@/components/doctor/medical-records/records-list";

export default function HoSoBenhAnPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Hồ sơ bệnh án</h1>
        <p className="text-sm text-muted-foreground">
          Xem và cập nhật hồ sơ bệnh án của bệnh nhân
        </p>
      </div>
      <RecordsList />
    </div>
  );
}
