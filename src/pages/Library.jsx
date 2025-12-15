import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useGetLibrariesQuery,
  useUpdateLibraryMutation,
  useDeleteLibraryMutation,
} from "../app/services/api";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { librarySchema } from "../utils/validationSchemas";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import LibraryCard from "@/components/LibraryCard";
import AddLibraryModal from "@/components/AddLibraryModal";

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLibrary, setEditingLibrary] = useState(null);

  const { data: libraryData = [], isLoading: isLoadingLibrary } = useGetLibrariesQuery();
  const [updateLibrary, { isLoading: isUpdating }] = useUpdateLibraryMutation();
  const [deleteLibrary, { isLoading: isDeleting }] = useDeleteLibraryMutation();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(librarySchema),
  });

  const handleEditLibrary = async (data) => {
    try {
      await updateLibrary({ id: editingLibrary.id, ...data }).unwrap();
      toast.success("Library item updated successfully!");
      setIsEditModalOpen(false);
      setEditingLibrary(null);
      reset();
    } catch (error) {
       const message =
        error.data?.message || "Failed to update library item";
      toast.error(message);
    }
  };

  const handleDeleteLibrary = async (libraryId) => {
    if (!window.confirm("Are you sure you want to delete this library item?")) {
      return;
    }
    try {
      await deleteLibrary(libraryId).unwrap();
      toast.success("Library item deleted successfully!");
    } catch (error) {
      const message =
        error.data?.message || "Failed to delete library item";
      toast.error(message);
    }
  };

  const openEditModal = (library) => {
    setEditingLibrary(library);
    reset(library);
    setIsEditModalOpen(true);
  };

  const filteredLibrary = (libraryData || [])
    .filter(
      (item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice()
    .reverse();

  if (isLoadingLibrary) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Library</h1>
          <p className="text-gray-500">Manage your book library</p>
        </div>
        <AddLibraryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Book
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search library..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Books ({libraryData.length})</CardTitle>
          <CardDescription>Browse and manage your books</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLibrary.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No book found.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredLibrary.map((item) => (
                <LibraryCard
                  key={item.id}
                  libraryItem={item}
                  onEdit={() => openEditModal(item)}
                  onDelete={() => handleDeleteLibrary(item.id)}
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {editingLibrary && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit PDF Details</DialogTitle>
              <DialogDescription>
                Update the details of your PDF.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleEditLibrary)} className="space-y-4">
              <Input {...register("title")} placeholder="Title" />
              {errors.title && <p className="text-red-500">{errors.title.message}</p>}
              <Input {...register("description")} placeholder="Description" />
              {errors.description && <p className="text-red-500">{errors.description.message}</p>}
              <Input {...register("url")} placeholder="PDF URL" />
              {errors.url && <p className="text-red-500">{errors.url.message}</p>}
              <Input {...register("author")} placeholder="Author" />
              {errors.author && <p className="text-red-500">{errors.author.message}</p>}
              <Input {...register("coverImage")} placeholder="Cover Image URL" />
              {errors.coverImage && <p className="text-red-500">{errors.coverImage.message}</p>}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Library;
