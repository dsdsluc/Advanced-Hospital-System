"use client";

import {
  HeartPulse,
  Microscope,
  Stethoscope,
  Syringe,
  Brain,
  Baby,
} from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: HeartPulse,
    title: "Khám tổng quát",
    description: "Đánh giá sức khỏe toàn diện với quy trình nhanh gọn và rõ ràng.",
    color: "bg-red-500/10 text-red-500",
  },
  {
    icon: Microscope,
    title: "Xét nghiệm & chẩn đoán",
    description: "Hệ thống xét nghiệm hiện đại, trả kết quả chính xác và kịp thời.",
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: Stethoscope,
    title: "Nội khoa",
    description: "Theo dõi và điều trị bệnh lý mạn tính với phác đồ cá nhân hóa.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Syringe,
    title: "Tiêm chủng",
    description: "Gói tiêm chủng an toàn cho trẻ em và người lớn, nhắc lịch tự động.",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: Brain,
    title: "Thần kinh",
    description: "Tư vấn chuyên sâu và tầm soát sớm để bảo vệ sức khỏe lâu dài.",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    icon: Baby,
    title: "Nhi khoa",
    description: "Chăm sóc dịu nhẹ, thân thiện, ưu tiên trải nghiệm của bé và gia đình.",
    color: "bg-pink-500/10 text-pink-500",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <h2 className="text-3xl font-semibold tracking-tight">Dịch vụ nổi bật</h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Tối ưu quy trình khám chữa bệnh với hệ thống dịch vụ đa khoa, trải nghiệm
            hiện đại và minh bạch.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className="h-full transition-shadow duration-200 hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base">{s.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                    <a
                      href="#contact"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      Tìm hiểu thêm →
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
