import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { librarySchema } from "../schema/library.schema";

export function LibraryForm({ onSubmit, initialData, isLoading, submitText, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(librarySchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      url: "",
      author: "",
      coverImage: "",
    },
  });

  return (
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : submitText}
        </Button>
      </div>
    </form>
  );
}
