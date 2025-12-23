import { CodeLogCard } from "./CodeLogCard";
import { CodeLogCardSkeleton } from "./CodeLogCardSkeleton";
import { EmptyState } from "@/shared/components/EmptyState";

export function CodeLogGrid({
  codeLogs = [],
  onEdit,
  onDelete,
  isDeleting,
  isFetching,
}) {
  const isEmpty = !isFetching && codeLogs.length === 0;
  const hasData = !isFetching && codeLogs.length > 0;

  return (
    <>
      {isFetching && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <CodeLogCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isEmpty && <EmptyState title="No code logs found" />}

      {hasData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {codeLogs.map((codeLog) => (
            <CodeLogCard
              key={codeLog.id}
              codeLog={codeLog}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </>
  );
}
