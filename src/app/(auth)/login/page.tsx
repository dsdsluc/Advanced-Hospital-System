import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Đăng nhập</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          Chào mừng quay lại. Vui lòng đăng nhập để tiếp tục.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mật khẩu</Label>
              <a href="#" className="text-sm text-primary hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Đăng nhập</Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Tạo tài khoản
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

