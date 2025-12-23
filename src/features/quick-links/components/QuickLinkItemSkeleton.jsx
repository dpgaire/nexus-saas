import { Skeleton } from "@/components/ui/skeleton";

export function QuickLinkItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center space-x-4 min-w-0">
        <Skeleton className="h-5 w-5" />
        <div className="flex flex-col min-w-0 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  );
}
