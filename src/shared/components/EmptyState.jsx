import { Card, CardContent } from "@/components/ui/card";
import { Inbox } from "lucide-react";

export function EmptyState({
  title = "No items found",
  description = "Try adjusting your search or create your first item.",
}) {
  return (
    <Card className="border border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <Inbox className="h-8 w-8 text-muted-foreground" />

        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
