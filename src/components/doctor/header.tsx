"use client";

import {
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Bell,
  LogOut,
  User,
  Settings,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDoctor } from "@/lib/doctor-context";

function DoctorUserMenu() {
  const { doctor, logout } = useDoctor();

  if (!doctor) {
    return null;
  }

  const initials = doctor.name
    .split(" ")
    .slice(-2)
    .map((s: string) => s[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 gap-2 px-2 lg:px-3">
          <Avatar className="h-7 w-7">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left leading-tight lg:block">
            <div className="text-sm font-medium">{doctor.name}</div>
            <div className="text-xs text-muted-foreground">
              {doctor.specialization}
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <div className="font-medium">{doctor.name}</div>
          <div className="text-xs font-normal text-muted-foreground mt-0.5">
            {doctor.department ? `${doctor.department.name} • ` : ""}{doctor.specialization}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Hồ sơ cá nhân
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Cài đặt
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DoctorHeader({
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
        "z-40 flex h-16 items-center gap-4 rounded-full border border-white/50 bg-white/40 px-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/40 lg:px-6",
        className,
      )}
    >
      {/* Sidebar toggle */}
      <div className="hidden lg:flex">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-white/30 bg-white/50 dark:bg-black/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/80"
          onClick={onToggleSidebar}
          aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
        >
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </Button>
      </div>

      {/* Search */}
      <div className="relative hidden min-w-0 flex-1 md:block max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm bệnh nhân, lịch khám, đơn thuốc..."
          className="h-10 rounded-full border-white/30 bg-white/60 dark:bg-black/60 dark:border-white/10 pl-11 shadow-sm backdrop-blur-sm focus-visible:bg-white dark:focus-visible:bg-black"
        />
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        <ModeToggle />
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full border-white/30 bg-white/50 dark:bg-black/50 dark:border-white/10"
          aria-label="Thông báo"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>
        <DoctorUserMenu />
      </div>
    </header>
  );
}
