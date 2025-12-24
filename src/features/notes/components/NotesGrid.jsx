import { NoteCard } from "./NoteCard";
import { EmptyState } from "@/shared/components/EmptyState";
import { NoteCardSkeleton } from "./NoteCardSkeleton";

export function NotesGrid({
  notes = [],
  onEdit,
  onDelete,
  isDeleting,
  isFetching,
}) {
  const isEmpty = !isFetching && notes.length === 0;
  const hasData = !isFetching && notes.length > 0;

  return (
    <>
      {isFetching && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <NoteCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isEmpty && <EmptyState title="No notes found" />}

      {hasData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={onEdit}
              onDelete={() => onDelete(note.id)}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </>
  );
}
