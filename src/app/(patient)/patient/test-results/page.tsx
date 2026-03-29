import { FileText } from "lucide-react";

export default function PatientTestResultsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-violet-50 dark:bg-violet-950/40">
        <FileText className="h-8 w-8 text-violet-500" />
      </div>
      <h1 className="mt-4 text-xl font-semibold">Kết quả xét nghiệm</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Xem và tải về các kết quả xét nghiệm, hình ảnh chẩn đoán và báo cáo y tế.
      </p>
    </div>
  );
}
