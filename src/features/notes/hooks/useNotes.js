import toast from "react-hot-toast";
import { useCreateNoteMutation, useDeleteNoteMutation, useGetNotesQuery, useUpdateNoteMutation } from "../api/notes.api";


export function useNotes() {
  const { data = [], isLoading: isFetching } = useGetNotesQuery();

  const [create, { isLoading: isCreating }] = useCreateNoteMutation();
  const [update, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteNoteMutation();

  const save = async (payload, editing) => {
    try {
      if (editing) {
        await update({ id: editing.id, ...payload }).unwrap();
        toast.success("Note updated");
      } else {
        await create(payload).unwrap();
        toast.success("Note created");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
      throw err;
    }
  };

  const deleteNote = async (id) => {
    try {
      await remove(id).unwrap();
      toast.success("Note deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
      throw err;
    }
  };

  return {
    notes: data,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    save,
    deleteNote,
  };
}
