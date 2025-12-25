import React, { useState } from "react";

import { PageLayout } from "@/shared/components/PageLayout";
import { PageHeader } from "@/shared/components/PageHeader";
import { useJsonImportExport } from "@/shared/hooks/useJsonImportExport";
import { createJsonImportHandler } from "@/shared/utils/fileImport";
import { useUsers } from "../hooks/useUsers";
import { UsersGrid } from "../components/UsersGrid";
import { UserFormDialog } from "../components/UserFormDialog";
import { SearchInput } from "@/shared/components/SearchInput";
import { useSearch } from "@/shared/hooks/useSearch";

const UsersPage = () => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const {
    users,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    save,
    deleteUser,
  } = useUsers();

  const { exportJson, importJson } = useJsonImportExport(async (item) => {
    await save(item);
  });

  const handleImport = createJsonImportHandler(importJson);

    const search = useSearch(
      users,
      (u, term) =>
        u.fullName.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
    );

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleSave = async (data) => {
    await save(data, editingUser);
    setFormOpen(false);
    setEditingUser(null);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingUser(null);
  };



  return (
    <PageLayout
      title="Users"
      description={`Manage and connect with ${users.length} active users`}
    >
      <PageHeader
        addLabel="User"
        onCreate={handleCreateUser}
        onExport={() => exportJson(users, "users.json")}
        onImport={handleImport}
      />
      <SearchInput
        value={search.term}
        onChange={search.setTerm}
        placeholder="Search users by name or email..."
      />
      
      <UsersGrid
        users={search.filtered}
        isFetching={isFetching}
        onEditUser={handleEditUser}
        onDeleteUser={deleteUser}
        isDeletingUser={isDeleting}
      />
      <UserFormDialog
        open={isFormOpen}
        onClose={handleClose}
        onSave={handleSave}
        editing={editingUser}
        isCreating={isCreating}
        isUpdating={isUpdating}
      />
    </PageLayout>
  );
};

export default UsersPage;
