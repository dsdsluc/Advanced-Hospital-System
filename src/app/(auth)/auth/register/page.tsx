"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function fadeUp(i: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" as const },
  };
}

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { score: 1, label: "Yếu", color: "bg-red-500" },
    { score: 2, label: "Trung bình", color: "bg-orange-500" },
    { score: 3, label: "Khá", color: "bg-yellow-500" },
    { score: 4, label: "Mạnh", color: "bg-green-500" },
  ];
  return levels[score - 1] ?? { score: 0, label: "", color: "" };
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");

  const strength = getPasswordStrength(password);

  return (
    <div className="space-y-6">
      {/* Badge */}
      <motion.div {...fadeUp(0)}>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" />
          Đăng ký miễn phí
        </span>
      </motion.div>

      {/* Heading */}
      <motion.div {...fadeUp(1)}>
        <h1 className="text-[1.6rem] font-semibold tracking-tight">
          Tạo{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            tài khoản
          </span>
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Đăng ký để đặt lịch và theo dõi hồ sơ sức khỏe của bạn.
        </p>
      </motion.div>

      {/* Form */}
      <motion.form {...fadeUp(2)} className="space-y-4">
        {/* Full name */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium">
            Họ và tên
          </Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              placeholder="Nguyễn Văn A"
              className="pl-9"
              autoComplete="name"
            />
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid gap-3 sm:grid-cols-2">
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
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm font-medium">
              Số điện thoại
            </Label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="0901 234 567"
                className="pl-9"
                autoComplete="tel"
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium">
            Mật khẩu
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-9 pr-10"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {/* Strength meter */}
          {password && (
            <div className="space-y-1.5 pt-0.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i <= strength.score ? strength.color : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Độ mạnh:{" "}
                <span className="font-medium text-foreground">{strength.label}</span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirm" className="text-sm font-medium">
            Nhập lại mật khẩu
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              className="pl-9 pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Terms */}
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
          />
          <span className="text-sm leading-relaxed text-muted-foreground">
            Tôi đồng ý với{" "}
            <a href="#" className="text-primary transition-colors hover:underline">
              Điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a href="#" className="text-primary transition-colors hover:underline">
              Chính sách bảo mật
            </a>{" "}
            của QuanCare.
          </span>
        </label>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/20 transition-all hover:brightness-110 hover:shadow-blue-500/30"
        >
          Tạo tài khoản
        </Button>
      </motion.form>

      {/* Security badge */}
      <motion.div
        {...fadeUp(3)}
        className="flex items-center gap-2.5 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3"
      >
        <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" />
        <p className="text-xs text-muted-foreground">
          Thông tin được mã hóa · Không chia sẻ với bên thứ ba
        </p>
      </motion.div>

      {/* Login link */}
      <motion.p {...fadeUp(4)} className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-primary transition-colors hover:underline"
        >
          Đăng nhập
        </Link>
      </motion.p>
    </div>
  );
}
