import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { codeLogSchema } from "../schema/code-log.schema";

export function useCodeLogForm(editingCodeLog) {
  const form = useForm({
    resolver: yupResolver(codeLogSchema),
    defaultValues: {
      title: "",
      code: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (editingCodeLog) {
      reset({
        title: editingCodeLog.title,
        code: editingCodeLog.code,
      });
    } else {
      reset({
        title: "",
        code: "",
      });
    }
  }, [editingCodeLog, reset]);

  return form;
}
