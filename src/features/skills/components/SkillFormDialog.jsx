import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SkillForm } from "./SkillForm";

export function SkillFormDialog({
  open,
  onClose,
  onSave,
  editing,
  isCreating,
  isUpdating,
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Skill" : "Create New Skill"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the skill category and individual skills."
              : "Add a new skill category and individual skills."}
          </DialogDescription>
        </DialogHeader>
        <SkillForm
          onSubmit={onSave}
          initialData={editing}
          isLoading={isCreating || isUpdating}
          submitText={editing ? "Update Skill" : "Create Skill"}
        />
      </DialogContent>
    </Dialog>
  );
}
