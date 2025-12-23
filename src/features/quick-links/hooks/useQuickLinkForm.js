import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { quickLinkSchema } from "../schema/quick-links.schema";

export function useQuickLinkForm(editingQuickLink) {
  const form = useForm({
    resolver: yupResolver(quickLinkSchema),
    defaultValues: {
      title: "",
      link: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (editingQuickLink) {
      reset({
        title: editingQuickLink.title,
        link: editingQuickLink.link,
      });
    } else {
      reset({
        title: "",
        link: "",
      });
    }
  }, [editingQuickLink, reset]);

  return form;
}
