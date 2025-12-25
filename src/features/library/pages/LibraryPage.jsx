import React, { useState } from "react";
import { useLibraries } from "../hooks/useLibraries";
import { useSearch } from "@/shared/hooks/useSearch";
import { SearchInput } from "@/shared/components/SearchInput";
import { PageLayout } from "@/shared/components/PageLayout";
import { PageHeader } from "@/shared/components/PageHeader";
import { useJsonImportExport } from "@/shared/hooks/useJsonImportExport";
import { createJsonImportHandler } from "@/shared/utils/fileImport";
import { LibrariesGrid } from "../components/LibrariesGrid";
import { LibraryFormDialog } from "../components/LibraryFormDialog";

export default function LibraryPage() {
  const {
    libraries,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    save,
    deleteLibrary,
  } = useLibraries();

  const { exportJson, importJson } = useJsonImportExport(async (item) => {
    await save(item);
  });

  const handleImport = createJsonImportHandler(importJson);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLibrary, setEditingLibrary] = useState(null);

  const search = useSearch(
    libraries,
    (item, term) =>
      item.title.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.author.toLowerCase().includes(term)
  );

  const handleCreate = () => {
    setEditingLibrary(null);
    setDialogOpen(true);
  };

  const handleEdit = (library) => {
    setEditingLibrary(library);
    setDialogOpen(true);
  };

  const handleSave = async (data) => {
    await save(data, editingLibrary);
    setDialogOpen(false);
    setEditingLibrary(null);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingLibrary(null);
  };

  return (
    <PageLayout title="Library" description="Manage your book library">
      <PageHeader
        addLabel="Book"
        onCreate={handleCreate}
        onExport={() => exportJson(libraries, "library.json")}
        onImport={handleImport}
      />
      <SearchInput
        value={search.term}
        onChange={search.setTerm}
        placeholder="Search library..."
      />
      <LibrariesGrid
        libraries={search.filtered}
        onEdit={handleEdit}
        isDeleting={isDeleting}
        isFetching={isFetching}
        onDelete={deleteLibrary}
      />
      <LibraryFormDialog
        isCreating={isCreating}
        isUpdating={isUpdating}
        open={dialogOpen}
        editing={editingLibrary}
        onSave={handleSave}
        onClose={handleClose}
      />
    </PageLayout>
  );
}
