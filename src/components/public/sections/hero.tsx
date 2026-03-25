import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=2400&q=80"
          alt="Môi trường bệnh viện hiện đại"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white ring-1 ring-white/15 backdrop-blur">
            <ShieldCheck className="h-4 w-4" />
            <span>Tiêu chuẩn an toàn & chất lượng quốc tế</span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Chăm sóc sức khỏe toàn diện cho bạn và gia đình
          </h1>

          <p className="mt-4 text-base leading-7 text-white/80 sm:text-lg">
            Hệ thống dịch vụ y tế hiện đại, bác sĩ giàu kinh nghiệm và quy trình đặt
            lịch nhanh chóng — tối ưu trải nghiệm từ lần khám đầu tiên.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/auth/login">
                <CalendarDays className="h-4 w-4" />
                Đặt lịch khám
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 bg-white/10 text-white hover:bg-white/15">
              <a href="#services">
                Xem dịch vụ <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/15 backdrop-blur">
              <div className="text-2xl font-semibold">24/7</div>
              <div className="mt-1 text-sm text-white/75">Hỗ trợ & tư vấn</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/15 backdrop-blur">
              <div className="text-2xl font-semibold">150+</div>
              <div className="mt-1 text-sm text-white/75">Bác sĩ & chuyên gia</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/15 backdrop-blur">
              <div className="text-2xl font-semibold">98%</div>
              <div className="mt-1 text-sm text-white/75">Hài lòng dịch vụ</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

