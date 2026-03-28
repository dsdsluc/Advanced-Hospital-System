"use client";

import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Chị Mai Phương",
    role: "Khám tổng quát",
    date: "Tháng 3, 2025",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&q=80",
    rating: 5,
    quote:
      "Quy trình đặt lịch nhanh, nhân viên hướng dẫn tận tình. Bác sĩ giải thích rõ ràng và dễ hiểu.",
  },
  {
    name: "Anh Minh Tuấn",
    role: "Tim mạch",
    date: "Tháng 2, 2025",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=128&q=80",
    rating: 5,
    quote:
      "Trang thiết bị hiện đại, chẩn đoán chính xác. Tôi cảm thấy yên tâm và được chăm sóc rất chu đáo.",
  },
  {
    name: "Chị Thu Hà",
    role: "Nhi khoa",
    date: "Tháng 3, 2025",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=128&q=80",
    rating: 5,
    quote:
      "Bé nhà mình rất hợp tác vì bác sĩ thân thiện. Không gian sạch sẽ, dịch vụ chuyên nghiệp.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Cảm nhận từ bệnh nhân
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Trải nghiệm thực tế giúp chúng tôi cải thiện dịch vụ mỗi ngày.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border bg-card p-6 shadow-soft transition-shadow duration-200 hover:shadow-md"
            >
              {/* Star ratings */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, j) => (
                  <Star
                    key={j}
                    className={`h-4 w-4 ${j < t.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                  />
                ))}
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 overflow-hidden rounded-full border">
                    <Image
                      src={t.avatarUrl}
                      alt={t.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{t.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {t.role} · {t.date}
                    </div>
                  </div>
                </div>
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Quote className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
