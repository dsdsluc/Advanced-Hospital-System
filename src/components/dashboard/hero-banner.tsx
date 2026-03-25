import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function HeroBanner() {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1600&q=80"
          alt="Môi trường bệnh viện"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>
      <div className="relative p-6 lg:p-10">
        <div className="max-w-2xl">
          <div className="text-xs font-medium text-muted-foreground">
            Trải nghiệm quản trị chuẩn SaaS
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight lg:text-3xl">
            Bảng điều khiển bệnh viện — rõ ràng, nhanh, và đáng tin cậy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground lg:text-base">
            Theo dõi bệnh nhân, bác sĩ, lịch hẹn và doanh thu theo thời gian thực với
            giao diện tối giản, nhiều khoảng trắng và tương tác mượt mà.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button className="gap-2">
              Tạo lịch hẹn mới <ArrowRight />
            </Button>
            <Button variant="outline">Xem báo cáo hôm nay</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

