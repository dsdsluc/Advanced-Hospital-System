"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function fadeUp(i: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  };
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Badge */}
      <motion.div {...fadeUp(0)}>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" />
          Đăng nhập an toàn
        </span>
      </motion.div>

      {/* Heading */}
      <motion.div {...fadeUp(1)}>
        <h1 className="text-[1.6rem] font-semibold tracking-tight">
          Chào mừng{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            quay lại
          </span>
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Đăng nhập để đặt lịch và quản lý hồ sơ sức khỏe của bạn.
        </p>
      </motion.div>

      {/* Form */}
      <motion.form {...fadeUp(2)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="pl-9"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Mật khẩu
            </Label>
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Quên mật khẩu?
            </a>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-9 pr-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input accent-primary"
          />
          <span className="text-sm text-muted-foreground">Ghi nhớ đăng nhập</span>
        </label>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/20 transition-all hover:brightness-110 hover:shadow-blue-500/30"
        >
          Đăng nhập
        </Button>
      </motion.form>

      {/* Divider */}
      <motion.div {...fadeUp(3)} className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dashed" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background/85 px-3 text-xs text-muted-foreground backdrop-blur-sm">
            Chưa có tài khoản?
          </span>
        </div>
      </motion.div>

      {/* Register CTA */}
      <motion.div {...fadeUp(4)}>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full border-dashed transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <Link href="/auth/register">Tạo tài khoản mới</Link>
        </Button>
      </motion.div>

      {/* Security badge */}
      <motion.div
        {...fadeUp(5)}
        className="flex items-center gap-2.5 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3"
      >
        <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" />
        <p className="text-xs text-muted-foreground">
          Kết nối được mã hóa SSL · Bảo mật theo tiêu chuẩn quốc tế
        </p>
      </motion.div>
    </div>
  );
}
