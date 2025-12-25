import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmAlertDialog } from "@/shared/components/ConfirmAlertDialog";
import { useClipboard } from "@/shared/hooks/useClipboard";
import { Edit, Trash, Copy } from "lucide-react";
import { useState } from "react";

export function NoteCard({ note, onEdit, onDelete, isDeleting }) {
  const { copy } = useClipboard();

  const [noteToDelete, setNoteToDelete] = useState(null);

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    await onDelete(noteToDelete.id);
    setNoteToDelete(null);
  };

  return (
    <>
      <Card
        className="
          relative max-h-[400px] overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800/80
          bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm
          shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
        "
      >
        {/* Card Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100 tracking-tight">
              {note.title}
            </CardTitle>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(note)}
                className="h-8 w-8 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <Edit className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(note)}
                className="h-8 w-8 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
              >
                <Trash className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => copy(note.content)}
                className="h-8 w-8 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Content with subtle scrollbar */}
        <CardContent className="overflow-y-auto max-h-[300px] pb-6">
          <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
            {note.content}
          </p>
        </CardContent>
      </Card>

      {noteToDelete && (
        <ConfirmAlertDialog
          open={!!noteToDelete}
          onCancel={() => setNoteToDelete(null)}
          title={`Delete note "${noteToDelete?.title}"?`}
          description="This action cannot be undone."
          onConfirm={confirmDelete}
          isLoading={isDeleting}
          loadingText="Deleting..."
          confirmText="Delete"
        />
      )}
    </>
  );
}