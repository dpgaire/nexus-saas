import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateLibraryMutation } from "@/app/services/api";
import { librarySchema } from "@/utils/validationSchemas";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddLibraryModal = ({ isOpen, onClose }) => {
  const [createLibrary, { isLoading }] = useCreateLibraryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(librarySchema),
  });

  const onSubmit = async (data) => {
    try {
      await createLibrary(data).unwrap();
      toast.success("Library item created successfully!");
      reset();
      onClose();
    } catch (error) {
      const message =
        error.data?.message || "Failed to create library item";
      toast.error(message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New PDF</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new PDF to your library.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("title")} placeholder="Title" />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          <Input {...register("description")} placeholder="Description" />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
          <Input {...register("url")} placeholder="PDF URL" />
          {errors.url && <p className="text-red-500">{errors.url.message}</p>}
          <Input {...register("author")} placeholder="Author" />
          {errors.author && <p className="text-red-500">{errors.author.message}</p>}
          <Input {...register("coverImage")} placeholder="Cover Image URL" />
          {errors.coverImage && (
            <p className="text-red-500">{errors.coverImage.message}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLibraryModal;
