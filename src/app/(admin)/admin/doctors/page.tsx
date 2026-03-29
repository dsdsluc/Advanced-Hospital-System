import { listDoctors } from "@/lib/api";
import { DoctorsGrid } from "@/components/admin/doctors/doctors-grid";

export default async function DoctorsPage() {
  const data = await listDoctors();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bác sĩ</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Danh sách bác sĩ theo chuyên khoa, đánh giá và trạng thái hoạt động.
        </p>
      </div>
      <DoctorsGrid data={data} />
    </div>
  );
}
