import { Skeleton } from "@/components/ui/skeleton";

export function LibraryCardSkeleton() {
  return (
    <div className="w-full md:w-64 h-80 rounded-lg shadow-md flex flex-col overflow-hidden border">
      <div className="relative flex-1 flex flex-col p-2 bg-gray-50 dark:bg-gray-800">
        <Skeleton className="h-6 w-3/4 mx-auto mb-3" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </div>
      <div className="h-1 bg-gray-300 dark:bg-gray-700"></div>
      <div className="px-3 py-2 bg-white dark:bg-gray-900 border-t flex justify-between items-center">
        <Skeleton className="h-8 w-20" />
        <div className="flex gap-1">
          <Skeleton className="h-7 w-7 rounded-sm" />
          <Skeleton className="h-7 w-7 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
