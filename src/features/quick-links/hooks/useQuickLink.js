import toast from "react-hot-toast";
import {
  useCreateQuickLinkMutation,
  useDeleteQuickLinkMutation,
  useGetQuickLinksQuery,
  useUpdateQuickLinkMutation,
} from "../api/quick-links.api";

export function useQuickLink() {
  const { data = [], isLoading: isFetching } = useGetQuickLinksQuery();

  const [create, { isLoading: isCreating }] = useCreateQuickLinkMutation();
  const [update, { isLoading: isUpdating }] = useUpdateQuickLinkMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteQuickLinkMutation();

  const save = async (payload, editing) => {
    try {
      if (editing) {
        await update({ id: editing.id, ...payload }).unwrap();
        toast.success("Quick link updated");
      } else {
        await create(payload).unwrap();
        toast.success("Quick link created");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
      throw err;
    }
  };

  const deleteQuickLink = async (id) => {
    try {
      await remove(id).unwrap();
      toast.success("Quick link deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
      throw err;
    }
  };

  return {
    quickLinks: data,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    save,
    deleteQuickLink,
  };
}
