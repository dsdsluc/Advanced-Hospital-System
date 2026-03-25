import Image from "next/image";
import { Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const doctors = [
  {
    name: "BS. Nguyễn Hoàng Nam",
    specialization: "Tim mạch",
    avatarUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80",
    rating: 4.9,
  },
  {
    name: "BS. Lê Thu Trang",
    specialization: "Nhi khoa",
    avatarUrl:
      "https://images.unsplash.com/photo-1580281658628-4b5d96f64f0f?auto=format&fit=crop&w=256&q=80",
    rating: 4.8,
  },
  {
    name: "BS. Võ Thành Đạt",
    specialization: "Ngoại tổng quát",
    avatarUrl:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=256&q=80",
    rating: 4.8,
  },
  {
    name: "BS. Đặng Mỹ Linh",
    specialization: "Sản - Phụ khoa",
    avatarUrl:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=256&q=80",
    rating: 4.9,
  },
];

export function DoctorsSection() {
  return (
    <section id="doctors" className="py-20 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">
              Đội ngũ bác sĩ
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Chuyên gia giàu kinh nghiệm, tận tâm, đồng hành cùng bạn trong từng
              quyết định chăm sóc sức khỏe.
            </p>
          </div>
          <Badge variant="secondary" className="w-fit">
            150+ bác sĩ
          </Badge>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((d) => {
            const initials = d.name
              .replace("BS.", "")
              .trim()
              .split(" ")
              .slice(-2)
              .map((s) => s[0])
              .join("")
              .toUpperCase();
            return (
              <Card key={d.name} className="overflow-hidden transition-shadow hover:shadow-soft">
                <div className="relative h-36">
                  <Image
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80"
                    alt="Môi trường y tế"
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/10" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs text-white backdrop-blur">
                    <Star className="h-3.5 w-3.5 text-yellow-300" />
                    <span className="font-medium">{d.rating.toFixed(1)}</span>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <Image
                        src={d.avatarUrl}
                        alt={d.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <CardTitle className="truncate text-base">{d.name}</CardTitle>
                      <div className="mt-0.5 text-sm text-muted-foreground">
                        {d.specialization}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="rounded-xl border bg-background p-3 text-sm text-muted-foreground">
                    Tư vấn chuyên sâu, giải thích rõ ràng, ưu tiên an toàn và hiệu quả.
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

