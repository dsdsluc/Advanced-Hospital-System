"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { BRAND, NAV_ITEMS } from "@/components/layout/nav";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Sidebar({
  className,
  collapsed = false,
}: {
  className?: string;
  collapsed?: boolean;
}) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={120}>
      <aside
        data-collapsed={collapsed ? "true" : "false"}
        className={cn(
          "hidden lg:flex lg:flex-col lg:gap-6 lg:rounded-[2rem] lg:border lg:border-white/50 lg:bg-white/40 lg:shadow-2xl lg:backdrop-blur-xl lg:dark:border-white/10 lg:dark:bg-black/40",
          "transition-[width] duration-200 ease-in-out",
          collapsed ? "lg:w-[88px]" : "lg:w-[280px]",
          collapsed ? "lg:px-2 lg:py-4" : "lg:p-4",
          className,
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed ? "justify-center px-0 pt-2" : "px-2 pt-2",
          )}
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shadow-sm">
            <span className="text-sm font-semibold">QC</span>
          </div>
          {!collapsed ? (
            <>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">
                  {BRAND.name}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {BRAND.tagline}
                </div>
              </div>
              <div className="ml-auto">
                <Badge variant="secondary">Pro</Badge>
              </div>
            </>
          ) : null}
        </div>

        <nav className={cn(collapsed ? "px-0" : "px-1")}>
          {!collapsed ? (
            <div className="px-3 pb-2 pt-1 text-xs font-medium text-muted-foreground">
              Điều hướng
            </div>
          ) : null}
          <div className="grid gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(`${item.href}/`);
              const Icon = item.icon;
              const link = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center rounded-xl text-sm transition-colors duration-200 ease-in-out",
                    collapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3",
                    "hover:bg-white/50 dark:hover:bg-black/50",
                    isActive &&
                      "bg-white dark:bg-black font-medium text-foreground shadow-sm",
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-opacity",
                      isActive ? "opacity-100" : "opacity-0",
                      collapsed && "left-[2px]",
                    )}
                  />
                  <Icon
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-colors",
                      isActive && "text-foreground",
                    )}
                  />
                  {!collapsed ? (
                    <span className="truncate">{item.title}</span>
                  ) : null}
                </Link>
              );

              if (!collapsed) return link;

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </nav>

        {!collapsed ? (
          <div className="mt-auto px-2 pb-2">
            <div className="rounded-2xl border border-white/30 bg-white/50 dark:bg-black/50 dark:border-white/10 p-4 shadow-sm backdrop-blur-md">
              <div className="text-sm font-semibold">Mẹo nhanh</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Dùng tìm kiếm để truy cập nhanh bệnh nhân, bác sĩ và lịch hẹn.
              </div>
            </div>
          </div>
        ) : null}
      </aside>
    </TooltipProvider>
  );
}
