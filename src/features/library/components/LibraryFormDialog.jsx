import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LibraryForm } from "./LibraryForm";

export function LibraryFormDialog({
  open,
  onClose,
  onSave,
  editing,
  isCreating,
  isUpdating,
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Book" : "Add New Book"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the details of your book."
              : "Fill in the details to add a new book to your library."}
          </DialogDescription>
        </DialogHeader>
        <LibraryForm
          onSubmit={onSave}
          initialData={editing}
          isLoading={isCreating || isUpdating}
          submitText={editing ? "Update Book" : "Add Book"}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
