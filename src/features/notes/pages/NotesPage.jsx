import { useState } from "react";
import { useNotes } from "../hooks/useNotes";
import { useSearch } from "@/shared/hooks/useSearch";
import { SearchInput } from "@/shared/components/SearchInput";
import { NotesGrid } from "../components/NotesGrid";
import { NoteFormDialog } from "../components/NoteFormDialog";
import { PageLayout } from "@/shared/components/PageLayout";
import { useJsonImportExport } from "@/shared/hooks/useJsonImportExport";
import { PageHeader } from "@/shared/components/PageHeader";
import { createJsonImportHandler } from "@/shared/utils/fileImport";

export default function NotesPage() {
  const {
    notes,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    save,
    deleteNote,
  } = useNotes();

  const { exportJson, importJson } = useJsonImportExport(async (item) => {
    await save(item);
  });

  const handleImport = createJsonImportHandler(importJson);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const search = useSearch(
    notes,
    (p, term) =>
      p.title.toLowerCase().includes(term) ||
      p.content.toLowerCase().includes(term)
  );

  const handleCreate = () => {
    setEditingNote(null);
    setDialogOpen(true);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setDialogOpen(true);
  };

  const handleSave = async (data) => {
    await save(data, editingNote);
    setDialogOpen(false);
    setEditingNote(null);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingNote(null);
  };

  return (
    <PageLayout
      title="Notes"
      description="Create and manage your notes"
    >
      <PageHeader
        addLabel="Note"
        onCreate={handleCreate}
        onExport={() => exportJson(notes, "notes.json")}
        onImport={handleImport}
      />
      <SearchInput
        value={search.term}
        onChange={search.setTerm}
        placeholder="Search notes..."
      />
      <NotesGrid
        notes={search.filtered}
        onEdit={handleEdit}
        isDeleting={isDeleting}
        isFetching={isFetching}
        onDelete={deleteNote}
      />
      <NoteFormDialog
        isCreating={isCreating}
        isUpdating={isUpdating}
        open={dialogOpen}
        editing={editingNote}
        onSave={handleSave}
        onClose={handleClose}
      />
    </PageLayout>
  );
}
