import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UserCardSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6 pt-12 text-center">
        <Skeleton className="w-20 h-20 mx-auto mb-4 rounded-full" />
        <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-4 w-1/2 mx-auto mb-3" />
        <Skeleton className="h-6 w-20 mx-auto rounded-full" />
      </CardContent>
    </Card>
  );
}
