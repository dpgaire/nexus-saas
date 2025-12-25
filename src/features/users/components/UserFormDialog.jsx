import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "./UserForm";

export function UserFormDialog({
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
          <DialogTitle>{editing ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the details of the user."
              : "Fill in the details to create a new user."}
          </DialogDescription>
        </DialogHeader>
        <UserForm
          onSubmit={onSave}
          initialData={editing}
          isLoading={isCreating || isUpdating}
          submitText={editing ? "Update User" : "Create User"}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
