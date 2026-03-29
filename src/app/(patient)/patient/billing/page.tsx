import { CreditCard } from "lucide-react";

export default function PatientBillingPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-sky-50 dark:bg-sky-950/40">
        <CreditCard className="h-8 w-8 text-sky-500" />
      </div>
      <h1 className="mt-4 text-xl font-semibold">Thanh toán</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Xem hoá đơn, lịch sử thanh toán và quản lý thông tin bảo hiểm y tế của bạn.
      </p>
    </div>
  );
}
