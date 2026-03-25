"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { BRAND, NAV_ITEMS } from "@/components/layout/nav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu />
          <span className="sr-only">Mở menu</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-base">{BRAND.name}</DialogTitle>
          <div className="text-sm text-muted-foreground">{BRAND.tagline}</div>
        </DialogHeader>
        <nav className="px-2 pb-6">
          <div className="grid gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-accent",
                    isActive && "bg-accent",
                  )}
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </DialogContent>
    </Dialog>
  );
}
