import { listPatients } from "@/lib/api";
import { PatientsTable } from "@/components/admin/patients/patients-table";

export default async function PatientsPage() {
  const data = await listPatients();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bệnh nhân</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý hồ sơ bệnh nhân với giao diện trực quan và thao tác nhanh.
        </p>
      </div>
      <PatientsTable data={data} />
    </div>
  );
}
