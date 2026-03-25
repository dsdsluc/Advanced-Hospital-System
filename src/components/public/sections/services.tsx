import {
  HeartPulse,
  Microscope,
  Stethoscope,
  Syringe,
  Brain,
  Baby,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: HeartPulse,
    title: "Khám tổng quát",
    description: "Đánh giá sức khỏe toàn diện với quy trình nhanh gọn và rõ ràng.",
  },
  {
    icon: Microscope,
    title: "Xét nghiệm & chẩn đoán",
    description: "Hệ thống xét nghiệm hiện đại, trả kết quả chính xác và kịp thời.",
  },
  {
    icon: Stethoscope,
    title: "Nội khoa",
    description: "Theo dõi và điều trị bệnh lý mạn tính với phác đồ cá nhân hóa.",
  },
  {
    icon: Syringe,
    title: "Tiêm chủng",
    description: "Gói tiêm chủng an toàn cho trẻ em và người lớn, nhắc lịch tự động.",
  },
  {
    icon: Brain,
    title: "Thần kinh",
    description: "Tư vấn chuyên sâu và tầm soát sớm để bảo vệ sức khỏe lâu dài.",
  },
  {
    icon: Baby,
    title: "Nhi khoa",
    description: "Chăm sóc dịu nhẹ, thân thiện, ưu tiên trải nghiệm của bé và gia đình.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            Dịch vụ nổi bật
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Tối ưu quy trình khám chữa bệnh với hệ thống dịch vụ đa khoa, trải nghiệm
            hiện đại và minh bạch.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.title} className="transition-shadow hover:shadow-soft">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{s.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

