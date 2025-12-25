import { EmptyState } from "@/shared/components/EmptyState";
import { Book } from "lucide-react";
import LibraryCard from "./LibraryCard";
import { LibraryCardSkeleton } from "./LibraryCardSkeleton";

export function LibrariesGrid({
  libraries = [],
  onEdit,
  onDelete,
  isFetching,
  isDeleting,
}) {
  const isEmpty = !isFetching && libraries.length === 0;
  const hasData = !isFetching && libraries.length > 0;

  return (
    <>
      {isFetching && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <LibraryCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isEmpty && (
        <EmptyState
          icon={Book}
          title="No books found"
          description="Get started by adding a new book to your library."
        />
      )}

      {hasData && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {libraries.map((item) => (
            <LibraryCard
              key={item.id}
              libraryItem={item}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id)}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </>
  );
}
