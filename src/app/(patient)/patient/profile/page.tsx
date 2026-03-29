import { User } from "lucide-react";

export default function PatientProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-blue-50 dark:bg-blue-950/40">
        <User className="h-8 w-8 text-blue-500" />
      </div>
      <h1 className="mt-4 text-xl font-semibold">Hồ sơ cá nhân</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Cập nhật thông tin cá nhân, liên hệ khẩn cấp và thông tin bảo hiểm của bạn.
      </p>
    </div>
  );
}
