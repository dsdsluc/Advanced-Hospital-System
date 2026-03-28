import { ShieldCheck } from "lucide-react";

const items = [
  { abbr: "BYT", name: "Bộ Y Tế Việt Nam cấp phép" },
  { abbr: "ISO", name: "ISO 9001:2015" },
  { abbr: "JCI", name: "JCI Accredited" },
  { abbr: "BVI", name: "Bảo Việt Insurance" },
  { abbr: "AIA", name: "AIA Vietnam" },
  { abbr: "PVI", name: "PVI Insurance" },
];

export function AccreditationsSection() {
  return (
    <section className="border-y bg-muted/10 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Chứng nhận & đối tác bảo hiểm
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {items.map((item) => (
            <div
              key={item.abbr}
              className="flex items-center gap-2.5 rounded-xl border bg-card px-5 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">{item.abbr}</div>
                <div className="text-[10px] leading-tight text-muted-foreground">{item.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
