import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AppointmentCtaSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border bg-card shadow-soft">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2400&q=80"
              alt="Khám và tư vấn"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/40" />
          </div>

          <div className="relative grid gap-8 p-8 lg:grid-cols-2 lg:p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm text-white ring-1 ring-white/20 backdrop-blur">
                <CalendarDays className="h-4 w-4" />
                <span>Đặt lịch linh hoạt</span>
              </div>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                Đặt lịch khám ngay hôm nay
              </h3>
              <p className="mt-3 text-sm text-white/85 sm:text-base">
                Chọn thời gian phù hợp, nhận xác nhận nhanh và được nhắc lịch tự động.
                Ưu tiên trải nghiệm thân thiện cho bệnh nhân và gia đình.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="secondary" className="gap-2">
                  <Link href="/auth/login">
                    Đặt lịch khám <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/15"
                >
                  <a href="#services">Xem dịch vụ</a>
                </Button>
              </div>
            </div>

            <div className="hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}

