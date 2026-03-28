import { PrescriptionPanel } from "@/components/doctor/prescriptions/prescription-panel";

export default function KeDonThuocPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Kê đơn thuốc</h1>
        <p className="text-sm text-muted-foreground">
          Tạo, xem và quản lý đơn thuốc cho bệnh nhân
        </p>
      </div>
      <PrescriptionPanel />
    </div>
  );
}
