import toast from "react-hot-toast";
import {
  useGetLibrariesQuery,
  useCreateLibraryMutation,
  useUpdateLibraryMutation,
  useDeleteLibraryMutation,
} from "../api/library.api";

export function useLibraries() {
  const { data = [], isLoading: isFetching } = useGetLibrariesQuery();

  const [create, { isLoading: isCreating }] = useCreateLibraryMutation();
  const [update, { isLoading: isUpdating }] = useUpdateLibraryMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteLibraryMutation();

  const save = async (payload, editing) => {
    try {
      if (editing) {
        await update({ id: editing.id, ...payload }).unwrap();
        toast.success("Library item updated");
      } else {
        await create(payload).unwrap();
        toast.success("Library item created");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
      throw err;
    }
  };

  const deleteLibrary = async (id) => {
    try {
      await remove(id).unwrap();
      toast.success("Library item deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
      throw err;
    }
  };

  return {
    libraries: data,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    save,
    deleteLibrary,
  };
}
