import { Button } from "@/components/ui/button";
import { Edit, Trash, Copy } from "lucide-react";
import { useClipboard } from "@/shared/hooks/useClipboard";
import { CodeBlockCard } from "@/shared/components/CodeBlockCard";
import { useState } from "react";
import { ConfirmAlertDialog } from "@/shared/components/ConfirmAlertDialog";

export function PromptCard({ prompt, onEdit, onDelete, isDeleting }) {
  const { copy } = useClipboard();

  const [promptToDelete, setPromptToDelete] = useState(null);

  const handleDeleteClick = (prompt) => {
    setPromptToDelete(prompt);
  };

  const confirmDelete = async () => {
    if (!promptToDelete) return;
    await onDelete(promptToDelete.id);
    setPromptToDelete(null);
  };

  return (
    <>
      <CodeBlockCard
        title={prompt.title}
        content={prompt.prompt}
        category={prompt.ai_category}
        actions={
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => onEdit(prompt)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleDeleteClick(prompt)}
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => copy(prompt.prompt)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        }
      />
      {promptToDelete && (
        <ConfirmAlertDialog
          open={!!promptToDelete}
          onCancel={() => setPromptToDelete(null)}
          title={`Delete prompt "${promptToDelete?.title}"?`}
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
