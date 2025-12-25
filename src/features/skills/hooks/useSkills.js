import toast from "react-hot-toast";
import { useCreateSkillMutation, useDeleteSkillMutation, useGetSkillsQuery, useUpdateSkillMutation } from "../api/skills.api";


export function useSkills() {
  const { data = [], isLoading: isFetching } = useGetSkillsQuery();

  const [create, { isLoading: isCreating }] = useCreateSkillMutation();
  const [update, { isLoading: isUpdating }] = useUpdateSkillMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteSkillMutation();

  const save = async (payload, editing) => {
    try {
      if (editing) {
        await update({ id: editing.id, ...payload }).unwrap();
        toast.success("Skill updated");
      } else {
        await create(payload).unwrap();
        toast.success("Skill created");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
      throw err;
    }
  };

  const deleteSkill = async (id) => {
    try {
      await remove(id).unwrap();
      toast.success("Skill deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
      throw err;
    }
  };

  return {
    skills: data,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    save,
    deleteSkill,
  };
}
