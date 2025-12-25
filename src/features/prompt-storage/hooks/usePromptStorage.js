import toast from "react-hot-toast";
import {
  useCreatePromptStorageMutation,
  useDeletePromptStorageMutation,
  useGetPromptStoragesQuery,
  useUpdatePromptStorageMutation,
} from "../api/prompt-storage.api";

export function usePromptStorage() {
  const { data = [], isLoading: isFetching } = useGetPromptStoragesQuery();

  const [create, { isLoading: isCreating }] = useCreatePromptStorageMutation();
  const [update, { isLoading: isUpdating }] = useUpdatePromptStorageMutation();
  const [remove, { isLoading: isDeleting }] = useDeletePromptStorageMutation();

  const save = async (payload, editing) => {
    try {
      if (editing) {
        await update({ id: editing.id, ...payload }).unwrap();
        toast.success("Prompt updated");
      } else {
        await create(payload).unwrap();
        toast.success("Prompt created");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
      throw err;
    }
  };

  const deletePrompt = async (id) => {
    try {
      await remove(id).unwrap();
      toast.success("Prompt deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
      throw err;
    }
  };

  return {
    prompts: data,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    save,
    deletePrompt,
  };
}
