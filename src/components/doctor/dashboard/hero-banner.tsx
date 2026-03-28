import Image from "next/image";
import { CalendarPlus, ClipboardList } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DOCTOR_USER } from "@/components/doctor/nav";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export function DoctorHeroBanner() {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1600&q=80"
          alt="Phòng khám"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/30" />
      </div>
      <div className="relative p-6 lg:p-10">
        <div className="max-w-2xl">
          <div className="text-xs font-medium text-muted-foreground capitalize">{today}</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight lg:text-3xl">
            {getGreeting()}, {DOCTOR_USER.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground lg:text-base">
            {DOCTOR_USER.role} · {DOCTOR_USER.department} · Phòng 302
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Bạn có <span className="font-semibold text-foreground">8 lịch khám</span> hôm nay và{" "}
            <span className="font-semibold text-foreground">2 hồ sơ</span> cần cập nhật.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="gap-2">
              <Link href="/doctor/appointments">
                <CalendarPlus className="h-4 w-4" />
                Xem lịch khám hôm nay
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/doctor/medical-records">
                <ClipboardList className="h-4 w-4" />
                Hồ sơ cần cập nhật
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
