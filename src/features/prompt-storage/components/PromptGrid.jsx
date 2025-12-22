import { PromptCard } from "./PromptCard";
import { PromptCardSkeleton } from "./PromptCardSkeleton";

export function PromptGrid({
  prompts,
  onEdit,
  onDelete,
  isDeleting,
  isFetching = false,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {isFetching
        ? Array.from({ length: 3 }).map((_, i) => (
            <PromptCardSkeleton key={i} />
          ))
        : prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
    </div>
  );
}
