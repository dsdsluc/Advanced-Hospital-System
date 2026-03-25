import Image from "next/image";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Chị Mai Phương",
    role: "Khám tổng quát",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&q=80",
    quote:
      "Quy trình đặt lịch nhanh, nhân viên hướng dẫn tận tình. Bác sĩ giải thích rõ ràng và dễ hiểu.",
  },
  {
    name: "Anh Minh Tuấn",
    role: "Tim mạch",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=128&q=80",
    quote:
      "Trang thiết bị hiện đại, chẩn đoán chính xác. Tôi cảm thấy yên tâm và được chăm sóc rất chu đáo.",
  },
  {
    name: "Chị Thu Hà",
    role: "Nhi khoa",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=128&q=80",
    quote:
      "Bé nhà mình rất hợp tác vì bác sĩ thân thiện. Không gian sạch sẽ, dịch vụ chuyên nghiệp.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            Cảm nhận từ bệnh nhân
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Trải nghiệm thực tế giúp chúng tôi cải thiện dịch vụ mỗi ngày.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border bg-card p-6 shadow-soft transition-shadow hover:shadow-soft"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border">
                    <Image
                      src={t.avatarUrl}
                      alt={t.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{t.name}</div>
                    <div className="truncate text-sm text-muted-foreground">
                      {t.role}
                    </div>
                  </div>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Quote className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                “{t.quote}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

