import Link from "next/link";
import { Mail, MapPin, Phone, MessageCircle, Heart } from "lucide-react";

const sitemapLinks = [
  { label: "Trang chủ", href: "#home" },
  { label: "Dịch vụ", href: "#services" },
  { label: "Đội ngũ bác sĩ", href: "#doctors" },
  { label: "Đặt lịch khám", href: "/auth/login" },
  { label: "Liên hệ", href: "#contact" },
];

export function PublicFooter() {
  return (
    <footer id="contact" className="border-t bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* BRAND */}
        <div className="lg:col-span-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
              QC
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">QuanCare</div>
              <div className="text-xs text-muted-foreground">Bệnh viện đa khoa</div>
            </div>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Chúng tôi đồng hành cùng bạn với dịch vụ y tế hiện đại, đội ngũ bác sĩ tận tâm
            và trải nghiệm chăm sóc sức khỏe thân thiện.
          </p>
          <div className="mt-6 flex items-center gap-3 text-muted-foreground">
            <a
              href="#"
              className="grid h-10 w-10 place-items-center rounded-full border bg-background transition-colors hover:bg-accent"
              aria-label="Facebook"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="grid h-10 w-10 place-items-center rounded-full border bg-background transition-colors hover:bg-accent"
              aria-label="Instagram"
            >
              <Heart className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* SITEMAP */}
        <div className="lg:col-span-2">
          <div className="text-sm font-semibold">Điều hướng</div>
          <ul className="mt-4 grid gap-2.5">
            {sitemapLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT & HOURS */}
        <div className="lg:col-span-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border bg-card p-6 shadow-soft">
              <div className="text-sm font-semibold">Thông tin liên hệ</div>
              <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>123 Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <a href="tel:19001234" className="hover:text-foreground">1900 1234</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a href="mailto:support@quancare.vn" className="hover:text-foreground">
                    support@quancare.vn
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-soft">
              <div className="text-sm font-semibold">Giờ làm việc</div>
              <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Thứ 2 – Thứ 6</span>
                  <span className="font-medium text-foreground">07:00 – 20:00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Thứ 7</span>
                  <span className="font-medium text-foreground">08:00 – 18:00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Chủ nhật</span>
                  <span className="font-medium text-foreground">08:00 – 12:00</span>
                </div>
                <div className="mt-1 flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs text-foreground">Cấp cứu 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} QuanCare. Bảo lưu mọi quyền.</span>
          <span>Giấy phép hoạt động số: 123/BYT-GPHĐ</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Điều khoản</a>
            <a href="#" className="hover:text-foreground">Bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
