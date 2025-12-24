import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { noteSchema } from "../schema/note.schema";
import { useEffect } from "react";

export function useNoteForm(editingNote) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(noteSchema),
  });

  useEffect(() => {
    if (editingNote) {
      reset(editingNote);
    } else {
      reset({ title: "", content: "" });
    }
  }, [editingNote, reset]);

  return { register, handleSubmit, errors };
}
