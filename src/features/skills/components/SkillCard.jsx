import { Button } from "@/components/ui/button";
import { ConfirmAlertDialog } from "@/shared/components/ConfirmAlertDialog";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";

export function SkillCard({ skill, onEdit, onDelete, isDeleting }) {
  const [skillToDelete, setSkillToDelete] = useState(null);

  const handleDeleteClick = (skill) => {
    setSkillToDelete(skill);
  };

  const confirmDelete = async () => {
    if (!skillToDelete) return;
    await onDelete(skillToDelete.id);
    setSkillToDelete(null);
  };

  return (
    <>
      <div
        key={skill.id}
        className="flex items-center justify-between p-4 border rounded-lg"
      >
        <div className="flex-1">
          <h3 className="font-medium">
            {skill.icon} {skill.title}
          </h3>
          <div className="text-sm text-gray-500">
            {skill.skills.map((s) => s.name).join(", ")}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(skill)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(skill)}
            className="text-red-600 hover:text-red-700"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {skillToDelete && (
        <ConfirmAlertDialog
          open={!!skillToDelete}
          onCancel={() => setSkillToDelete(null)}
          title={`Delete skill "${skillToDelete?.title}"?`}
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
