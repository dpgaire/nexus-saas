import toast from "react-hot-toast";
import {
  useCreateCodeLogMutation,
  useDeleteCodeLogMutation,
  useGetCodeLogsQuery,
  useUpdateCodeLogMutation,
} from "../api/code-log.api";

export function useCodeLog() {
  const { data = [], isLoading: isFetching } = useGetCodeLogsQuery();

  const [create, { isLoading: isCreating }] = useCreateCodeLogMutation();
  const [update, { isLoading: isUpdating }] = useUpdateCodeLogMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteCodeLogMutation();

  const save = async (payload, editing) => {
    try {
      if (editing) {
        await update({ id: editing.id, ...payload }).unwrap();
        toast.success("Code log updated");
      } else {
        await create(payload).unwrap();
        toast.success("Code log created");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
      throw err;
    }
  };

  const deleteCodeLog = async (id) => {
    try {
      await remove(id).unwrap();
      toast.success("Code log deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
      throw err;
    }
  };

  return {
    codeLogs: data,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    save,
    deleteCodeLog,
  };
}
