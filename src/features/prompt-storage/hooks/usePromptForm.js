import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { promptStorageSchema } from "../schema/promptStorage.schema";

export function usePromptForm(editingPrompt) {
  const form = useForm({
    resolver: yupResolver(promptStorageSchema),
    defaultValues: {
      title: "",
      ai_category: "",
      prompt: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (editingPrompt) {
      reset({
        title: editingPrompt.title,
        ai_category: editingPrompt.ai_category,
        prompt: editingPrompt.prompt,
      });
    } else {
      reset({
        title: "",
        ai_category: "",
        prompt: "",
      });
    }
  }, [editingPrompt, reset]);

  return form;
}

