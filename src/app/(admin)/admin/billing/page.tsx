import { CreditCard, Receipt } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatCurrencyVND } from "@/lib/format";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Thanh toán</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Theo dõi hóa đơn, giao dịch và báo cáo doanh thu.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Doanh thu tháng này
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">
              {formatCurrencyVND(1_284_000_000)}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Tổng hợp từ các hóa đơn đã thanh toán
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hóa đơn chờ xử lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">18</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Cần xác nhận hoặc đối soát
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tỷ lệ thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">96%</div>
            <div className="mt-1 text-sm text-muted-foreground">
              So với tổng số hóa đơn phát hành
            </div>
          </CardContent>
        </Card>
      </div>

      <EmptyState
        title="Danh sách hóa đơn sẽ hiển thị ở đây"
        description="Thêm API endpoint hoặc mock data cho hóa đơn để hiển thị bảng giao dịch, bộ lọc và trạng thái thanh toán."
        icon={<Receipt className="h-5 w-5 text-primary" />}
        actionLabel="Tạo hóa đơn"
      />

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <CreditCard className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">Phương thức thanh toán</div>
            <div className="text-sm text-muted-foreground">
              Ví, thẻ, chuyển khoản, và bảo hiểm y tế (tùy cấu hình).
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

