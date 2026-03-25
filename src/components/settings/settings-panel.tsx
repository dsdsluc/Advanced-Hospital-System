"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export function SettingsPanel() {
  const [compact, setCompact] = React.useState(false);
  const [email, setEmail] = React.useState(true);
  const [sms, setSms] = React.useState(false);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Giao diện</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-3">
          <div className="flex items-center justify-between gap-4 rounded-2xl border p-4">
            <div>
              <div className="text-sm font-medium">Chế độ hiển thị gọn</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Giảm khoảng cách để xem nhiều thông tin hơn.
              </div>
            </div>
            <Switch checked={compact} onCheckedChange={setCompact} />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl border p-4">
            <div>
              <div className="text-sm font-medium">Hiệu ứng chuyển động</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Bật tắt micro-interactions trên toàn hệ thống.
              </div>
            </div>
            <Badge variant="outline">Mặc định</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Thông báo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-3">
          <div className="flex items-center justify-between gap-4 rounded-2xl border p-4">
            <div>
              <div className="text-sm font-medium">Email</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Nhận thông báo giao dịch và lịch hẹn qua email.
              </div>
            </div>
            <Switch checked={email} onCheckedChange={setEmail} />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl border p-4">
            <div>
              <div className="text-sm font-medium">SMS</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Nhận thông báo quan trọng qua tin nhắn.
              </div>
            </div>
            <Switch checked={sms} onCheckedChange={setSms} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

