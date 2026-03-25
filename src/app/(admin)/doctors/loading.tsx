import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="mt-2 h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
            <Skeleton className="mt-4 h-4 w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}

