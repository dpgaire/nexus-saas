import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QuickLinkItem } from "./QuickLinkItem";
import { QuickLinkItemSkeleton } from "./QuickLinkItemSkeleton";
import { SearchInput } from "@/shared/components/SearchInput";

export function QuickLinksList({
  quickLinks,
  onEdit,
  onDelete,
  isDeleting,
  isFetching,
}) {
  return (
    <Card>
      <CardContent>
        <ul className="space-y-4">
          {isFetching
            ? Array.from({ length: 3 }).map((_, i) => (
                <QuickLinkItemSkeleton key={i} />
              ))
            : quickLinks.map((quickLink) => (
                <QuickLinkItem
                  key={quickLink.id}
                  quickLink={quickLink}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isDeleting={isDeleting}
                />
              ))}
        </ul>
      </CardContent>
    </Card>
  );
}
