import { listDepartments } from "@/lib/api";
import { DepartmentsGrid } from "@/components/departments/departments-grid";

export default async function DepartmentsPage() {
  const data = await listDepartments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Khoa phòng</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Theo dõi công suất và thông tin vận hành theo từng khoa.
        </p>
      </div>
      <DepartmentsGrid data={data} />
    </div>
  );
}

