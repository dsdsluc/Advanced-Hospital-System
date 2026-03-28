import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background hospital image — very subtle watermark */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.06]"
        />
      </div>

      {/* Vercel-style gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[640px] w-[640px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute -bottom-48 -right-48 h-[540px] w-[540px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[80px]" />
      </div>

      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Page structure */}
      <div className="relative flex min-h-screen flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25">
              <span className="text-xs font-bold">QC</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">QuanCare</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Trang chủ
          </Link>
        </div>

        {/* Centered form */}
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            {/* Gradient-border card */}
            <div className="relative">
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-primary/30 via-border/60 to-border/20" />
              <div className="relative rounded-2xl bg-background/85 px-8 py-8 shadow-2xl shadow-black/8 backdrop-blur-2xl">
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-center gap-4 px-6 py-5 text-xs text-muted-foreground/60">
          <span>© {new Date().getFullYear()} QuanCare</span>
          <span>·</span>
          <a href="#" className="transition-colors hover:text-muted-foreground">Điều khoản</a>
          <span>·</span>
          <a href="#" className="transition-colors hover:text-muted-foreground">Bảo mật</a>
        </div>
      </div>
    </div>
  );
}
