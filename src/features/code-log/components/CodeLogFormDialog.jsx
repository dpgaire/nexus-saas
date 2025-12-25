import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCodeLogForm } from "../hooks/useCodeLogForm.js";

export function CodeLogFormDialog({
  isCreating = false,
  isUpdating = false,
  open,
  onClose,
  onSave,
  editing,
}) {
  const { register, handleSubmit } = useCodeLogForm(editing);

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Code Log" : "Add Code Log"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <Input {...register("title")} placeholder="Title" />
          <Textarea
            {...register("code")}
            placeholder="Code"
            rows={8}
            className="w-full h-40 resize-none overflow-y-auto border rounded-md p-2"
          />

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
