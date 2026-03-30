"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const DEMO_ACCOUNTS = [
  {
    label: "Admin",
    email: "admin@hospital.com",
    password: "123456",
    color: "violet",
  },
  {
    label: "Bệnh nhân",
    email: "tran.thi.ngoc.anh@hospital.com",
    password: "patient001",
    color: "sky",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function fillDemo(acc: typeof DEMO_ACCOUNTS[number]) {
    setEmail(acc.email);
    setPassword(acc.password);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Đăng nhập thất bại");
        return;
      }

      if (data.role === "ADMIN") {
        localStorage.setItem("admin", JSON.stringify(data.admin));
        router.push("/admin/dashboard");
      } else {
        localStorage.setItem("patient", JSON.stringify(data.patient));
        router.push("/patient/dashboard");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  }

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

      {/* Demo accounts */}
      <motion.div {...fadeUp(2)} className="rounded-xl border border-dashed bg-muted/30 p-3 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Tài khoản demo
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.label}
              type="button"
              onClick={() => fillDemo(acc)}
              className={`flex flex-col items-start rounded-lg border px-3 py-2 text-left transition-colors hover:bg-background
                ${acc.color === "violet"
                  ? "border-violet-200 bg-violet-50/50 hover:border-violet-300"
                  : "border-sky-200 bg-sky-50/50 hover:border-sky-300"
                }`}
            >
              <span className={`text-[11px] font-semibold ${acc.color === "violet" ? "text-violet-600" : "text-sky-600"}`}>
                {acc.label}
              </span>
              <span className="mt-0.5 truncate text-[11px] text-muted-foreground w-full">{acc.email}</span>
              <span className="text-[11px] text-muted-foreground">🔑 {acc.password}</span>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground">Nhấn vào ô để điền tự động</p>
      </motion.div>

      {/* Form */}
      <motion.form {...fadeUp(3)} className="space-y-4" onSubmit={handleSubmit}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/20 transition-all hover:brightness-110 hover:shadow-blue-500/30"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </motion.form>

      {/* Divider */}
      <motion.div {...fadeUp(4)} className="relative">
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
      <motion.div {...fadeUp(5)}>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full border-dashed transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <Link href="/auth/register">Tạo tài khoản mới</Link>
        </Button>
      </motion.div>

      {/* Doctor login */}
      <motion.div {...fadeUp(6)}>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background/85 px-3 text-xs text-muted-foreground backdrop-blur-sm">
              Bác sĩ?
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div {...fadeUp(7)}>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full transition-colors hover:border-blue-500/40 hover:bg-blue-500/5"
        >
          <Link href="/auth/doctor-login">Đăng nhập bác sĩ</Link>
        </Button>
      </motion.div>

      {/* Security badge */}
      <motion.div
        {...fadeUp(8)}
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
