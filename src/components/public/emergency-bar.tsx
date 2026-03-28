import { Phone } from "lucide-react";

export function EmergencyBar() {
  return (
    <div className="w-full bg-red-600 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-3.5 w-3.5 animate-pulse" />
          <span className="font-semibold">Cấp cứu 24/7:</span>
          <a href="tel:19001234" className="font-bold underline underline-offset-2 hover:text-red-100">
            1900 1234
          </a>
        </div>
        <span className="hidden text-xs text-red-100 sm:inline">
          Đường dây khẩn cấp luôn sẵn sàng hỗ trợ bạn
        </span>
      </div>
    </div>
  );
}
