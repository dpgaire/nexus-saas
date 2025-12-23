import { PromptCard } from "./PromptCard";
import { PromptCardSkeleton } from "./PromptCardSkeleton";
import { EmptyState } from "@/shared/components/EmptyState";

export function PromptGrid({
  prompts,
  onEdit,
  onDelete,
  isDeleting,
  isFetching = false,
}) {
  const isEmpty = !isFetching && prompts.length === 0;
  const hasData = !isFetching && prompts.length > 0;

  return (
    <>
      {isFetching && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <PromptCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isEmpty && <EmptyState title="No prompts found" />}

      {hasData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
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
