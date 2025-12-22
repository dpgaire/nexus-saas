import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePromptForm } from "../hooks/usePromptForm.js";

export function PromptFormDialog({
  isCreating = false,
  isUpdating = false,
  open,
  onClose,
  onSave,
  editing,
}) {
  const { register, handleSubmit } = usePromptForm(editing);

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Prompt" : "Add Prompt"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <Input {...register("title")} placeholder="Title" />
          <Input {...register("ai_category")} placeholder="AI Category" />
          <Textarea {...register("prompt")} placeholder="Prompt" rows={8} />

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
