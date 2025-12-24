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
        relative max-h-[400px] overflow-y-scroll rounded-xl border border-gray-200 dark:border-gray-700
        bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800
        shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        before:absolute before:inset-0
        before:bg-[repeating-linear-gradient(white,white_24px,#e5e7eb_25px)]
        dark:before:bg-[repeating-linear-gradient(#1f2937,#1f2937_24px,#374151_25px)]
        before:opacity-60 before:-z-0
      "
      >
        {/* Red margin line (dark mode adjusted) */}
        <div className="absolute top-0 left-0 h-full w-[6px] bg-gradient-to-b from-green-300 via-blue-300 to-green-300 dark:from-green-600 dark:via-blue-700 dark:to-green-600 z-10" />

        {/* Card Header (title + buttons) */}
        <CardHeader className="relative flex flex-row items-center justify-between bg-transparent z-20 px-5 pt-2">
          <CardTitle className="font-handwriting text-lg font-semibold text-gray-800 dark:text-gray-100 tracking-wide">
            {note.title}
          </CardTitle>

          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(note)}
              className="hover:bg-rose-100 dark:hover:bg-green-900/40 text-green-500 dark:text-green-400"
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteClick(note)}
              className="hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 dark:text-red-400"
            >
              <Trash className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => copy(note.content)}
              className="hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-500 dark:text-blue-400"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="relative px-6 pb-6 pt-2 z-20">
          <p className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-200 font-medium">
            {note.content}
          </p>
        </CardContent>

        {/* Bottom paper shadow */}
        <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-gray-200 dark:from-gray-700 to-transparent opacity-70"></div>
      </Card>

      {noteToDelete && (
        <ConfirmAlertDialog
          open={!!noteToDelete}
          onCancel={() => setNoteToDelete(null)}
          title={`Delete code log "${noteToDelete?.title}"?`}
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
