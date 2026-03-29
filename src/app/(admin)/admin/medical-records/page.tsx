import { ClipboardList } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

export default function MedicalRecordsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hồ sơ bệnh án</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lưu trữ, truy xuất và quản lý hồ sơ theo bệnh nhân và khoa phòng.
        </p>
      </div>
      <EmptyState
        title="Chưa có dữ liệu hiển thị"
        description="Kết nối API hoặc thêm mock data để hiển thị hồ sơ bệnh án theo yêu cầu nghiệp vụ."
        icon={<ClipboardList className="h-5 w-5 text-primary" />}
        actionLabel="Tạo hồ sơ mới"
      />
    </div>
  );
}

