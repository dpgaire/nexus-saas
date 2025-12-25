import { EmptyState } from "@/shared/components/EmptyState";
import { Layers } from "lucide-react";
import { SkillCard } from "./SkillCard";
import { SkillCardSkeleton } from "./SkillCardSkeleton";

export function SkillsGrid({
  skills = [],
  onEdit,
  onDelete,
  isFetching,
  isDeleting,
}) {
  const isEmpty = !isFetching && skills.length === 0;
  const hasData = !isFetching && skills.length > 0;

  return (
    <>
      {isFetching && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkillCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isEmpty && (
        <EmptyState
          icon={Layers}
          title="No skills found"
          description="Get started by creating a new skill."
        />
      )}

      {hasData && (
        <div className="space-y-4">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </>
  );
}
