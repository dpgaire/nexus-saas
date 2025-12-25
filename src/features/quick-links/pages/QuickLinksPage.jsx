import { useState } from "react";
import { useQuickLink } from "../hooks/useQuickLink";
import { useSearch } from "@/shared/hooks/useSearch";
import { QuickLinksList } from "../components/QuickLinksList";
import { QuickLinkFormDialog } from "../components/QuickLinkFormDialog";
import { PageLayout } from "@/shared/components/PageLayout";
import { useJsonImportExport } from "@/shared/hooks/useJsonImportExport";
import { PageHeader } from "@/shared/components/PageHeader";
import { SearchInput } from "@/shared/components/SearchInput";
import { createJsonImportHandler } from "@/shared/utils/fileImport";

export default function QuickLinksPage() {
  // feature business logic
  const {
    quickLinks,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    save,
    deleteQuickLink,
  } = useQuickLink();

  const { exportJson, importJson } = useJsonImportExport(async (item) => {
    await save(item);
  });

  const handleImport = createJsonImportHandler(importJson);

  // UI state (belongs to page)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuickLink, setEditingQuickLink] = useState(null);

  // shared search logic
  const search = useSearch(quickLinks, (p, term) =>
    p.title.toLowerCase().includes(term)
  );

  const handleCreate = () => {
    setEditingQuickLink(null);
    setDialogOpen(true);
  };

  const handleEdit = (quickLink) => {
    setEditingQuickLink(quickLink);
    setDialogOpen(true);
  };

  const handleSave = async (data) => {
    await save(data, editingQuickLink);
    setDialogOpen(false);
    setEditingQuickLink(null);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingQuickLink(null);
  };

  return (
    <PageLayout
      title="Quick Links"
      description="Manage and reuse your quick links"
    >
      {/* Header */}
      <PageHeader
        addLabel="Quick Link"
        onCreate={handleCreate}
        onExport={() => exportJson(quickLinks, "quick-links.json")}
        onImport={handleImport}
      />

      {/* Search */}
      <SearchInput
        value={search.term}
        onChange={search.setTerm}
        placeholder="Search code logs..."
      />

      {/* List */}
      <QuickLinksList
        quickLinks={search.filtered}
        onEdit={handleEdit}
        isFetching={isFetching}
        onDelete={deleteQuickLink}
        isDeleting={isDeleting}
      />

      {/* Dialog */}
      <QuickLinkFormDialog
        isCreating={isCreating}
        isUpdating={isUpdating}
        open={dialogOpen}
        editing={editingQuickLink}
        onSave={handleSave}
        onClose={handleClose}
      />
    </PageLayout>
  );
}
