import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PromptCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-col items-start">
        <div className="flex justify-between w-full items-center">
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <Skeleton className="h-3 w-1/4" />
      </CardHeader>

      <CardContent className="font-mono text-sm max-h-60 overflow-auto">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </CardContent>
    </Card>
  );
}
