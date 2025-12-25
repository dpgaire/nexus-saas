import { Card, CardContent } from "@/components/ui/card";
import { QuickLinkItem } from "./QuickLinkItem";
import { QuickLinkItemSkeleton } from "./QuickLinkItemSkeleton";
import { EmptyState } from "@/shared/components/EmptyState";

export function QuickLinksList({
  quickLinks,
  onEdit,
  onDelete,
  isDeleting,
  isFetching,
}) {
  const isEmpty = !isFetching && quickLinks.length === 0;
  const hasData = !isFetching && quickLinks.length > 0;

  return (
    <Card>
      <CardContent>
        {isFetching && (
          <ul className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <QuickLinkItemSkeleton key={i} />
            ))}
          </ul>
        )}

        {isEmpty && <EmptyState title="No links found" />}

        {hasData && (
          <ul className="space-y-4">
            {quickLinks.map((quickLink) => (
              <QuickLinkItem
                key={quickLink.id}
                quickLink={quickLink}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
