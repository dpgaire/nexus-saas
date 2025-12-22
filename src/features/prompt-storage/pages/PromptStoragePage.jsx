import { useState } from "react";
import { usePromptStorage } from "../hooks/usePromptStorage";
import { useSearch } from "@/shared/hooks/useSearch";
import { SearchInput } from "@/shared/components/SearchInput";
import { PromptGrid } from "../components/PromptGrid";
import { PromptFormDialog } from "../components/PromptFormDialog";
import { PageLayout } from "@/shared/components/PageLayout";
import { useJsonImportExport } from "@/shared/hooks/useJsonImportExport";
import { createJsonImportHandler } from "@/shared/utils";
import { PageHeader } from "@/shared/components/PageHeader";

export default function PromptStoragePage() {
  // feature business logic
  const {
    prompts,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    save,
    deletePrompt,
  } = usePromptStorage();

  const { exportJson, importJson } = useJsonImportExport(async (item) => {
    await save(item);
  });

  const handleImport = createJsonImportHandler(importJson);

  // UI state (belongs to page)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);

  // shared search logic
  const search = useSearch(prompts, (p, term) =>
    p.title.toLowerCase().includes(term)
  );

  const handleCreate = () => {
    setEditingPrompt(null);
    setDialogOpen(true);
  };

  const handleEdit = (prompt) => {
    setEditingPrompt(prompt);
    setDialogOpen(true);
  };

  const handleSave = async (data) => {
    await save(data, editingPrompt);
    setDialogOpen(false);
    setEditingPrompt(null);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingPrompt(null);
  };

  return (
    <PageLayout
      title="Prompt Storage"
      description="Manage and reuse your prompts"
    >
      {/* Header */}
      <PageHeader
        addLabel="Prompt"
        onCreate={handleCreate}
        onExport={() => exportJson(prompts, "prompts.json")}
        onImport={handleImport}
      />

      {/* Search */}
      <SearchInput
        value={search.term}
        onChange={search.setTerm}
        placeholder="Search prompts..."
      />

      {/* Grid */}
      <PromptGrid
        prompts={search.filtered}
        onEdit={handleEdit}
        isDeleting={isDeleting}
        isFetching={isFetching}
        onDelete={deletePrompt}
      />

      {/* Dialog */}
      <PromptFormDialog
        isCreating={isCreating}
        isUpdating={isUpdating}
        open={dialogOpen}
        editing={editingPrompt}
        onSave={handleSave}
        onClose={handleClose}
      />
    </PageLayout>
  );
}
