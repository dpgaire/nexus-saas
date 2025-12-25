import toast from "react-hot-toast";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../api/users.api";

export function useUsers() {
  const { data = [], isLoading: isFetching } = useGetUsersQuery();

  const [create, { isLoading: isCreating }] = useCreateUserMutation();
  const [update, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteUserMutation();

  const save = async (payload, editing) => {
    try {
      if (editing) {
        await update({ id: editing.id, ...payload }).unwrap();
        toast.success("User updated");
      } else {
        await create(payload).unwrap();
        toast.success("User created");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      await remove(id).unwrap();
      toast.success("User deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
      throw err;
    }
  };

  return {
    users: data,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    save,
    deleteUser,
  };
}
