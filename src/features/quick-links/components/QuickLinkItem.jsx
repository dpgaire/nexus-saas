import { Button } from "@/components/ui/button";
import { useClipboard } from "@/shared/hooks/useClipboard";
import { Edit, Trash, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { ConfirmAlertDialog } from "@/shared/components/ConfirmAlertDialog";
import { Copy } from "lucide-react";

export function QuickLinkItem({
  quickLink,
  onEdit,
  onDelete,
  isDeleting,
}) {
  const { copy } = useClipboard();
  const [linkToDelete, setLinkToDelete] = useState(null);

  const handleDeleteClick = (link) => {
    setLinkToDelete(link);
  };

  const confirmDelete = async () => {
    if (!linkToDelete) return;
    await onDelete(linkToDelete.id);
    setLinkToDelete(null);
  };

  return (
    <>
      <li className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
        <div className="flex items-center space-x-4 min-w-0">
          <LinkIcon className="h-5 w-5 text-gray-500" />
          <div className="flex flex-col min-w-0">
            <a
              href={quickLink.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-500 hover:underline"
            >
              {quickLink.title}
            </a>
            <p className="text-sm break-words text-gray-500 dark:text-gray-400">
              {quickLink.link}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(quickLink)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(quickLink)}
          >
            <Trash className="h-4 w-4" />
          </Button>
          <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copy(quickLink.link)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
        </div>
      </li>

      {linkToDelete && (
        <ConfirmAlertDialog
          open={!!linkToDelete}
          onCancel={() => setLinkToDelete(null)}
          title={`Delete link "${linkToDelete.title}"?`}
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
