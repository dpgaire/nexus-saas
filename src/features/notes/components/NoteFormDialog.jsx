import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNoteForm } from "../hooks/useNoteForm";

export function NoteFormDialog({
  open,
  editing,
  onSave,
  onClose,
  isCreating,
  isUpdating,
}) {
  const { register, handleSubmit, errors } = useNoteForm(editing);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Note" : "Add New Note"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div>
            <label htmlFor="title">Title</label>
            <Input id="title" {...register("title")} />
            <p className="text-red-500 text-sm">{errors.title?.message}</p>
          </div>
          <div>
            <label htmlFor="content">Description</label>
            <Textarea
              id="content"
              {...register("content")}
              className="w-full h-40 resize-none overflow-y-auto border rounded-md p-2"
            />
            <p className="text-red-500 text-sm">{errors.content?.message}</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating
                ? editing
                  ? "Updating..."
                  : "Creating..."
                : editing
                ? "Update"
                : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
