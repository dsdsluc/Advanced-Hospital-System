import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Tạo tài khoản</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          Đăng ký nhanh để đặt lịch và quản lý thông tin khám.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input id="name" placeholder="Nguyễn Văn A" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Nhập lại mật khẩu</Label>
            <Input id="confirm" type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Tạo tài khoản</Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Đăng nhập
          </Link>
        </div>

        <div className="text-center text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            Quay về trang chủ
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

