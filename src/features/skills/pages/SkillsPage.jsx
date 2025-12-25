import React, { useState } from "react";
import { useSkills } from "../hooks/useSkills";
import { useSearch } from "@/shared/hooks/useSearch";
import { PageLayout } from "@/shared/components/PageLayout";
import { PageHeader } from "@/shared/components/PageHeader";
import { useJsonImportExport } from "@/shared/hooks/useJsonImportExport";
import { createJsonImportHandler } from "@/shared/utils/fileImport";
import { SkillsGrid } from "../components/SkillsGrid";
import { SkillFormDialog } from "../components/SkillFormDialog";
import { SearchInput } from "@/shared/components/SearchInput";

export default function SkillsPage() {
  const {
    skills,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    save,
    deleteSkill,
  } = useSkills();

  const { exportJson, importJson } = useJsonImportExport(async (item) => {
    await save(item);
  });

  const handleImport = createJsonImportHandler(importJson);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const search = useSearch(
    skills,
    (skill, term) =>
      skill.title.toLowerCase().includes(term) ||
      skill.skills.some((s) => s.name.toLowerCase().includes(term))
  );

  const handleCreate = () => {
    setEditingSkill(null);
    setDialogOpen(true);
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setDialogOpen(true);
  };

  const handleSave = async (data) => {
    await save(data, editingSkill);
    setDialogOpen(false);
    setEditingSkill(null);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingSkill(null);
  };

  return (
    <PageLayout title="Skills" description="Manage your skills">
      <PageHeader
        addLabel="Skill"
        onCreate={handleCreate}
        onExport={() => exportJson(skills, "skills.json")}
        onImport={handleImport}
      />
      <SearchInput
        value={search.term}
        onChange={search.setTerm}
        placeholder="Search skills..."
      />
      <SkillsGrid
        skills={search.filtered}
        onEdit={handleEdit}
        isDeleting={isDeleting}
        isFetching={isFetching}
        onDelete={deleteSkill}
      />
      <SkillFormDialog
        isCreating={isCreating}
        isUpdating={isUpdating}
        open={dialogOpen}
        editing={editingSkill}
        onSave={handleSave}
        onClose={handleClose}
      />
    </PageLayout>
  );
}
