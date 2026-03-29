import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="mt-2 h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-full sm:w-80" />
        </div>
        <div className="mt-6">
          <Skeleton className="h-10 w-full" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

