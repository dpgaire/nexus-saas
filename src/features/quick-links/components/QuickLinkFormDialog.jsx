import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuickLinkForm } from "../hooks/useQuickLinkForm.js";

export function QuickLinkFormDialog({
  isCreating = false,
  isUpdating = false,
  open,
  onClose,
  onSave,
  editing,
}) {
  const { register, handleSubmit } = useQuickLinkForm(editing);

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Quick Link" : "Add Quick Link"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <Input {...register("title")} placeholder="Title" />
          <Input {...register("link")} placeholder="URL" />

          <Button type="submit" disabled={isLoading}>
            {isCreating
              ? "Saving..."
              : isUpdating
              ? "Updating..."
              : editing
              ? "Update"
              : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
