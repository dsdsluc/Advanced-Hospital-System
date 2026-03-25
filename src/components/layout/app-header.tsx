"use client";

import { PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";

export function AppHeader({
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
      <MobileNav />

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

      <div className="relative hidden min-w-0 flex-1 md:block max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm bệnh nhân, bác sĩ, lịch hẹn..."
          className="h-10 rounded-full border-white/30 bg-white/60 dark:bg-black/60 dark:border-white/10 pl-11 shadow-sm backdrop-blur-sm focus-visible:bg-white dark:focus-visible:bg-black"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ModeToggle />
        <NotificationsMenu />
        <UserMenu />
      </div>
    </header>
  );
}
