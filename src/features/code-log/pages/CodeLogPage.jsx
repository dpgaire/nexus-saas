import { useState } from "react";
import { useCodeLog } from "../hooks/useCodeLog";
import { useSearch } from "@/shared/hooks/useSearch";
import { SearchInput } from "@/shared/components/SearchInput";
import { CodeLogGrid } from "../components/CodeLogGrid";
import { CodeLogFormDialog } from "../components/CodeLogFormDialog";
import { PageLayout } from "@/shared/components/PageLayout";
import { useJsonImportExport } from "@/shared/hooks/useJsonImportExport";
import { createJsonImportHandler } from "@/shared/utils";
import { PageHeader } from "@/shared/components/PageHeader";

export default function CodeLogPage() {
  // feature business logic
  const {
    codeLogs,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    save,
    deleteCodeLog,
  } = useCodeLog();

  const { exportJson, importJson } = useJsonImportExport(async (item) => {
    await save(item);
  });

  const handleImport = createJsonImportHandler(importJson);

  // UI state (belongs to page)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCodeLog, setEditingCodeLog] = useState(null);

  // shared search logic
  const search = useSearch(codeLogs, (p, term) =>
    p.title.toLowerCase().includes(term)
  );

  const handleCreate = () => {
    setEditingCodeLog(null);
    setDialogOpen(true);
  };

  const handleEdit = (codeLog) => {
    setEditingCodeLog(codeLog);
    setDialogOpen(true);
  };

  const handleSave = async (data) => {
    await save(data, editingCodeLog);
    setDialogOpen(false);
    setEditingCodeLog(null);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingCodeLog(null);
  };

  return (
    <PageLayout
      title="Code Log"
      description="Manage and reuse your code snippets"
    >
      {/* Header */}
      <PageHeader
        addLabel="Code Log"
        onCreate={handleCreate}
        onExport={() => exportJson(codeLogs, "code-logs.json")}
        onImport={handleImport}
      />

      {/* Search */}
      <SearchInput
        value={search.term}
        onChange={search.setTerm}
        placeholder="Search code logs..."
      />

      {/* Grid */}
      <CodeLogGrid
        codeLogs={search.filtered}
        onEdit={handleEdit}
        isDeleting={isDeleting}
        isFetching={isFetching}
        onDelete={deleteCodeLog}
      />

      {/* Dialog */}
      <CodeLogFormDialog
        isCreating={isCreating}
        isUpdating={isUpdating}
        open={dialogOpen}
        editing={editingCodeLog}
        onSave={handleSave}
        onClose={handleClose}
      />
    </PageLayout>
  );
}
