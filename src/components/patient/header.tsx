"use client";

import {
  Bell,
  CalendarPlus,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePatient } from "@/lib/patient-context";

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  const last2 = words.slice(-2);
  return last2
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

function PatientUserMenu() {
  const { patient, logout } = usePatient();

  const displayName = patient?.name ?? "Bệnh nhân";
  const displayCode = patient?.code ?? "---";
  const initials = patient?.name ? getInitials(patient.name) : "BN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-10 gap-2 rounded-full border-white/50 bg-white/60 px-2 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 lg:px-3"
        >
          <Avatar className="h-7 w-7">
            {patient?.avatarUrl ? (
              <AvatarImage src={patient.avatarUrl} alt={displayName} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-xs font-bold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left leading-tight lg:block">
            <div className="text-sm font-medium">{displayName}</div>
            <div className="text-xs text-muted-foreground">{displayCode}</div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="font-medium">{displayName}</div>
          <div className="mt-0.5 text-xs font-normal text-muted-foreground">
            {displayCode}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/patient/profile">
            <User className="mr-2 h-4 w-4" />
            Hồ sơ cá nhân
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/patient/appointments">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Đặt lịch hẹn
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PatientHeader({
  className,
  collapsed,
  onToggleSidebar,
}: {
  className?: string;
  collapsed?: boolean;
  onToggleSidebar?: () => void;
}) {
  return (
    <header
      className={cn(
        "z-40 flex h-16 items-center gap-4 rounded-full border border-white/60 bg-white/60 px-4 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60 lg:px-6",
        className,
      )}
    >
      {/* Sidebar toggle */}
      <div className="hidden lg:flex">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-white/40 bg-white/60 hover:bg-white/90 dark:border-white/10 dark:bg-slate-800/60 dark:hover:bg-slate-800"
          onClick={onToggleSidebar}
          aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
        >
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </Button>
      </div>

      {/* Search */}
      <div className="relative hidden min-w-0 flex-1 md:block max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm lịch hẹn, đơn thuốc, kết quả xét nghiệm..."
          className="h-10 rounded-full border-white/40 bg-white/60 pl-11 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-800/60 focus-visible:bg-white dark:focus-visible:bg-slate-900"
        />
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        <ModeToggle />
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full border-white/40 bg-white/60 hover:bg-white/90 dark:border-white/10 dark:bg-slate-800/60"
          aria-label="Thông báo"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900" />
        </Button>
        <PatientUserMenu />
      </div>
    </header>
  );
}
