"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Stethoscope, Loader } from "lucide-react";
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

export default function DoctorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/doctor-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Store doctor data in localStorage
      localStorage.setItem(
        "doctor",
        JSON.stringify({
          id: data.doctor.id,
          userId: data.doctor.userId,
          name: data.doctor.name,
          email: data.doctor.email,
          specialization: data.doctor.specialization,
          department: data.doctor.department,
        }),
      );

      // Redirect to doctor dashboard
      router.push("/doctor/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Badge */}
      <motion.div {...fadeUp(0)}>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/5 px-3 py-1 text-xs font-medium text-blue-600">
          <Stethoscope className="h-3 w-3" />
          Đăng nhập bác sĩ
        </span>
      </motion.div>

      {/* Heading */}
      <motion.div {...fadeUp(1)}>
        <h1 className="text-[1.6rem] font-semibold tracking-tight">
          Chào mừng{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            bác sĩ
          </span>
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Đăng nhập để quản lý lịch khám và bệnh nhân của bạn.
        </p>
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.div {...fadeUp(2)}>
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-destructive shrink-0" />
            {error}
          </div>
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        {...fadeUp(error ? 3 : 2)}
        onSubmit={handleLogin}
        className="space-y-4"
      >
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
              placeholder="doctor@hospital.com"
              className="pl-9"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/20 transition-all hover:brightness-110 hover:shadow-blue-500/30"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Đang đăng nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </motion.form>

      {/* Demo info */}
      <motion.div
        {...fadeUp(error ? 4 : 3)}
        className="rounded-lg border border-blue-200/50 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-950/20 p-3"
      >
        <p className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-2">
          Tài khoản demo:
        </p>
        <div className="space-y-1 text-xs text-blue-800 dark:text-blue-400">
          <div>
            Email:{" "}
            <code className="bg-black/10 px-1.5 rounded">
              nguyen.hoang.nam@hospital.com
            </code>
          </div>
          <div>
            Password:{" "}
            <code className="bg-black/10 px-1.5 rounded">doctor001</code>
          </div>
        </div>
      </motion.div>

      {/* Back link */}
      <motion.div {...fadeUp(error ? 5 : 4)}>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <Link href="/auth/login">Quay lại đăng nhập bệnh nhân</Link>
        </Button>
      </motion.div>
    </div>
  );
}
