"use client";

import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const notifications = [
  {
    title: "Lịch hẹn mới",
    description: "Bạn có 3 lịch hẹn vừa được tạo.",
    time: "5 phút trước",
    unread: true,
  },
  {
    title: "Cập nhật hồ sơ",
    description: "Hồ sơ bệnh án #MR-204 đã được bổ sung kết quả.",
    time: "1 giờ trước",
    unread: true,
  },
  {
    title: "Thanh toán thành công",
    description: "Hóa đơn #INV-119 đã được thanh toán.",
    time: "Hôm qua",
    unread: false,
  },
];

export function NotificationsMenu() {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Thông báo" className="relative">
          <Bell />
          {unreadCount > 0 ? (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-2">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Thông báo</span>
          <span className="text-xs text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} chưa đọc` : "Đã xem tất cả"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[22rem] overflow-auto p-1">
          {notifications.map((n, idx) => (
            <DropdownMenuItem key={idx} className="items-start gap-3 rounded-xl p-3">
              <span
                className={cn(
                  "mt-1 h-2 w-2 rounded-full",
                  n.unread ? "bg-primary" : "bg-border",
                )}
              />
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate text-sm font-medium">{n.title}</div>
                  <div className="shrink-0 text-xs text-muted-foreground">{n.time}</div>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {n.description}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center rounded-lg py-2 text-sm text-primary">
          Xem tất cả
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
