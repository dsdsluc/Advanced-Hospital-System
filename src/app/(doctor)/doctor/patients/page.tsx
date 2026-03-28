import { PatientsTable } from "@/components/doctor/patients/patients-table";

export default function BenhNhanPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Bệnh nhân của tôi
        </h1>
        <p className="text-sm text-muted-foreground">
          Danh sách và thông tin chi tiết các bệnh nhân đang theo dõi
        </p>
      </div>
      <PatientsTable />
    </div>
  );
}
