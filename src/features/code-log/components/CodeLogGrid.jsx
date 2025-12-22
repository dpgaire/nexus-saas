import { CodeLogCard } from "./CodeLogCard";
import { CodeLogCardSkeleton } from "./CodeLogCardSkeleton";

export function CodeLogGrid({
  codeLogs,
  onEdit,
  onDelete,
  isDeleting,
  isFetching,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {isFetching
        ? Array.from({ length: 3 }).map((_, i) => <CodeLogCardSkeleton key={i} />)
        : codeLogs.map((codeLog) => (
            <CodeLogCard
              key={codeLog.id}
              codeLog={codeLog}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
    </div>
  );
}
