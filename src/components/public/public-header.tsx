"use client";

import Link from "next/link";
import { Menu, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50",
        className,
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
            <span className="text-sm font-bold">QC</span>
          </div>

          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold tracking-tight">QuanCare</p>
            <p className="text-xs text-muted-foreground">Bệnh viện đa khoa</p>
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav className="ml-10 hidden items-center gap-8 md:flex">
          {[
            { label: "Trang chủ", href: "#home" },
            { label: "Dịch vụ", href: "#services" },
            { label: "Bác sĩ", href: "#doctors" },
            { label: "Liên hệ", href: "#contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className="ml-auto flex items-center gap-3">
          {/* PHONE */}
          <div className="hidden items-center gap-2 rounded-full border bg-muted/40 px-4 py-2 text-sm lg:flex">
            <Phone className="h-4 w-4 text-primary" />
            <span className="font-medium">1900 1234</span>
          </div>

          {/* CTA */}
          <Button
            asChild
            className="rounded-full px-5 shadow-sm transition-all hover:shadow-md"
          >
            <Link href="/auth/login">Đặt lịch khám</Link>
          </Button>

          {/* MOBILE MENU */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden rounded-full"
            aria-label="Mở menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
