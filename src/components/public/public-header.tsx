"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Trang chủ", href: "#home" },
  { label: "Dịch vụ", href: "#services" },
  { label: "Bác sĩ", href: "#doctors" },
  { label: "Liên hệ", href: "#contact" },
];

export function PublicHeader({ className }: { className?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          {navItems.map((item) => (
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
            className="hidden rounded-full px-5 shadow-sm transition-all hover:shadow-md md:inline-flex"
          >
            <Link href="/auth/login">Đặt lịch khám</Link>
          </Button>

          {/* MOBILE MENU TOGGLE */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden rounded-full"
            aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden border-t bg-background/95 backdrop-blur-xl md:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-2 border-t pt-3">
                <div className="mb-2 flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>1900 1234</span>
                </div>
                <Button asChild className="w-full rounded-full">
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                    Đặt lịch khám
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
