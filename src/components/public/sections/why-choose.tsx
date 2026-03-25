import { Award, Clock, HeartHandshake, Sparkles } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Đội ngũ bác sĩ giàu kinh nghiệm",
    description: "Chuyên môn vững, tư vấn rõ ràng, ưu tiên an toàn và hiệu quả.",
  },
  {
    icon: Sparkles,
    title: "Trang thiết bị hiện đại",
    description: "Chẩn đoán chính xác, quy trình chuẩn hóa, cập nhật liên tục.",
  },
  {
    icon: HeartHandshake,
    title: "Dịch vụ tận tâm, thân thiện",
    description: "Tôn trọng bệnh nhân, chăm sóc chu đáo, hỗ trợ xuyên suốt.",
  },
  {
    icon: Clock,
    title: "Đặt lịch nhanh, giảm thời gian chờ",
    description: "Quy trình số hóa, nhắc lịch tự động, theo dõi thuận tiện.",
  },
];

export function WhyChooseSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            Vì sao chọn QuanCare?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Tập trung vào trải nghiệm bệnh nhân: nhanh, rõ ràng, và đáng tin cậy — từ
            đặt lịch đến điều trị.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl border bg-card p-6 shadow-soft transition-shadow hover:shadow-soft"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary/10 text-secondary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-sm font-semibold">{f.title}</div>
                <div className="mt-2 text-sm text-muted-foreground">{f.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

