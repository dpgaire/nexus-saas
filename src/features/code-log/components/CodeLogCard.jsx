import { Button } from "@/components/ui/button";
import { Edit, Trash, Copy } from "lucide-react";
import { useClipboard } from "@/shared/hooks/useClipboard";
import { CodeBlockCard } from "@/shared/components/CodeBlockCard";
import { useState } from "react";
import { ConfirmAlertDialog } from "@/shared/components/ConfirmAlertDialog";

export function CodeLogCard({ codeLog, onEdit, onDelete, isDeleting }) {
  const { copy } = useClipboard();

  const [codeLogToDelete, setCodeLogToDelete] = useState(null);

  const handleDeleteClick = (codeLog) => {
    setCodeLogToDelete(codeLog);
  };

  const confirmDelete = async () => {
    if (!codeLogToDelete) return;
    await onDelete(codeLogToDelete.id);
    setCodeLogToDelete(null);
  };

  return (
    <>
      <CodeBlockCard
        title={codeLog.title}
        content={codeLog.code}
        actions={
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => onEdit(codeLog)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleDeleteClick(codeLog)}
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => copy(codeLog.code)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        }
      />
      {codeLogToDelete && (
        <ConfirmAlertDialog
          open={!!codeLogToDelete}
          onCancel={() => setCodeLogToDelete(null)}
          title={`Delete code log "${codeLogToDelete?.title}"?`}
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
